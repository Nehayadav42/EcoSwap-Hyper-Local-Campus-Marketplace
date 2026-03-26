import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';
import { clearToken } from '../auth/session';

const NAV_ITEMS = [
  { ico:'📊', label:'Dashboard',    path:'/dashboard', active:true  },
  { ico:'🏪', label:'Marketplace',  path:'/',           active:false },
  { ico:'📦', label:'My Listings',  path:'#',           active:false },
  { ico:'💬', label:'Messages',     path:'/chat',       active:false, badge:3 },
  { ico:'🌍', label:'Carbon Tracker',path:'#',          active:false },
  { ico:'🏆', label:'Leaderboard',  path:'/leaderboard',           active:false },
];

const METRICS = [
  { ico:'🌍', val:'24.6 kg', lbl:'CO₂ Saved',    delta:'↑ +3.2 kg this week',  up:true  },
  { ico:'💰', val:'₹4,200',  lbl:'Total Earned',  delta:'↑ ₹160 pending',       up:true  },
  { ico:'📦', val:'12',      lbl:'Items Sold',     delta:'↑ 2 this week',        up:true  },
  { ico:'⭐', val:'4.9',     lbl:'Seller Rating',  delta:'↑ 23 reviews',         up:true  },
];

const BAR_DATA = [
  { mo:'Aug', h:42, v:'3.2kg' }, { mo:'Sep', h:58, v:'4.8kg' },
  { mo:'Oct', h:32, v:'2.6kg' }, { mo:'Nov', h:74, v:'6.1kg' },
  { mo:'Dec', h:48, v:'3.9kg' }, { mo:'Jan', h:95, v:'4.0kg' },
];

