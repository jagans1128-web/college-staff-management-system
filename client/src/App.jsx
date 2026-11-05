import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')) || null);

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!auth) return <Navigate to="/login" />;
    if (auth.role !== allowedRole) return <Navigate to={`/${auth.role}/dashboard`} />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={auth ? <Navigate to={`/${auth.role}/dashboard`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard auth={auth} setAuth={setAuth} /></ProtectedRoute>
        } />
        
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRole="staff"><StaffDashboard auth={auth} setAuth={setAuth} /></ProtectedRoute>
        } />
        
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student"><StudentDashboard auth={auth} setAuth={setAuth} /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
