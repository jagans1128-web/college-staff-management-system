import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, PlusCircle, UserPlus, Calendar, Trash2, Search, X, FileText, ExternalLink, ChevronRight, Award, Edit3, Check, XCircle, Clock } from 'lucide-react';
import moment from 'moment';

export default function AdminDashboard({ auth, setAuth }) {
  const [stats, setStats] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchStaff, setSearchStaff] = useState('');
  const [inchargeFilter, setInchargeFilter] = useState('all'); // 'all', 'incharge', 'no-incharge'
  
  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showInchargeModal, setShowInchargeModal] = useState(false);

  // Active Staff for Timetable & Incharge
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffTimetable, setStaffTimetable] = useState([]);
  const [inchargeInput, setInchargeInput] = useState('Class Incharge - II Year CSE A');

  // Detail Modal for Stat Cards
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    title: '',
    type: '', // 'staff' or 'task'
    data: []
  });
  
  // Forms
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    deadline: ''
  });

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: 'Staff@123',
    department: 'CSE',
    designation: 'Assistant Professor',
    incharge: 'Class Incharge - II Year CSE A',
    subjects: '',
    assignedYears: ''
  });

  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    department: 'CSE',
    year: 'II Year',
    section: 'A',
    subject: 'Java',
    classroom: 'Lab 1'
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveRemarks, setLeaveRemarks] = useState({});

  useEffect(() => {
    fetchStats();
    fetchStaff();
    fetchAllTasks();
    fetchLeaveRequests();
  }, [auth]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/staff', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStaffList(data);
      if (data.length > 0 && !newTask.assignedTo) {
        setNewTask(prev => ({ ...prev, assignedTo: data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/tasks', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setAllTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/leaves', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setLeaveRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLeaveStatus = async (leaveId, newStatus) => {
    const remark = leaveRemarks[leaveId] || '';
    try {
      await axios.put(`http://localhost:5000/api/admin/leaves/${leaveId}`, 
        { status: newStatus, adminRemark: remark },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert(`Leave request ${newStatus.toLowerCase()} successfully!`);
      fetchLeaveRequests();
      fetchStats();
      fetchStaff();
    } catch (err) {
      alert('Failed to update leave status: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
  };

  // --- STAT CARD CLICK HANDLERS ---
  const handleStatCardClick = (category) => {
    if (category === 'totalStaff') {
      setDetailModal({
        isOpen: true,
        title: 'All Staff Members',
        type: 'staff',
        data: staffList
      });
    } else if (category === 'presentStaff') {
      setDetailModal({
        isOpen: true,
        title: 'Present Staff Members',
        type: 'staff',
        data: staffList.filter(s => s.attendanceStatus === 'Present')
      });
    } else if (category === 'onLeaveStaff') {
      setDetailModal({
        isOpen: true,
        title: 'Staff Members On Leave',
        type: 'staff',
        data: staffList.filter(s => s.attendanceStatus === 'Leave')
      });
    } else if (category === 'onlineStaff') {
      setDetailModal({
        isOpen: true,
        title: 'Currently Online Staff Members',
        type: 'staff',
        data: staffList.filter(s => s.onlineStatus === 'Online')
      });
    } else if (category === 'pendingTasks') {
      setDetailModal({
        isOpen: true,
        title: 'Pending Tasks',
        type: 'task',
        data: allTasks.filter(t => t.status === 'Pending')
      });
    } else if (category === 'inProgressTasks') {
      setDetailModal({
        isOpen: true,
        title: 'In Progress Tasks',
        type: 'task',
        data: allTasks.filter(t => t.status === 'In Progress')
      });
    } else if (category === 'completedTasks') {
      setDetailModal({
        isOpen: true,
        title: 'Completed Tasks & Submissions',
        type: 'task',
        data: allTasks.filter(t => t.status === 'Completed')
      });
    }
  };

  // --- STAFF ACTIONS ---
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/staff', newStaff, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert('Staff added successfully!');
      setShowAddStaffModal(false);
      setNewStaff({
        name: '',
        email: '',
        password: 'Staff@123',
        department: 'CSE',
        designation: 'Assistant Professor',
        incharge: 'Class Incharge - II Year CSE A',
        subjects: '',
        assignedYears: ''
      });
      fetchStaff();
      fetchStats();
    } catch (err) {
      alert('Failed to add staff: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Are you sure you want to remove staff member: ${staffName}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert('Staff member removed successfully!');
      fetchStaff();
      fetchStats();
    } catch (err) {
      alert('Failed to delete staff: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- INCHARGE ACTION ---
  const openInchargeModal = (staff) => {
    setSelectedStaff(staff);
    setInchargeInput(staff.incharge && staff.incharge !== 'None' ? staff.incharge : 'Class Incharge - II Year CSE A');
    setShowInchargeModal(true);
  };

  const handleSetIncharge = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/staff/${selectedStaff._id}/incharge`, 
        { incharge: inchargeInput },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert(`Incharge role updated for ${selectedStaff.user?.name}!`);
      setShowInchargeModal(false);
      fetchStaff();
    } catch (err) {
      alert('Failed to set incharge: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- TIMETABLE ACTIONS ---
  const openTimetableModal = async (staff) => {
    setSelectedStaff(staff);
    setNewSlot(prev => ({ ...prev, department: staff.department || 'CSE' }));
    try {
      const { data } = await axios.get(`http://localhost:5000/api/admin/timetable/${staff._id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStaffTimetable(data);
      setShowTimetableModal(true);
    } catch (err) {
      alert('Failed to load timetable');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      await axios.post('http://localhost:5000/api/admin/timetable', 
        { ...newSlot, staff: selectedStaff._id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert('Timetable slot added!');
      // Refresh staff timetable
      const { data } = await axios.get(`http://localhost:5000/api/admin/timetable/${selectedStaff._id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStaffTimetable(data);
    } catch (err) {
      alert('Failed to add timetable slot: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/timetable/${slotId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStaffTimetable(prev => prev.filter(s => s._id !== slotId));
    } catch (err) {
      alert('Failed to delete slot');
    }
  };

  // --- TASK ACTION ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/tasks', newTask, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert('Task assigned successfully!');
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', assignedTo: staffList[0]?._id || '', priority: 'Medium', deadline: '' });
      fetchStats();
      fetchAllTasks();
    } catch (err) {
      alert('Failed to assign task: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredStaffList = staffList.filter(s => {
    const matchesSearch = 
      (s.user?.name || '').toLowerCase().includes(searchStaff.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(searchStaff.toLowerCase()) ||
      (s.staffId || '').toLowerCase().includes(searchStaff.toLowerCase()) ||
      (s.incharge || '').toLowerCase().includes(searchStaff.toLowerCase());
    
    if (inchargeFilter === 'incharge') {
      return matchesSearch && s.incharge && s.incharge !== 'None';
    } else if (inchargeFilter === 'no-incharge') {
      return matchesSearch && (!s.incharge || s.incharge === 'None');
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {auth.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowAddStaffModal(true)} 
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <UserPlus size={18} /> Add New Staff
          </button>
          <button 
            onClick={() => setShowTaskModal(true)} 
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <PlusCircle size={18} /> Assign Task
          </button>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Cards (Clickable) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <StatCard 
          title="Total Staff" 
          value={stats.totalStaff || 0} 
          color="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer border border-blue-200"
          onClick={() => handleStatCardClick('totalStaff')}
        />
        <StatCard 
          title="Present Staff" 
          value={stats.presentStaff || 0} 
          color="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border border-green-200"
          onClick={() => handleStatCardClick('presentStaff')}
        />
        <StatCard 
          title="On Leave" 
          value={stats.onLeaveStaff || 0} 
          color="bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer border border-red-200"
          onClick={() => handleStatCardClick('onLeaveStaff')}
        />
        <StatCard 
          title="Online Staff" 
          value={stats.onlineStaff || 0} 
          color="bg-teal-100 text-teal-800 hover:bg-teal-200 cursor-pointer border border-teal-200"
          onClick={() => handleStatCardClick('onlineStaff')}
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Task & Leave Overview</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <StatCard 
          title="Pending Leave Requests" 
          value={stats.pendingLeaves || 0} 
          color="bg-amber-100 text-amber-900 hover:bg-amber-200 cursor-pointer border border-amber-300 font-bold"
          onClick={() => {
            const leaveSection = document.getElementById('leave-approval-section');
            if (leaveSection) leaveSection.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pending || 0} 
          color="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer border border-yellow-200"
          onClick={() => handleStatCardClick('pendingTasks')}
        />
        <StatCard 
          title="In Progress Tasks" 
          value={stats.inProgress || 0} 
          color="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer border border-purple-200"
          onClick={() => handleStatCardClick('inProgressTasks')}
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completed || 0} 
          color="bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer border border-gray-300"
          onClick={() => handleStatCardClick('completedTasks')}
        />
      </div>

      {/* Leave Approvals Section */}
      <div id="leave-approval-section" className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Staff Leave Requests ({leaveRequests.length})</h2>
            <p className="text-xs text-gray-500">Review, approve, or reject staff leave applications with remarks</p>
          </div>
          <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
            ⏳ {leaveRequests.filter(l => l.status === 'Pending').length} Pending Approval
          </span>
        </div>

        {leaveRequests.length === 0 ? (
          <p className="text-center text-gray-500 py-6 text-sm">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase text-gray-500">
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Dates & Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Admin Remark & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leaveRequests.map(leave => (
                  <tr key={leave._id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3">
                      <p className="font-bold text-gray-900">{leave.staff?.user?.name || 'Staff'}</p>
                      <p className="text-xs text-gray-500">{leave.staff?.department} | {leave.staff?.staffId}</p>
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{leave.leaveType}</td>
                    <td className="p-3 text-xs text-gray-600">
                      <p className="font-medium text-gray-800">{moment(leave.startDate).format('MMM Do, YYYY')} → {moment(leave.endDate).format('MMM Do, YYYY')}</p>
                      <p className="text-gray-400">Applied: {moment(leave.appliedOn || leave.createdAt).format('MMM Do, YYYY')}</p>
                    </td>
                    <td className="p-3 text-xs text-gray-700 max-w-xs">{leave.reason}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status === 'Approved' && '✓ Approved'}
                        {leave.status === 'Rejected' && '✗ Rejected'}
                        {leave.status === 'Pending' && '⏳ Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      {leave.status === 'Pending' ? (
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            placeholder="Optional remark..." 
                            className="w-full rounded border px-2 py-1 text-xs outline-none focus:border-blue-500"
                            value={leaveRemarks[leave._id] || ''}
                            onChange={e => setLeaveRemarks({ ...leaveRemarks, [leave._id]: e.target.value })}
                          />
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateLeaveStatus(leave._id, 'Approved')}
                              className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700 transition"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateLeaveStatus(leave._id, 'Rejected')}
                              className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 transition"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">{leave.adminRemark || 'No remark added'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff Management Table */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Staff Management ({filteredStaffList.length})</h2>
            <p className="text-xs text-gray-500">Manage staff profiles, class/lab incharge assignments, and timetables</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Incharge filter tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold">
              <button 
                onClick={() => setInchargeFilter('all')}
                className={`px-3 py-1.5 rounded-md transition ${inchargeFilter === 'all' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'}`}
              >
                All Staff
              </button>
              <button 
                onClick={() => setInchargeFilter('incharge')}
                className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 ${inchargeFilter === 'incharge' ? 'bg-amber-500 text-white shadow-sm font-bold' : 'text-amber-800 hover:text-amber-900'}`}
              >
                <Award size={13} /> ⭐ Incharge Staff
              </button>
              <button 
                onClick={() => setInchargeFilter('no-incharge')}
                className={`px-3 py-1.5 rounded-md transition ${inchargeFilter === 'no-incharge' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-600 hover:text-gray-900'}`}
              >
                No Incharge
              </button>
            </div>

            <div className="flex items-center rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 w-full md:w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search staff or incharge..." 
                className="w-full bg-transparent outline-none text-sm"
                value={searchStaff}
                onChange={e => setSearchStaff(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase text-gray-500">
                <th className="p-3">Staff ID</th>
                <th className="p-3">Name & Email</th>
                <th className="p-3">Dept & Designation</th>
                <th className="p-3">Incharge Role</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Online</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredStaffList.map(staff => (
                <tr key={staff._id} className="hover:bg-gray-50/80 transition">
                  <td className="p-3 font-semibold text-gray-700">{staff.staffId}</td>
                  <td className="p-3">
                    <p className="font-bold text-gray-900">{staff.user?.name}</p>
                    <p className="text-xs text-gray-500">{staff.user?.email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-800">{staff.department}</p>
                    <p className="text-xs text-gray-500">{staff.designation}</p>
                  </td>
                  <td className="p-3">
                    {staff.incharge && staff.incharge !== 'None' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                        <Award size={13} className="text-amber-600" /> {staff.incharge}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      staff.attendanceStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.attendanceStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      staff.onlineStatus === 'Online' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {staff.onlineStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openInchargeModal(staff)}
                        className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                        title="Set Class/Lab Incharge"
                      >
                        <Award size={14} /> Incharge
                      </button>
                      <button 
                        onClick={() => openTimetableModal(staff)}
                        className="flex items-center gap-1 rounded bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                        title="Set Timetable"
                      >
                        <Calendar size={14} /> Timetable
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(staff._id, staff.user?.name)}
                        className="flex items-center gap-1 rounded bg-rose-50 px-2 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Staff"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL FOR STAT CARDS */}
      {detailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">{detailModal.title} ({detailModal.data.length})</h3>
              <button onClick={() => setDetailModal({ ...detailModal, isOpen: false })} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {detailModal.data.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No records found for this category.</p>
            ) : detailModal.type === 'staff' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailModal.data.map(staff => (
                  <div key={staff._id} className="rounded-xl border p-4 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{staff.user?.name}</h4>
                          <p className="text-xs text-gray-500">{staff.user?.email}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          staff.attendanceStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {staff.attendanceStatus}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 space-y-1">
                        <p><span className="font-semibold">Dept:</span> {staff.department} | <span className="font-semibold">ID:</span> {staff.staffId}</p>
                        <p><span className="font-semibold">Designation:</span> {staff.designation}</p>
                        <p><span className="font-semibold text-amber-700">⭐ Incharge Role:</span> {staff.incharge || 'None'}</p>
                        <p><span className="font-semibold">Subjects:</span> {staff.subjects?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-3 border-t pt-2 flex justify-between items-center text-xs">
                      <span className={`font-semibold ${staff.onlineStatus === 'Online' ? 'text-teal-600' : 'text-gray-400'}`}>
                        • {staff.onlineStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TASK DETAILS */
              <div className="space-y-4">
                {detailModal.data.map(task => (
                  <div key={task._id} className="rounded-xl border p-4 bg-gray-50 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-base">{task.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t pt-2 border-gray-200">
                      <span><strong className="text-gray-700">Assigned To:</strong> {task.assignedTo?.user?.name || 'Staff'} ({task.assignedTo?.department})</span>
                      <span><strong className="text-gray-700">Priority:</strong> {task.priority}</span>
                      <span><strong className="text-gray-700">Deadline:</strong> {task.deadline ? moment(task.deadline).format('MMM Do, YYYY') : 'N/A'}</span>
                    </div>

                    {/* Submission Attachment / Link */}
                    {task.submission && (
                      <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 font-medium overflow-hidden">
                          <FileText size={16} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{task.submission}</span>
                        </div>
                        <a 
                          href={task.submission} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 shrink-0 ml-2"
                        >
                          Open / Download <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SET INCHARGE ROLE */}
      {showInchargeModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Set Class / Lab Incharge</h3>
              <button onClick={() => setShowInchargeModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Assign a class or lab incharge responsibility for <strong>{selectedStaff.user?.name}</strong> ({selectedStaff.staffId}).
            </p>
            <form onSubmit={handleSetIncharge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incharge Responsibility</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Class Incharge - II Year CSE A"
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-amber-500" 
                  value={inchargeInput} 
                  onChange={e => setInchargeInput(e.target.value)} 
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <button type="button" onClick={() => setInchargeInput('Class Incharge - I Year CSE')} className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded border border-amber-200 hover:bg-amber-100 transition">Class Incharge I-CSE</button>
                <button type="button" onClick={() => setInchargeInput('Class Incharge - II Year CSE A')} className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded border border-amber-200 hover:bg-amber-100 transition">Class Incharge II-CSE A</button>
                <button type="button" onClick={() => setInchargeInput('Class Incharge - III Year IT B')} className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded border border-amber-200 hover:bg-amber-100 transition">Class Incharge III-IT B</button>
                <button type="button" onClick={() => setInchargeInput('Lab Incharge - Java Programming Lab')} className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded border border-purple-200 hover:bg-purple-100 transition">Java Lab Incharge</button>
                <button type="button" onClick={() => setInchargeInput('Lab Incharge - DBMS Lab')} className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded border border-purple-200 hover:bg-purple-100 transition">DBMS Lab Incharge</button>
                <button type="button" onClick={() => setInchargeInput('Exam Cell Incharge')} className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-100 transition">Exam Cell Incharge</button>
                <button type="button" onClick={() => setInchargeInput('Placement & Training Incharge')} className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition">Placement Incharge</button>
                <button type="button" onClick={() => setInchargeInput('Department HOD / Incharge')} className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded border border-indigo-200 hover:bg-indigo-100 transition">HOD / Dept Incharge</button>
                <button type="button" onClick={() => setInchargeInput('None')} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded border hover:bg-gray-200 transition">Clear (None)</button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowInchargeModal(false)} 
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Save Incharge Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW STAFF */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={newStaff.name} 
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newStaff.email} 
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newStaff.password} 
                    onChange={e => setNewStaff({...newStaff, password: e.target.value})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newStaff.department} 
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newStaff.designation} 
                    onChange={e => setNewStaff({...newStaff, designation: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class / Lab Incharge (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Class Incharge - II Year CSE A"
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={newStaff.incharge} 
                  onChange={e => setNewStaff({...newStaff, incharge: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Java, DBMS, Python"
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={newStaff.subjects} 
                  onChange={e => setNewStaff({...newStaff, subjects: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Years (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. II Year, III Year"
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={newStaff.assignedYears} 
                  onChange={e => setNewStaff({...newStaff, assignedYears: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddStaffModal(false)} 
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE STAFF TIMETABLE */}
      {showTimetableModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Manage Timetable</h3>
                <p className="text-sm text-gray-500">Staff: {selectedStaff.user?.name} ({selectedStaff.department})</p>
              </div>
              <button onClick={() => setShowTimetableModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {/* Existing Slots */}
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Current Slots ({staffTimetable.length})</h4>
              {staffTimetable.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No timetable slots configured yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staffTimetable.map(slot => (
                    <div key={slot._id} className="flex justify-between items-center rounded-lg border p-3 bg-gray-50">
                      <div>
                        <p className="font-bold text-sm text-blue-700">{slot.day} ({slot.startTime} - {slot.endTime})</p>
                        <p className="text-xs font-semibold text-gray-800">{slot.subject} | Room: {slot.classroom}</p>
                        <p className="text-xs text-gray-500">{slot.year} {slot.department} Sec-{slot.section}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Slot Form */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Add New Timetable Slot</h4>
              <form onSubmit={handleAddSlot} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                    <select 
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.day}
                      onChange={e => setNewSlot({...newSlot, day: e.target.value})}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Time (HH:mm)</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="09:00"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.startTime}
                      onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Time (HH:mm)</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="10:00"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.endTime}
                      onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Java"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.subject}
                      onChange={e => setNewSlot({...newSlot, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Classroom / Lab</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lab 3"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.classroom}
                      onChange={e => setNewSlot({...newSlot, classroom: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                    <input 
                      type="text" 
                      required
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.department}
                      onChange={e => setNewSlot({...newSlot, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. II Year"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.year}
                      onChange={e => setNewSlot({...newSlot, year: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. A"
                      className="w-full rounded-lg border p-2 text-sm"
                      value={newSlot.section}
                      onChange={e => setNewSlot({...newSlot, section: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setShowTimetableModal(false)}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600"
                  >
                    Done
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    + Add Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN TASK */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Assign Task to Staff</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="3" 
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newTask.description} 
                  onChange={e => setNewTask({...newTask, description: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To Staff</label>
                <select 
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newTask.assignedTo} 
                  onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.department} - {s.staffId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                    value={newTask.priority} 
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input 
                    type="date" 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                    value={newTask.deadline} 
                    onChange={e => setNewTask({...newTask, deadline: e.target.value})} 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)} 
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`rounded-lg p-6 shadow transition transform hover:-translate-y-0.5 ${color}`}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <ChevronRight size={18} className="opacity-60" />
    </div>
    <p className="mt-2 text-3xl font-bold">{value}</p>
    <p className="text-xs opacity-70 mt-1 font-medium">Click to view details →</p>
  </div>
);
