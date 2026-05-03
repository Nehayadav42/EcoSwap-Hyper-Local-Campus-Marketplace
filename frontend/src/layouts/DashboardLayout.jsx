// DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar'; // 👈 Change this
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <DashboardNavbar /> {/* 👈 Use the new one here */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;