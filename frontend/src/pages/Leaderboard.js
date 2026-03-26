import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';

const LEADERS = [
  { id: 1, name: 'Aryan Sharma',    campus: 'VNIT Nagpur',    co2Kg: 72.4, rank: 1 },
  { id: 2, name: 'Priya Kumari',    campus: 'IIT Bombay',     co2Kg: 69.1, rank: 2 },
  { id: 3, name: 'Dev Mehta',       campus: 'NIT Surat',      co2Kg: 63.0, rank: 3 },
  { id: 4, name: 'Sneha Reddy',     campus: 'VNIT Nagpur',    co2Kg: 58.9, rank: 4 },
  { id: 5, name: 'Karan T.',         campus: 'NIT Trichy',     co2Kg: 54.2, rank: 5 },
  { id: 6, name: 'Ananya Das',       campus: 'IIT Delhi',       co2Kg: 50.7, rank: 6 },
];

export default function Leaderboard() {
  const nav = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [campus, setCampus] = useState('all');

  const campuses = useMemo(() => {
    const set = new Set(LEADERS.map((l) => l.campus));
    return ['all', ...Array.from(set)];
  }, []);

  const rows = useMemo(() => {
    const base = campus === 'all' ? LEADERS : LEADERS.filter((l) => l.campus === campus);
    return [...base].sort((a, b) => b.co2Kg - a.co2Kg);
  }, [campus]);

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm px-6 py-10">
      <Toast message={toast} onClose={hideToast} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-syne text-3xl font-extrabold text-green-eco">🏆 Campus Leaderboard</h1>
            <p className="text-sm text-muted mt-1.5">
              Top eco-warriors ranked by CO2 saved (demo data).
            </p>
          </div>
          <button
            type="button"
            onClick={() => showToast('Leaderboard filters are working (demo).')}
            className="bg-s2 border border-[rgba(255,255,255,0.06)] text-offwhite px-4 py-2.5 rounded-full text-sm font-semibold hover:border-[rgba(61,255,110,0.13)] transition-all"
          >
            How scoring works
          </button>
        </div>

        <div className="bg-s1 border border-[rgba(61,255,110,0.13)] rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-muted tracking-wider">FILTER</span>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="bg-s2 border border-border rounded-xl px-4 py-2.5 text-offwhite text-sm outline-none focus:border-green-eco transition-all"
            >
              {campuses.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Campuses' : c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setCampus('all');
                showToast('Showing all campuses.');
              }}
              className="text-green-eco font-semibold bg-transparent border border-[rgba(61,255,110,0.13)] px-4 py-2.5 rounded-xl text-sm hover:bg-green-muted transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-0 bg-s2 px-5 py-3 text-xs font-bold text-muted tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Leader</div>
            <div className="col-span-3">Campus</div>
            <div className="col-span-3 text-right">CO2 Saved</div>
          </div>

          {rows.map((r, idx) => (
            <button
              key={r.id}
              type="button"
              onClick={() => showToast(`Clicked ${r.name} (demo).`)}
              className="w-full grid grid-cols-12 gap-0 px-5 py-4 text-left border-t border-[rgba(255,255,255,0.04)]
                         hover:bg-s2 transition-colors"
            >
              <div className="col-span-1 font-bold text-offwhite">{idx + 1}</div>
              <div className="col-span-5 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-green-muted border border-[rgba(61,255,110,0.13)] flex items-center justify-center">
                  {idx === 0 ? '👑' : idx < 3 ? '⭐' : '🌿'}
                </span>
                <span className="font-semibold">{r.name}</span>
              </div>
              <div className="col-span-3 text-muted text-sm">{r.campus}</div>
              <div className="col-span-3 text-right font-syne font-extrabold text-green-eco">{r.co2Kg.toFixed(1)} kg</div>
            </button>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => nav('/dashboard')}
            className="bg-green-eco text-bg px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

