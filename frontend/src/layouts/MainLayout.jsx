import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-eco-bg font-sans text-gray-900 relative overflow-hidden">
      {/* Global soft blur background */}
      <div className="pointer-events-none fixed -top-24 -left-24 h-80 w-80 rounded-full bg-eco/10 blur-3xl" />
      <div className="pointer-events-none fixed top-1/3 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 left-1/4 h-72 w-72 rounded-full bg-eco-light/40 blur-3xl" />

      <div className="relative z-10">
        <Navbar />
        <Outlet /> {/* Yahan tumhara Landing Page render hoga */}
      </div>
      
      {/* Simple Footer */}
      <footer className="relative z-10 bg-eco-dark border-t border-eco py-6 px-8 flex justify-between items-center text-xs text-eco-light">
        <div className="flex items-center gap-2 font-semibold text-white">
          <span className="text-eco-light">Eco</span>Swap
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
        <p className="text-eco-light">© 2026 EcoSwap.</p>
      </footer>
    </div>
  );
};
export default MainLayout;