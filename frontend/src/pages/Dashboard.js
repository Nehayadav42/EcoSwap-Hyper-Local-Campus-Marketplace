import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';
import { clearToken } from '../auth/session';
import { useAuth, profileDisplayName, profileFirstName, profileSubtitle, greetingPeriod } from '../context/AuthContext';

const NAV_BASE = [
  { ico: '📊', label: 'Dashboard', path: '/dashboard', active: true },
  { ico: '🏪', label: 'Marketplace', path: '/', active: false },
  { ico: '📦', label: 'My Listings', path: '#', active: false },
  { ico: '💬', label: 'Messages', path: '/chat', active: false, badge: 0 },
  { ico: '🌍', label: 'Carbon Tracker', path: '#', active: false },
  { ico: '🏆', label: 'Leaderboard', path: '/leaderboard', active: false }
];

const METRICS_STARTER = [
  { ico: '🌍', val: '0 kg', lbl: 'CO₂ Saved', delta: 'Tracks when you buy or sell pre-owned', up: true },
  { ico: '💰', val: '₹0', lbl: 'Total Earned', delta: 'From completed sales', up: true },
  { ico: '📦', val: '0', lbl: 'Items Sold', delta: 'List on the marketplace to start', up: true },
  { ico: '⭐', val: '—', lbl: 'Seller Rating', delta: 'Shows up after your first reviews', up: true }
];

const MILESTONES_STARTER = [
  { ico: '🌱', label: 'First 5 kg CO₂ saved', pct: 0 },
  { ico: '🌳', label: '25 kg CO₂ saved', pct: 0 },
  { ico: '🌍', label: '50 kg CO₂ saved', pct: 0 }
];

