import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-eco-bg font-sans relative overflow-hidden">
      {/* Global soft blur background */}
      <div className="pointer-events-none fixed -top-24 -left-24 h-80 w-80 rounded-full bg-eco/10 blur-3xl" />
      <div className="pointer-events-none fixed top-1/3 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 left-1/4 h-72 w-72 rounded-full bg-eco-light/40 blur-3xl" />

      <div className="relative z-10">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};
export default AuthLayout;