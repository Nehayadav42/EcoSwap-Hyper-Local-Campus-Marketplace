import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-eco-bg font-sans text-gray-900">
      <Navbar />
      <Outlet /> {/* Yahan tumhara Landing Page render hoga */}
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-8 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="text-eco">Eco</span>Swap
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-eco">Privacy</a>
          <a href="#" className="hover:text-eco">Terms</a>
          <a href="#" className="hover:text-eco">Contact</a>
        </div>
        <p>© 2026 EcoSwap.</p>
      </footer>
    </div>
  );
};
export default MainLayout;