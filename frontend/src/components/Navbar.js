import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AUTH_ROUTES = ['/login', '/register', '/verify'];
const NAV_LINKS = [
  { path: '/', label: 'Marketplace' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/sell', label: 'Sell' }
];

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  if (AUTH_ROUTES.includes(pathname)) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-[62px]
                    bg-bg/80 backdrop-blur-xl border-b border-[rgba(61,255,110,0.13)]">
      {/* Logo */}
      <div
        className="flex items-center gap-2 font-syne text-xl font-extrabold text-green-eco cursor-pointer"
        onClick={() => nav('/')}
      >
        Uni<span className="text-offwhite">Thrift</span>
        <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full
                         bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco tracking-wide">
          🔒 Campus email (demo accepts any)
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-7">
        {NAV_LINKS.map(({ path, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => nav(path)}
            className={`text-sm font-medium transition-colors duration-150
                        ${pathname === path ? 'text-offwhite' : 'text-muted hover:text-offwhite'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => nav('/login')}
          className="border border-border text-offwhite px-5 py-2 rounded-full text-sm font-medium
                     hover:border-green-eco hover:text-green-eco transition-all duration-200">
          Log in
        </button>
        <button
          onClick={() => nav('/register')}
          className="bg-green-eco text-bg px-5 py-2 rounded-full text-sm font-bold
                     hover:bg-[#6aff93] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200">
          Get Started →
        </button>
      </div>
    </nav>
  );
}
