const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
  profileImage: { type: String, default: '' },
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const StaffSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: String, required: true, unique: true },
  department: String,
  designation: String,
  subjects: [String],
  assignedYears: [String],
  incharge: { type: String, default: 'None' },
  attendanceStatus: { type: String, enum: ['Present', 'Leave'], default: 'Present' },
  onlineStatus: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
  joiningDate: Date
}, { timestamps: true });

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  department: String,
  year: String,
  section: String
}, { timestamps: true });

const TimetableSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  startTime: String, // e.g., "09:00"
  endTime: String,   // e.g., "10:00"
  department: String,
  year: String,
  section: String,
  subject: String,
  classroom: String
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  deadline: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Rejected'], default: 'Pending' },
  submission: String, // File path or text link
  adminFeedback: String,
  completedAt: Date
}, { timestamps: true });

const LeaveRequestSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  leaveType: { type: String, enum: ['Casual Leave', 'Sick Leave', 'On Duty (OD)', 'Earned Leave', 'Other'], default: 'Casual Leave' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  adminRemark: String,
  appliedOn: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Staff: mongoose.model('Staff', StaffSchema),
  Student: mongoose.model('Student', StudentSchema),
  Timetable: mongoose.model('Timetable', TimetableSchema),
  Task: mongoose.model('Task', TaskSchema),
  LeaveRequest: mongoose.model('LeaveRequest', LeaveRequestSchema)
};
