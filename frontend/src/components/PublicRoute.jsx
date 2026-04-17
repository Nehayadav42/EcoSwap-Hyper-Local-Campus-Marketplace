import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('ecoswap_token');

  // Agar token hai, toh Dashboard par bhejo, warna Login/Register page dikhao
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;