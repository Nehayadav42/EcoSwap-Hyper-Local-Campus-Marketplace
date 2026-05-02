import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('ecoswap_token');
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user'));

  // Not logged in
  if (!token || !userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (allowedRole && userInfo.role !== allowedRole) {
    if (userInfo.role === 'artisan') {
      return <Navigate to="/artisan-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ IMPORTANT: render nested routes
  return <Outlet />;
};

export default ProtectedRoute;