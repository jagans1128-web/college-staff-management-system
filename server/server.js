const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { User, Staff, Student, Timetable, Task, LeaveRequest } = require('./models/Models');
const { protect, authorize } = require('./middleware/authMiddleware');
const moment = require('moment');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- UPLOADS DIRECTORY & STATIC SERVING ---
const os = require('os');
let uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  uploadsDir = path.join(os.tmpdir(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}
app.use('/uploads', express.static(uploadsDir));

// --- MULTER STORAGE SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// --- AUTHENTICATION API ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Update online status if staff
    if (user.role === 'staff') {
      await Staff.findOneAndUpdate({ user: user._id }, { onlineStatus: 'Online' });
    }
    
    res.json({ token, role: user.role, name: user.name, id: user._id });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', protect, async (req, res) => {
  if (req.user.role === 'staff') {
    await Staff.findOneAndUpdate({ user: req.user._id }, { onlineStatus: 'Offline' });
  }
  res.json({ message: 'Logged out' });
});

// --- ADMIN API ---
app.get('/api/admin/dashboard', protect, authorize('admin'), async (req, res) => {
  const totalStaff = await Staff.countDocuments();
  const presentStaff = await Staff.countDocuments({ attendanceStatus: 'Present' });
  const onLeaveStaff = await Staff.countDocuments({ attendanceStatus: 'Leave' });
  const onlineStaff = await Staff.countDocuments({ onlineStatus: 'Online' });
  
  const tasks = await Task.find();
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  
  const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });

  res.json({ totalStaff, presentStaff, onLeaveStaff, onlineStaff, pending, inProgress, completed, pendingLeaves });
});

app.get('/api/admin/staff', protect, authorize('admin'), async (req, res) => {
  const staffList = await Staff.find().populate('user', 'name email profileImage');
  res.json(staffList);
});

