import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { label: '🌿 Landing',   path: '/' },
  { label: '🏪 Market',    path: '/marketplace' },
  { label: '🔐 Login',     path: '/login' },
  { label: '📝 Register',  path: '/register' },
  { label: '✉️ Verify',    path: '/verify' },
  { label: '💬 Chat',      path: '/chat' },
  { label: '📊 Dashboard', path: '/dashboard' },
];

export default function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex gap-1
                    bg-s1/95 backdrop-blur-xl border border-[rgba(61,255,110,0.13)]
                    rounded-full px-2.5 py-1.5 shadow-card">
      {TABS.map(t => (
        <button
          key={t.path}
          onClick={() => nav(t.path)}
          className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200
                      ${pathname === t.path
                        ? 'bg-green-eco text-bg'
                        : 'text-muted hover:text-offwhite'}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
