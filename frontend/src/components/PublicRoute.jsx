import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  // Token ki jagah user info check karo kyunki ProtectedRoute bhi wahi kar raha hai
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user'));

  if (userInfo && userInfo._id) {
    // Role based redirect taaki loop na bane
    const dashboardPath = userInfo.role === 'artisan' ? '/artisan-dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;