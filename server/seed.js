const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Staff, Student, Timetable, Task, LeaveRequest } = require('./models/Models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  try {
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Student.deleteMany({});
    await Timetable.deleteMany({});
    await Task.deleteMany({});
    await LeaveRequest.deleteMany({});

    // Admin
    const adminUser = await User.create({ name: 'System Admin', email: 'admin@college.com', password: 'Admin@123', role: 'admin' });

    // Student
    const stuUser = await User.create({ name: 'John Doe', email: 'student@college.com', password: 'Student@123', role: 'student' });
    await Student.create({ user: stuUser._id, studentId: 'STU001', department: 'CSE', year: 'II Year', section: 'A' });

    // Generate 20 Staff
    const createdStaff = [];
    for (let i = 1; i <= 20; i++) {
      const sUser = await User.create({ 
        name: `Staff Member ${i}`, 
        email: `staff${i.toString().padStart(2, '0')}@college.com`, 
        password: 'Staff@123', 
        role: 'staff' 
      });
      const inchargeRoles = [
        'Class Incharge - II Year CSE A',
        'Lab Incharge - Java Programming Lab',
        'Class Incharge - III Year IT B',
        'Exam Cell Incharge',
        'Placement & Training Incharge',
        'Class Incharge - I Year CSE',
        'Lab Incharge - DBMS Lab',
        'Department HOD / Incharge',
        'Class Incharge - IV Year IT',
        'Class Incharge - II Year ECE'
      ];

      const staffObj = await Staff.create({
        user: sUser._id,
        staffId: `STF${i.toString().padStart(3, '0')}`,
        department: i % 2 === 0 ? 'CSE' : 'IT',
        designation: i === 8 ? 'Professor & HOD' : (i % 3 === 0 ? 'Associate Professor' : 'Assistant Professor'),
        subjects: ['Java', 'DBMS'],
        assignedYears: ['II Year', 'III Year'],
        incharge: inchargeRoles[(i - 1) % inchargeRoles.length],
        attendanceStatus: i % 5 === 0 ? 'Leave' : 'Present',
        onlineStatus: i % 3 === 0 ? 'Online' : 'Offline'
      });
      createdStaff.push(staffObj);
    }

    // Create sample timetable slots & tasks for staff
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let s of createdStaff) {
      for (let day of days) {
        await Timetable.create({
          staff: s._id,
          day,
          startTime: '08:00',
          endTime: '20:00',
          department: s.department,
          year: 'II Year',
          section: 'A',
          subject: s.subjects[0] || 'Computer Science',
          classroom: 'Lab 3'
        });
      }

      await Task.create({
        title: `Submit Grades for ${s.department}`,
        description: 'Please upload the evaluated mid-term marks sheet before Friday.',
        assignedTo: s._id,
        assignedBy: adminUser._id,
        priority: 'High',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'Pending'
      });
    }

    // Sample Leave Requests
    if (createdStaff.length >= 3) {
      await LeaveRequest.create({
        staff: createdStaff[0]._id,
        leaveType: 'Casual Leave',
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        reason: 'Attending family function in hometown.',
        status: 'Pending'
      });

      await LeaveRequest.create({
        staff: createdStaff[1]._id,
        leaveType: 'Sick Leave',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reason: 'Severe fever and medical doctor consultation.',
        status: 'Approved',
        adminRemark: 'Approved. Take rest.'
      });

      await LeaveRequest.create({
        staff: createdStaff[2]._id,
        leaveType: 'On Duty (OD)',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        reason: 'Attending Anna University National Technical Conference.',
        status: 'Pending'
      });
    }

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}
seed();