const STREAK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Dashboard() {
  const nav = useNavigate();
  const barRefs = useRef([]);
  const { toast, showToast, hideToast } = useToast();
  const { user, clearUser } = useAuth();

  const displayName = profileDisplayName(user);
  const firstName = profileFirstName(user);
  const subtitle = profileSubtitle(user);
  const period = greetingPeriod();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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

  useEffect(() => {
    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const h = [8, 12, 6, 14, 10, 9][i] ?? 5;
      el.style.height = '0%';
      setTimeout(() => {
        el.style.transition = 'height 0.7s cubic-bezier(.22,1,.36,1)';
        el.style.height = `${h}%`;
      }, 300 + i * 80);
    });
  }, []);

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm grid" style={{ gridTemplateColumns: '240px 1fr' }}>
      <Toast message={toast} onClose={hideToast} />

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
          <div className="text-xs text-muted mt-0.5 text-center px-1">{subtitle || 'Complete your profile from settings soon'}</div>
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

        {navItems.map(item => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.path === '#') {
                showToast(`${item.label} is coming soon (demo).`);
                return;
              }
              nav(item.path);
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150
                        ${
                          item.active
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
        ))}

        <div className="h-px bg-[rgba(61,255,110,0.13)] my-2" />
        <button
          type="button"
          onClick={() => showToast('Settings are coming soon (demo).')}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-s2 hover:text-offwhite w-full text-left transition-all"
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

      <div className="p-8 overflow-y-auto flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-syne text-[28px] font-extrabold">
              Good {period},{' '}
              <span className="text-green-eco">{firstName}</span> 👋
            </h1>
            <div className="text-sm text-muted">{today}</div>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => showToast('Reports are coming soon (demo).')}
              className="bg-s2 border border-[rgba(255,255,255,0.06)] text-offwhite px-4 py-2.5 rounded-full text-sm font-semibold hover:border-[rgba(61,255,110,0.13)] transition-all"
            >
              📊 Reports
            </button>
            <button
              type="button"
              onClick={() => nav('/sell')}
              className="bg-green-eco text-bg px-4 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
            >
              + List New Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {METRICS_STARTER.map(m => (
            <div
              key={m.lbl}
              className="group bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 relative overflow-hidden
                         hover:border-[rgba(61,255,110,0.13)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-eco to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
              <div className="text-[22px] mb-3">{m.ico}</div>
              <div className="font-syne text-[28px] font-extrabold text-green-eco leading-none">{m.val}</div>
              <div className="text-sm text-muted mt-1.5">{m.lbl}</div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full
                            ${m.up ? 'bg-green-muted text-green-eco' : 'bg-[rgba(255,92,92,0.1)] text-danger'}`}
              >
                {m.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="font-syne text-base font-bold">🌿 Monthly CO₂ Savings</div>
                <div className="text-xs text-muted mt-0.5">kg saved vs buying new — data appears after your first trades</div>
              </div>
            </div>
            <div className="flex items-end gap-2.5 h-[130px] opacity-40">
              {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((mo, i) => (
                <div key={mo} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    ref={el => {
                      barRefs.current[i] = el;
                    }}
                    className="w-full rounded-t-lg relative group cursor-default bar-origin-bottom"
                    style={{
                      background: 'linear-gradient(180deg,#3dff6e 0%,rgba(61,255,110,0.3) 100%)',
                      height: 0
                    }}
                  />
                  <span className="text-[11px] text-muted">{mo}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-4 text-center">No savings recorded yet — sell or buy pre-owned to see your impact.</p>
          </div>

          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="font-syne text-base font-bold mb-4">📦 Sales Mix</div>
            <div className="flex flex-col items-center justify-center min-h-[180px] text-center px-2">
              <p className="text-sm text-muted leading-relaxed">
                Categories will appear here once you have listing activity.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 340px' }}>
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="font-syne text-base font-bold mb-4">⚡ Recent Activity</div>
            <div className="flex flex-col items-center justify-center py-10 text-center px-2">
              <span className="text-3xl mb-3">📭</span>
              <p className="text-sm text-offwhite font-semibold mb-1">Nothing here yet</p>
              <p className="text-xs text-muted leading-relaxed">
                Messages, sales, and reviews will show up as you use UniThrift.
              </p>
            </div>
          </div>

          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="font-syne text-base font-bold">📦 My Listings</div>
              <button
                type="button"
                onClick={() => nav('/sell')}
                className="border border-[rgba(255,255,255,0.06)] text-muted text-xs px-3 py-1 rounded-full hover:border-[rgba(61,255,110,0.13)] transition-all"
              >
                Add listing
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center px-2">
              <span className="text-3xl mb-3">🏷️</span>
              <p className="text-sm text-offwhite font-semibold mb-1">No listings yet</p>
              <p className="text-xs text-muted leading-relaxed mb-4">
                List books, electronics, or dorm essentials to reach buyers on campus.
              </p>
              <button
                type="button"
                onClick={() => nav('/sell')}
                className="bg-green-muted border border-[rgba(61,255,110,0.2)] text-green-eco text-xs font-bold px-4 py-2 rounded-full hover:bg-[rgba(61,255,110,0.12)] transition-all"
              >
                Create your first listing
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col gap-4 border border-[rgba(61,255,110,0.13)]"
            style={{ background: 'linear-gradient(135deg,rgba(61,255,110,0.1),rgba(61,255,110,0.04))' }}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-[48px]">🌿</span>
              <div>
                <div className="font-syne text-lg font-extrabold text-green-eco">Eco path</div>
                <div className="text-xs text-muted">Your footprint grows with every reuse</div>
              </div>
            </div>

            <div className="bg-[rgba(0,0,0,0.3)] rounded-xl px-4 py-3.5 flex justify-between items-center">
              <div>
                <div className="text-xs text-muted">Campus rank</div>
                <div className="font-syne text-[22px] font-extrabold text-warn">—</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Saved this month</div>
                <div className="font-syne text-lg font-extrabold text-green-eco">0 kg</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-muted tracking-wider mb-2.5">MILESTONES</div>
              <div className="flex flex-col gap-2.5">
                {MILESTONES_STARTER.map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-lg">{m.ico}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-1">{m.label}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-green-eco rounded-full" style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted ml-1">{m.pct === 100 ? '✓' : `${m.pct}%`}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-muted tracking-wider mb-2.5">ACTIVITY STREAK</div>
              <div className="flex gap-1.5 flex-wrap">
                {STREAK.map((d, i) => (
                  <div
                    key={i}
                    className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-[10px] font-bold bg-s3 text-muted"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted mt-2">Log in and trade on campus days to start a streak.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
