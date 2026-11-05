import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Search, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export default function StudentDashboard({ auth, setAuth }) {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/student/staff`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setStaffList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    const interval = setInterval(fetchStaff, 10000); // Auto-refresh status every 10 seconds
    return () => clearInterval(interval);
  }, [auth]);

  const filteredStaff = staffList.filter(s => 
    (s.user?.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Portal - Staff Live Status</h1>
          <p className="text-sm text-gray-500">Track staff presence, online activity, and current timetable room</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStaff} 
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button 
            onClick={() => { localStorage.removeItem('auth'); setAuth(null); }} 
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center rounded-xl bg-white p-3 shadow-sm border border-gray-100">
        <Search className="mx-2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search staff by name or department..." 
          className="w-full p-2 outline-none text-gray-700 placeholder-gray-400 text-sm"
          value={search} 
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map(staff => (
          <div key={staff._id} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{staff.user?.name}</h3>
                <p className="text-sm text-gray-500">{staff.department} - {staff.designation}</p>
                {staff.incharge && staff.incharge !== 'None' && (
                  <span className="mt-1 inline-block rounded-md bg-amber-100 border border-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                    ⭐ {staff.incharge}
                  </span>
                )}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                staff.attendanceStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {staff.statusDisplay}
              </span>
            </div>
            
            <div className="mt-4 rounded-lg bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Activity</p>
              <p className="mt-1 font-semibold text-gray-800">{staff.currentActivity?.subject}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-600 border-t border-gray-200 pt-2">
                <span>Class: {staff.currentActivity?.class}</span>
                <span className="font-semibold text-blue-600">Room: {staff.currentActivity?.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
