import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Bell, User, Settings, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  
  // Get User Data from LocalStorage
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo.role === 'artisan';

  const handleLogout = () => {
    localStorage.removeItem('ecoswap_user');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-50">
      
      {/* 1. Page Identity (Left Side) */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-eco-light/30 px-3 py-1.5 rounded-lg border border-eco-border">
          <ShieldCheck className="w-4 h-4 text-eco" />
          <span className="text-[10px] font-black text-eco uppercase tracking-widest">
            {isArtisan ? 'Artisan Verified' : 'Eco Member'}
          </span>
        </div>
      </div>

      {/* 2. Actions & Profile (Right Side) */}
      <div className="flex items-center gap-6">
        
        {/* Notifications (Optional/Static for now) */}
        <button className="p-2 text-gray-400 hover:text-eco transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {userInfo.name || 'User Name'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium capitalize">
              {userInfo.role} Account
            </p>
          </div>
          
          {/* Avatar Dropdown / Profile Link */}
          <Link to="/profile" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-eco-light hover:text-eco transition-all border border-gray-200">
            <User className="w-5 h-5" />
          </Link>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;