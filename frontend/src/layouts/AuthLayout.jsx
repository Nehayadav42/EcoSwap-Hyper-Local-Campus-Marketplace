import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-eco-bg font-sans">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default AuthLayout;