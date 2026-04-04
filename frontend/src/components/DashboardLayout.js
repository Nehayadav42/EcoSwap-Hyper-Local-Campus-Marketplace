import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../auth/session';
import { useAuth, profileDisplayName, profileSubtitle } from '../context/AuthContext';

const NAV_BASE = [
  { ico: '📊', label: 'Dashboard', path: '/dashboard' },
  { ico: '🏪', label: 'Marketplace', path: '/marketplace' },
  { ico: '📦', label: 'My Listings', path: '/my-listings' },
  { ico: '💬', label: 'Messages', path: '/chat', badge: 0 },
  { ico: '🌍', label: 'Carbon Tracker', path: '/carbon' },
  { ico: '🏆', label: 'Leaderboard', path: '/leaderboard' }
];

export default function DashboardLayout({ children }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, clearUser } = useAuth();

  const displayName = profileDisplayName(user);
  const subtitle = profileSubtitle(user);
  const unreadMessages = 0;

  const navItems = NAV_BASE.map(item => {
    if (item.label === 'Messages' && unreadMessages <= 0) {
      const { badge, ...rest } = item;
      return rest;
    }
    if (item.label === 'Messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
    }
    return item;
  });

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm grid" style={{ gridTemplateColumns: '240px 1fr' }}>
      <div className="border-r border-[rgba(61,255,110,0.13)] px-4 py-7 flex flex-col gap-1 bg-s1 sticky top-[62px] h-[calc(100vh-62px)] overflow-y-auto">
        <div className="flex flex-col items-center pb-5 mb-4 border-b border-[rgba(61,255,110,0.13)]">
          <div className="relative mb-2.5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[30px] border-2 border-green-eco"
              style={{ background: 'linear-gradient(135deg,#3dff6e,#2de05c)' }}
            >
              🧑
            </div>
            <div className="absolute -bottom-1 -right-1 bg-warn text-bg text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              Lv.1
            </div>
          </div>
          <div className="font-syne text-base font-extrabold text-center">{displayName || 'Student'}</div>
          <div className="text-xs text-muted mt-0.5 text-center px-1">{subtitle || 'Campus marketplace'}</div>
          <div className="w-full mt-3">
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '5%', background: 'linear-gradient(90deg,#3dff6e,#a8ff78)' }}
              />
            </div>
            <div className="text-center text-xs text-muted mt-1.5">Start trading to earn XP</div>
          </div>
        </div>

        {navItems.map(item => {
          const active = pathname === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => nav(item.path)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150
                          ${
                            active
                              ? 'bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco font-bold'
                              : 'text-muted hover:bg-s2 hover:text-offwhite'
                          }`}
            >
              <span className="text-lg flex-shrink-0">{item.ico}</span>
              {item.label}
              {item.badge ? (
                <span className="ml-auto bg-green-eco text-bg text-[10px] font-extrabold px-2 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </button>
          );
        })}

        <div className="h-px bg-[rgba(61,255,110,0.13)] my-2" />
        <button
          type="button"
          onClick={() => nav('/settings')}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150
                      ${
                        pathname === '/settings'
                          ? 'bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco font-bold'
                          : 'text-muted hover:bg-s2 hover:text-offwhite'
                      }`}
        >
          <span className="text-lg">⚙️</span> Settings
        </button>
        <button
          type="button"
          onClick={() => {
            clearToken();
            clearUser();
            nav('/login');
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-s2 hover:text-offwhite w-full text-left transition-all"
        >
          <span className="text-lg">🚪</span> Sign Out
        </button>
      </div>

      <div className="p-8 overflow-y-auto flex flex-col gap-6 min-h-[calc(100vh-62px)]">{children}</div>
    </div>
  );
}
