import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user'));
  const location = useLocation();

  if (!userInfo || !userInfo._id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && userInfo.role !== allowedRole) {
    // Yahan redirect karne se pehle check karo ki kya hum already sahi raste par toh nahi?
    const dest = userInfo.role === 'artisan' ? '/artisan-dashboard' : '/dashboard';
    
    // Agar hum already mismatch wali state mein hain, toh loop break karne ke liye redirect karo
    // Lekin ensure karo ki hum usi path par wapas na bhej dein
    if (location.pathname !== dest) {
      return <Navigate to={dest} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;  