const ACTIVITY = [
  { ico:'💬', txt:<>New message from <strong>Aryan</strong> about Eng. Maths</>,   time:'2 minutes ago' },
  { ico:'🌿', txt:<><strong>+2.4 kg CO₂</strong> saved — Drafter Set sold to Dev M.</>, time:'3 hours ago' },
  { ico:'⭐', txt:<>New <strong>5-star review</strong> from Priya K. — "Super fast!"</>, time:'Yesterday' },
  { ico:'🏆', txt:<><strong>Rank up!</strong> You're now #4 on campus leaderboard</>,  time:'2 days ago' },
  { ico:'📦', txt:<><strong>Item sold</strong> — Study Lamp to Sneha R. · ₹240</>,    time:'3 days ago' },
];

const LISTINGS = [
  { ico:'📚', n:'Engineering Maths Vol. 2', p:'₹180',   live:true,  sub:'3 views today' },
  { ico:'💡', n:'Study Lamp (Philips)',      p:'₹240',   live:true,  sub:'7 views today' },
  { ico:'📐', n:'Rotring Drafter Set',       p:'₹350',   live:false, sub:'Sold · Jan 12' },
  { ico:'🖥', n:'Monitor 24" (Used)',        p:'₹3,200', live:true,  sub:'12 views today' },
];

const MILESTONES = [
  { ico:'🌱', label:'First 5 kg saved',  pct:100 },
  { ico:'🌳', label:'25 kg CO₂ saved',   pct:98  },
  { ico:'🌍', label:'50 kg CO₂ saved',   pct:49  },
];

const STREAK = ['M','T','W','T','F','S','S'];
const STREAK_ON = [false,true,true,true,true,false,true];

export default function Dashboard() {
  const nav = useNavigate();
  const barRefs = useRef([]);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const h = BAR_DATA[i].h;
      el.style.height = '0%';
      setTimeout(() => {
        el.style.transition = 'height 0.7s cubic-bezier(.22,1,.36,1)';
        el.style.height = `${h}%`;
      }, 300 + i * 80);
    });
  }, []);

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm grid" style={{gridTemplateColumns:'240px 1fr'}}>
      <Toast message={toast} onClose={hideToast} />

      {/* ── SIDEBAR ── */}
      <div className="border-r border-[rgba(61,255,110,0.13)] px-4 py-7 flex flex-col gap-1 bg-s1 sticky top-[62px] h-[calc(100vh-62px)] overflow-y-auto">
        {/* Profile */}
        <div className="flex flex-col items-center pb-5 mb-4 border-b border-[rgba(61,255,110,0.13)]">
          <div className="relative mb-2.5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-[30px] border-2 border-green-eco"
                 style={{background:'linear-gradient(135deg,#3dff6e,#2de05c)'}}>🧑</div>
            <div className="absolute -bottom-1 -right-1 bg-warn text-bg text-[10px] font-extrabold px-2 py-0.5 rounded-full">🔥 Lv.7</div>
          </div>
          <div className="font-syne text-base font-extrabold">Aryan Sharma</div>
          <div className="text-xs text-muted mt-0.5">@aryan · VNIT · CSE 3rd Yr</div>
          <div className="w-full mt-3">
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:'72%',background:'linear-gradient(90deg,#3dff6e,#a8ff78)'}} />
            </div>
            <div className="text-center text-xs text-muted mt-1.5">720 / 1000 XP → Level 8</div>
          </div>
        </div>

        {NAV_ITEMS.map(item => (
          <button key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.path === '#') {
                      showToast(`${item.label} is coming soon (demo).`);
                      return;
                    }
                    nav(item.path);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150
                              ${item.active
                                ? 'bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco font-bold'
                                : 'text-muted hover:bg-s2 hover:text-offwhite'}`}>
            <span className="text-lg flex-shrink-0">{item.ico}</span>
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-green-eco text-bg text-[10px] font-extrabold px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
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
            nav('/login');
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-s2 hover:text-offwhite w-full text-left transition-all"
        >
          <span className="text-lg">🚪</span> Sign Out
        </button>
      </div>

      {/* ── MAIN ── */}
      <div className="p-8 overflow-y-auto flex flex-col gap-6">
        {/* Topbar */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-syne text-[28px] font-extrabold">Good evening, <span className="text-green-eco">Aryan</span> 👋</h1>
            <div className="text-sm text-muted">Thursday, 15 January 2025</div>
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
              onClick={() => showToast('Listing creation is coming soon (demo).')}
              className="bg-green-eco text-bg px-4 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
            >
              + List New Item
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          {METRICS.map(m => (
            <div key={m.lbl}
                 className="group bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 relative overflow-hidden
                            hover:border-[rgba(61,255,110,0.13)] hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-eco to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="text-[22px] mb-3">{m.ico}</div>
              <div className="font-syne text-[28px] font-extrabold text-green-eco leading-none">{m.val}</div>
              <div className="text-sm text-muted mt-1.5">{m.lbl}</div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full
                               ${m.up ? 'bg-green-muted text-green-eco' : 'bg-[rgba(255,92,92,0.1)] text-danger'}`}>
                {m.delta}
              </span>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4" style={{gridTemplateColumns:'2fr 1fr'}}>
          {/* Bar Chart */}
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="font-syne text-base font-bold">🌿 Monthly CO₂ Savings</div>
                <div className="text-xs text-muted mt-0.5">kg saved vs buying new products</div>
              </div>
              <span className="bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco text-xs font-bold px-2.5 py-1 rounded-full">+18% vs last semester</span>
            </div>
            <div className="flex items-end gap-2.5 h-[130px]">
              {BAR_DATA.map((b, i) => (
                <div key={b.mo} className="flex-1 flex flex-col items-center gap-1.5">
                  <div ref={el => barRefs.current[i] = el}
                       className="w-full rounded-t-lg relative group cursor-pointer bar-origin-bottom"
                       style={{background:'linear-gradient(180deg,#3dff6e 0%,rgba(61,255,110,0.3) 100%)', height:0}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-eco text-bg text-[10px] font-bold
                                     px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {b.v}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted">{b.mo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="font-syne text-base font-bold mb-4">📦 Sales Mix</div>
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 140 140" className="w-[140px] h-[140px]">
                <circle cx="70" cy="70" r="52" fill="none" stroke="#1c261c" strokeWidth="22"/>
                <circle cx="70" cy="70" r="52" fill="none" stroke="#3dff6e" strokeWidth="22" strokeDasharray="130.6 196" strokeDashoffset="49" transform="rotate(-90 70 70)"/>
                <circle cx="70" cy="70" r="52" fill="none" stroke="#5ce0ff" strokeWidth="22" strokeDasharray="81.6 244.6" strokeDashoffset="-81.6" transform="rotate(-90 70 70)"/>
                <circle cx="70" cy="70" r="52" fill="none" stroke="#ffb347" strokeWidth="22" strokeDasharray="65.3 261" strokeDashoffset="-163.2" transform="rotate(-90 70 70)"/>
                <circle cx="70" cy="70" r="52" fill="none" stroke="#2e3e30" strokeWidth="22" strokeDasharray="49 277.3" strokeDashoffset="-228.5" transform="rotate(-90 70 70)"/>
              </svg>
              <div className="flex flex-col gap-2 w-full mt-3">
                {[['#3dff6e','Books','40%'],['#5ce0ff','Electronics','25%'],['#ffb347','Hostel','20%'],['#2e3e30','Other','15%']].map(([c,l,v]) => (
                  <div key={l} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:c}} />
                    <span className="text-muted flex-1">{l}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4" style={{gridTemplateColumns:'1fr 1fr 340px'}}>
          {/* Activity */}
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="font-syne text-base font-bold mb-4">⚡ Recent Activity</div>
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                  <div className="w-9 h-9 rounded-xl bg-green-muted border border-[rgba(61,255,110,0.13)] flex items-center justify-center text-base flex-shrink-0">{a.ico}</div>
                  <div>
                    <div className="text-sm leading-snug">{a.txt}</div>
                    <div className="text-xs text-muted mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="font-syne text-base font-bold">📦 My Listings</div>
              <button
                type="button"
                onClick={() => showToast('View all listings is coming soon (demo).')}
                className="border border-[rgba(255,255,255,0.06)] text-muted text-xs px-3 py-1 rounded-full hover:border-[rgba(61,255,110,0.13)] transition-all"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col">
              {LISTINGS.map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                  <div className="w-11 h-11 rounded-xl bg-s3 flex items-center justify-center text-xl flex-shrink-0">{l.ico}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{l.n}</div>
                    <div className="font-syne text-sm font-bold text-green-eco">{l.p}</div>
                    <div className={`text-xs ${l.live ? 'text-green-eco' : 'text-muted'}`}>
                      {l.live ? '● ' : '✓ '}{l.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eco card */}
          <div className="rounded-2xl p-6 flex flex-col gap-4 border border-[rgba(61,255,110,0.13)]"
               style={{background:'linear-gradient(135deg,rgba(61,255,110,0.1),rgba(61,255,110,0.04))'}}>
            <div className="flex items-center gap-3.5">
              <span className="text-[48px]">🌿</span>
              <div>
                <div className="font-syne text-lg font-extrabold text-green-eco">Eco Warrior</div>
                <div className="text-xs text-muted">Top 5% on campus</div>
              </div>
            </div>

            <div className="bg-[rgba(0,0,0,0.3)] rounded-xl px-4 py-3.5 flex justify-between items-center">
              <div><div className="text-xs text-muted">Campus Rank</div><div className="font-syne text-[22px] font-extrabold text-warn">#4</div></div>
              <div className="text-right"><div className="text-xs text-muted">Saved This Month</div><div className="font-syne text-lg font-extrabold text-green-eco">4.0 kg</div></div>
            </div>

            <div>
              <div className="text-xs font-bold text-muted tracking-wider mb-2.5">MILESTONES</div>
              <div className="flex flex-col gap-2.5">
                {MILESTONES.map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-lg">{m.ico}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-1">{m.label}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-green-eco rounded-full" style={{width:`${m.pct}%`}} />
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
                  <div key={i} className={`w-[26px] h-[26px] rounded-md flex items-center justify-center text-[10px] font-bold
                                           ${STREAK_ON[i] ? 'bg-green-eco text-bg' : 'bg-s3 text-muted'}`}>{d}</div>
                ))}
              </div>
              <div className="text-xs text-muted mt-2">🔥 14-day streak — keep going!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
