import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, UserCheck, UserX, Upload, FileText, ExternalLink, CheckCircle, Calendar, Clock, Send, X, AlertCircle } from 'lucide-react';
import moment from 'moment';
import { API_BASE_URL } from '../../config';

export default function StaffDashboard({ auth, setAuth }) {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState('Present');
  const [submissions, setSubmissions] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});

  // Leave Requests state
  const [leaves, setLeaves] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Casual Leave',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    reason: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchTasks();
    fetchLeaves();
  }, [auth]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/staff/profile`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setProfile(data);
      if (data?.attendanceStatus) {
        setAttendance(data.attendanceStatus);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/staff/tasks`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/staff/leave`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setLeaves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!newLeave.reason.trim()) {
      alert('Please enter a reason for leave!');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/staff/leave`, newLeave, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      alert('Leave application submitted successfully! Pending Admin Approval.');
      setShowLeaveModal(false);
      setNewLeave({
        leaveType: 'Casual Leave',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        reason: ''
      });
      fetchLeaves();
    } catch (err) {
      alert('Failed to submit leave application: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleAttendance = async (newStatus) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/staff/status`, 
        { attendanceStatus: newStatus },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setAttendance(data.attendanceStatus);
      alert(`Attendance status set to: ${data.attendanceStatus}`);
    } catch (err) {
      alert('Failed to update attendance status');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const submissionText = submissions[taskId] || '';
    try {
      await axios.put(`${API_BASE_URL}/api/staff/tasks/${taskId}`, 
        { status: newStatus, submission: submissionText },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert(`Task status updated to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleFileUpload = async (taskId) => {
    const file = selectedFiles[taskId];
    if (!file) {
      alert('Please choose a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading({ ...uploading, [taskId]: true });
    try {
      await axios.post(`${API_BASE_URL}/api/staff/tasks/${taskId}/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully! Task marked as Completed.');
      setSelectedFiles({ ...selectedFiles, [taskId]: null });
      fetchTasks();
    } catch (err) {
      alert('Failed to upload file: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading({ ...uploading, [taskId]: false });
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('auth');
    setAuth(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Navbar */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Staff Portal</h1>
            {profile?.incharge && profile.incharge !== 'None' && (
              <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-0.5 text-xs font-bold text-amber-800">
                ⭐ {profile.incharge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {auth.name} | {profile?.department} - {profile?.designation || 'Staff'} ({profile?.staffId})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowLeaveModal(true)} 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Calendar size={18} /> Apply for Leave
          </button>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => toggleAttendance('Present')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                attendance === 'Present' 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck size={14} /> Mark Present
            </button>
            <button
              onClick={() => toggleAttendance('Leave')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                attendance === 'Leave' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserX size={14} /> On Leave
            </button>
          </div>

          <button 
            onClick={logout} 
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Staff Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400">Incharge Role</p>
          <div className="mt-2">
            <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${
              profile?.incharge && profile.incharge !== 'None' 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {profile?.incharge && profile.incharge !== 'None' ? profile.incharge : 'No Incharge Role'}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400">Assigned Subjects</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile?.subjects?.map((sub, idx) => (
              <span key={idx} className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {sub}
              </span>
            )) || <span className="text-sm text-gray-500">None</span>}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400">Assigned Batches/Years</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile?.assignedYears?.map((yr, idx) => (
              <span key={idx} className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                {yr}
              </span>
            )) || <span className="text-sm text-gray-500">None</span>}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase text-gray-400">Attendance Status</p>
          <p className="mt-2 text-lg font-bold text-gray-800">
            {attendance === 'Present' ? (
              <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Present
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> On Leave
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
          No tasks assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(task => (
            <div key={task._id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3 border-gray-100">
                  <span>Assigned by: {task.assignedBy?.name || 'Admin'}</span>
                  <span>Deadline: {task.deadline ? moment(task.deadline).format('MMM Do, YYYY') : 'N/A'}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                {/* Submitted File / Link Display */}
                {task.submission && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden text-emerald-800 font-medium">
                      <FileText size={16} className="shrink-0 text-emerald-600" />
                      <span className="truncate">{task.submission}</span>
                    </div>
                    <a 
                      href={task.submission} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold shrink-0 ml-2"
                    >
                      View <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* File Upload Section */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Upload Submission File</label>
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition border border-gray-200 rounded-lg p-1"
                      onChange={e => setSelectedFiles({ ...selectedFiles, [task._id]: e.target.files[0] })}
                    />
                    <button
                      onClick={() => handleFileUpload(task._id)}
                      disabled={uploading[task._id]}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shrink-0 disabled:opacity-50"
                    >
                      <Upload size={14} /> {uploading[task._id] ? 'Uploading...' : 'Upload File'}
                    </button>
                  </div>
                </div>

                {/* Or Text Notes Submission */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Or Text Notes / Link</label>
                  <input 
                    type="text" 
                    placeholder="Paste link or submission notes..."
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-blue-500 mb-2"
                    value={submissions[task._id] !== undefined ? submissions[task._id] : (task.submission || '')}
                    onChange={e => setSubmissions({ ...submissions, [task._id]: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-2">
                  {task.status !== 'In Progress' && task.status !== 'Completed' && (
                    <button 
                      onClick={() => updateTaskStatus(task._id, 'In Progress')}
                      className="flex-1 rounded-lg bg-purple-600 p-2 text-xs font-bold text-white hover:bg-purple-700 transition"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status !== 'Completed' && (
                    <button 
                      onClick={() => updateTaskStatus(task._id, 'Completed')}
                      className="flex-1 rounded-lg bg-green-600 p-2 text-xs font-bold text-white hover:bg-green-700 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- LEAVE APPLICATIONS SECTION --- */}
      <div className="mt-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Leave Applications ({leaves.length})</h2>
            <p className="text-xs text-gray-500">Track your submitted leave requests and approval status</p>
          </div>
          <button 
            onClick={() => setShowLeaveModal(true)} 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Calendar size={16} /> Apply for Leave
          </button>
        </div>

        {leaves.length === 0 ? (
          <p className="text-center text-gray-500 py-6 text-sm">No leave requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase text-gray-500">
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Admin Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leaves.map(l => (
                  <tr key={l._id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-semibold text-gray-800">{l.leaveType}</td>
                    <td className="p-3 text-xs text-gray-600">
                      {moment(l.startDate).format('MMM Do, YYYY')} → {moment(l.endDate).format('MMM Do, YYYY')}
                    </td>
                    <td className="p-3 text-xs text-gray-700 max-w-xs">{l.reason}</td>
                    <td className="p-3 text-xs text-gray-500">{moment(l.appliedOn || l.createdAt).format('MMM Do, YYYY')}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        l.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status === 'Approved' && '✓ Approved'}
                        {l.status === 'Rejected' && '✗ Rejected'}
                        {l.status === 'Pending' && '⏳ Pending Approval'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500">{l.adminRemark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL: APPLY FOR LEAVE --- */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={newLeave.leaveType}
                  onChange={e => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="On Duty (OD)">On Duty (OD)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newLeave.startDate}
                    onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newLeave.endDate}
                    onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
                <textarea 
                  required 
                  rows="3"
                  placeholder="Please specify your reason for taking leave..."
                  className="w-full rounded-lg border p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={newLeave.reason}
                  onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowLeaveModal(false)} 
                  className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  <Send size={16} /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