app.get('/api/admin/tasks', protect, authorize('admin'), async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: 'assignedTo',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('assignedBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADD NEW STAFF ---
app.post('/api/admin/staff', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, department, designation, subjects, assignedYears, incharge } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Staff@123',
      role: 'staff'
    });

    const staffCount = await Staff.countDocuments();
    const staffId = `STF${(staffCount + 1).toString().padStart(3, '0')}`;

    const staff = await Staff.create({
      user: user._id,
      staffId,
      department: department || 'CSE',
      designation: designation || 'Assistant Professor',
      incharge: incharge || 'None',
      subjects: Array.isArray(subjects) ? subjects : (subjects ? subjects.split(',').map(s => s.trim()) : ['Java']),
      assignedYears: Array.isArray(assignedYears) ? assignedYears : (assignedYears ? assignedYears.split(',').map(y => y.trim()) : ['II Year']),
      joiningDate: new Date()
    });

    const populatedStaff = await Staff.findById(staff._id).populate('user', 'name email profileImage');
    res.status(201).json(populatedStaff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- UPDATE STAFF INCHARGE ROLE ---
app.put('/api/admin/staff/:id/incharge', protect, authorize('admin'), async (req, res) => {
  try {
    const { incharge } = req.body;
    const staff = await Staff.findByIdAndUpdate(req.params.id, { incharge }, { new: true }).populate('user', 'name email profileImage');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DELETE STAFF ---
app.delete('/api/admin/staff/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await User.findByIdAndDelete(staff.user);
    await Task.deleteMany({ assignedTo: staff._id });
    await Timetable.deleteMany({ staff: staff._id });
    await Staff.findByIdAndDelete(staff._id);

    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- GET STAFF TIMETABLE ---
app.get('/api/admin/timetable/:staffId', protect, authorize('admin'), async (req, res) => {
  try {
    const timetable = await Timetable.find({ staff: req.params.staffId });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADD TIMETABLE SLOT ---
app.post('/api/admin/timetable', protect, authorize('admin'), async (req, res) => {
  try {
    const slot = await Timetable.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- DELETE TIMETABLE SLOT ---
app.delete('/api/admin/timetable/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timetable slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/tasks', protect, authorize('admin'), async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ADMIN LEAVE MANAGEMENT API ---
app.get('/api/admin/leaves', protect, authorize('admin'), async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate({
        path: 'staff',
        populate: { path: 'user', select: 'name email profileImage' }
      })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/admin/leaves/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark },
      { new: true }
    ).populate({
      path: 'staff',
      populate: { path: 'user', select: 'name email' }
    });

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Automatically sync staff attendanceStatus based on leave approval
    if (status === 'Approved') {
      await Staff.findByIdAndUpdate(leave.staff._id, { attendanceStatus: 'Leave' });
    } else if (status === 'Rejected') {
      await Staff.findByIdAndUpdate(leave.staff._id, { attendanceStatus: 'Present' });
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- STAFF API ---
app.get('/api/staff/tasks', protect, authorize('staff'), async (req, res) => {
  const staff = await Staff.findOne({ user: req.user._id });
  if (!staff) return res.status(404).json({ message: 'Staff profile not found' });
  const tasks = await Task.find({ assignedTo: staff._id }).populate('assignedBy', 'name');
  res.json(tasks);
});

// --- STAFF LEAVE REQUEST API ---
app.post('/api/staff/leave', protect, authorize('staff'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ message: 'Staff profile not found' });

    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await LeaveRequest.create({
      staff: staff._id,
      leaveType: leaveType || 'Casual Leave',
      startDate,
      endDate,
      reason,
      status: 'Pending'
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/staff/leave', protect, authorize('staff'), async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ message: 'Staff profile not found' });

    const leaves = await LeaveRequest.find({ staff: staff._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/staff/profile', protect, authorize('staff'), async (req, res) => {
  const staff = await Staff.findOne({ user: req.user._id }).populate('user', 'name email profileImage');
  res.json(staff);
});

app.put('/api/staff/tasks/:id', protect, authorize('staff'), async (req, res) => {
  const { status, submission } = req.body;
  const updateData = { status, submission };
  if (status === 'Completed') {
    updateData.completedAt = new Date();
  }
  const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(task);
});

// File upload for task submission
app.post('/api/staff/tasks/:id/upload', protect, authorize('staff'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { 
        submission: fileUrl, 
        status: 'Completed',
        completedAt: new Date() 
      }, 
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/staff/status', protect, authorize('staff'), async (req, res) => {
  const { attendanceStatus } = req.body;
  const staff = await Staff.findOneAndUpdate({ user: req.user._id }, { attendanceStatus }, { new: true });
  res.json(staff);
});

// --- STUDENT API (with Business Logic for Current Class) ---
app.get('/api/student/staff', protect, authorize('student'), async (req, res) => {
  const staffMembers = await Staff.find().populate('user', 'name email profileImage');
  const currentDay = moment().format('dddd');
  const currentTime = moment().format('HH:mm');

  // Inject current activity based on timetable
  const staffWithActivity = await Promise.all(staffMembers.map(async (staff) => {
    const timetables = await Timetable.find({ staff: staff._id, day: currentDay });
    
    let currentClass = null;
    for (let slot of timetables) {
      if (currentTime >= slot.startTime && currentTime <= slot.endTime) {
        currentClass = slot;
        break;
      }
    }

    let statusDisplay = '🔴 On Leave / Offline';
    if (staff.attendanceStatus === 'Present') {
      statusDisplay = staff.onlineStatus === 'Online' ? '🟢 Present / Online' : '🟢 Present / Offline';
    }

    return {
      ...staff._doc,
      statusDisplay,
      currentActivity: currentClass ? {
        subject: currentClass.subject,
        room: currentClass.classroom,
        class: `${currentClass.year} ${currentClass.department} ${currentClass.section}`
      } : { subject: 'No Class / Free', room: '-', class: '-' }
    };
  }));

  res.json(staffWithActivity);
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// --- SERVE CLIENT STATIC FILES (FOR SINGLE SERVICE DEPLOYMENT) ---
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
