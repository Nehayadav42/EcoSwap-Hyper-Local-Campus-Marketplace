import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, Users, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Swaps', path: '/swaps', icon: Package },
    { name: 'Chats', path: '/chats', icon: MessageSquare },
  ];

  const discoverItems = [
    { name: 'Find Artisans', path: '/artisan', icon: Users },
  ];

  const accountItems = [
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link 
        to={item.path} 
        className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
          isActive ? 'bg-eco-light text-eco font-medium' : 'text-gray-600 hover:bg-eco-light hover:text-eco'
        }`}
      >
        <item.icon className="w-4 h-4" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 min-h-[calc(100vh-56px)] flex flex-col">
      {/* User Profile Snippet */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-eco-light flex items-center justify-center text-eco font-bold text-xs shrink-0">
          RK
        </div>
        <div>
          <div className="text-[13px] font-semibold text-gray-900">Rahul Kumar</div>
          <div className="text-[11px] text-gray-500">Eco member</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="py-3 flex-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2">Main</div>
        {navItems.map(item => <NavLink key={item.name} item={item} />)}
        
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 mt-2">Discover</div>
        {discoverItems.map(item => <NavLink key={item.name} item={item} />)}
        
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 mt-2">Account</div>
        {accountItems.map(item => <NavLink key={item.name} item={item} />)}
      </div>
    </div>
  );
};
export default Sidebar;