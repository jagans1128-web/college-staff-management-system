import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, ShieldCheck, UserCheck, User } from 'lucide-react';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('auth', JSON.stringify(res.data));
      setAuth(res.data);
      navigate(`/${res.data.role}/dashboard`);
    } catch (err) {
      alert('Login Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const fillCredentials = (emailVal, passVal) => {
    setEmail(emailVal);
    setPassword(passVal);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-3">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">College Staff Portal</h2>
          <p className="mt-2 text-sm text-gray-500">Log in to manage staff, tasks, and classes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. admin@college.com" 
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full rounded-lg bg-blue-600 p-3 text-base font-bold text-white hover:bg-blue-700 active:scale-[0.99] transition shadow-md shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center">Quick Login Demos</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => fillCredentials('admin@college.com', 'Admin@123')}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition text-xs font-medium text-gray-700"
            >
              <ShieldCheck size={18} className="text-blue-600 mb-1" />
              Admin
            </button>
            <button 
              onClick={() => fillCredentials('staff01@college.com', 'Staff@123')}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition text-xs font-medium text-gray-700"
            >
              <UserCheck size={18} className="text-teal-600 mb-1" />
              Staff
            </button>
            <button 
              onClick={() => fillCredentials('student@college.com', 'Student@123')}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition text-xs font-medium text-gray-700"
            >
              <User size={18} className="text-indigo-600 mb-1" />
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
