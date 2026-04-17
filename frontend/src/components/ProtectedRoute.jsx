import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if token exists in local storage
  const token = localStorage.getItem('ecoswap_token');

  // Agar token hai, toh andar jane do (Outlet), warna login par redirect karo
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;