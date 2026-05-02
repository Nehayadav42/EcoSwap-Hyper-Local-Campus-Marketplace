import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 👇 '/artisan-dashboard' array mein add kiya hai
  const isDashboard = ['/dashboard', '/swaps', '/chats', '/profile', '/artisan', '/artisan-dashboard'].includes(location.pathname);
  const isAuth = ['/login', '/register'].includes(location.pathname);

  // 👇 User ka role nikal rahe hain
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
  const isArtisan = userInfo?.role === 'artisan';

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('ecoswap_token');
    localStorage.removeItem('ecoswap_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 bg-eco rounded-md flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-gray-900">EcoSwap</span>
      </Link>

      {/* Dynamic Center Links (Only on Landing) */}
      {!isDashboard && !isAuth && (
        <div className="hidden md:flex gap-6">
          <a href="#how-it-works" className="text-[16px] text-gray-600 hover:text-eco cursor-pointer">How it works</a>
          <a href="#products" className="text-[16px] text-gray-600 hover:text-eco cursor-pointer">Products</a>
          <a href="#about" className="text-[16px] text-gray-600 hover:text-eco cursor-pointer">About</a>
        </div>
      )}

      {/* Dynamic Right Side Info/Buttons */}
      {isDashboard ? (
        <div className="flex items-center gap-4">
          {/* 👇 Dynamic role text */}
          <span className="text-[13px] text-gray-600 font-medium capitalize">
            {isArtisan ? 'Artisan' : 'Eco Member'}
          </span>
          
          <button 
            onClick={handleLogout} 
            className="bg-white text-eco border border-eco-border px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : isAuth ? (
        <Link to="/" className="bg-white text-eco border border-eco-border px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-eco-light transition-colors">
          ← Back to home
        </Link>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="bg-white text-eco border border-eco-border px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-eco-light transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-eco text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-eco-dark transition-colors border border-transparent">
            Sign up free
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;