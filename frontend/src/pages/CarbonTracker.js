import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const MILESTONES = [
  { ico: '🌱', label: 'First 5 kg CO₂ saved', pct: 0 },
  { ico: '🌳', label: '25 kg CO₂ saved', pct: 0 },
  { ico: '🌍', label: '50 kg CO₂ saved', pct: 0 }
];

export default function CarbonTracker() {
  const nav = useNavigate();

  return (
    <DashboardLayout>
      <div>
        <h1 className="font-syne text-[28px] font-extrabold mb-1">🌍 Carbon Tracker</h1>
        <p className="text-sm text-muted mb-8">
          Every pre-owned purchase or sale avoids manufacturing emissions. Totals will fill in automatically as you complete trades.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { ico: '🌍', val: '0 kg', lbl: 'CO₂ saved (all time)', hint: 'vs buying new' },
            { ico: '📅', val: '0 kg', lbl: 'This month', hint: 'resets each month' },
            { ico: '🚗', val: '—', lbl: 'Equivalent', hint: 'driving / trees — after first trade' }
          ].map(m => (
            <div
              key={m.lbl}
              className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 hover:border-[rgba(61,255,110,0.13)] transition-all"
            >
              <div className="text-2xl mb-2">{m.ico}</div>
              <div className="font-syne text-3xl font-extrabold text-green-eco">{m.val}</div>
              <div className="text-sm text-muted mt-1">{m.lbl}</div>
              <div className="text-xs text-muted mt-2">{m.hint}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
            <div className="font-syne text-base font-bold mb-4">Milestones</div>
            <div className="flex flex-col gap-3">
              {MILESTONES.map(m => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-xl">{m.ico}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="h-1 bg-border rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-green-eco rounded-full" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-muted">{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 border border-[rgba(61,255,110,0.13)] flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(61,255,110,0.1),rgba(61,255,110,0.04))' }}
          >
            <div className="font-syne text-lg font-extrabold text-green-eco mb-2">See how you rank</div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Compare your campus impact with other verified students on the leaderboard.
            </p>
            <button
              type="button"
              onClick={() => nav('/leaderboard')}
              className="self-start bg-green-eco text-bg px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
            >
              Open leaderboard →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
