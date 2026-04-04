import React from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';

const STEPS = [
  { n:'01', ico:'🎓', t:'Verify your .edu',    d:"Sign up with your official college email. We verify it's real — no fake accounts, ever." },
  { n:'02', ico:'📸', t:'List in 60 seconds',  d:'Upload photos, let AI generate the description, set your price. Done in under a minute.' },
  { n:'03', ico:'💬', t:'Chat & Negotiate',     d:'Real-time haggling with built-in offer cards. Meet on campus, exchange, done.' },
  { n:'04', ico:'🌿', t:'Earn Eco Points',      d:'Every trade logs your CO₂ savings. Climb the campus leaderboard. Save the planet.' },
];
const FEATURES = [
  { ico:'🔒', t:'Exclusive .edu Access',    d:'Only verified college emails can join. Zero strangers, zero scams — just your campus community.' },
  { ico:'🌍', t:'Carbon Tracker',           d:'Every item you buy or sell shows its CO₂ impact. Watch your eco score grow in real-time.' },
  { ico:'💬', t:'Live Haggling Chat',       d:'WhatsApp-style chat with offer cards. Counter, accept, decline — no awkward emails.' },
  { ico:'✨', t:'AI Listing Assistant',     d:'Upload a photo and AI writes a perfect product description — titles, condition, everything.' },
];
const TESTIS = [
  { q:"Sold my entire 3rd year book stack in 2 days. Made ₹1,800 I didn't expect. The AI description feature is genuinely magical.", name:'Aryan Sharma',  role:'CSE · VNIT Nagpur',      av:'🧑' },
  { q:'Got my entire lab kit for ₹600 instead of ₹2,800. The Carbon Tracker showed I saved 6 kg CO₂ — that genuinely made me happy.', name:'Priya Kumari',  role:'Chem Engg · IIT Bombay', av:'👩' },
  { q:'The chat haggling is SO good. Agreed on a price in 3 messages. Picked up the drafter from the library gate in 10 minutes.', name:'Dev Mehta',      role:'Civil Engg · NIT Surat',  av:'🧔' },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 bg-green-muted border border-[rgba(61,255,110,0.13)]
                     px-3.5 py-1 rounded-full text-[11px] font-bold text-green-eco tracking-widest mb-4">
      {children}
    </span>
  );
}
function SectionH({ children }) {
  return (
    <h2 className="font-syne text-[44px] font-extrabold leading-tight tracking-tight mb-3">
      {children}
    </h2>
  );
}

export default function Landing() {
  const nav = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm">
      <Toast message={toast} onClose={hideToast} />

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-62px)] grid grid-cols-[1fr_520px] items-center px-20 overflow-hidden">
        {/* BG layers */}
        <div className="absolute inset-0 pointer-events-none"
             style={{background:'radial-gradient(ellipse 800px 500px at 20% 40%,rgba(61,255,110,0.07) 0%,transparent 70%),radial-gradient(ellipse 400px 400px at 85% 20%,rgba(61,255,110,0.04) 0%,transparent 60%)'}} />
        <div className="absolute inset-0 pointer-events-none grid-bg" />

        {/* Left */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-muted border border-[rgba(61,255,110,0.13)]
                          px-3.5 py-1.5 rounded-full text-xs font-bold text-green-eco tracking-wider mb-6
                          animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-green-eco animate-blink" />
            🌿 Campus Sustainable Marketplace
          </div>

          <h1 className="font-syne text-[58px] font-extrabold leading-[1.08] tracking-[-1.5px] animate-fade-up animate-delay-1">
            Buy. Sell.<br />
            <span className="text-green-eco">Save the</span><br />
            <span className="text-stroke">Planet.</span>
          </h1>

          <p className="text-[17px] text-muted leading-relaxed max-w-[480px] mt-5 animate-fade-up animate-delay-2">
            The exclusive peer-to-peer marketplace for college students — books, lab gear,
            hostel essentials, and more. Only for verified{' '}
            <strong className="text-offwhite">.edu.in</strong> emails.
          </p>

          <div className="flex gap-3.5 mt-9 items-center animate-fade-up animate-delay-3">
            <button
              type="button"
              onClick={() => nav('/register')}
              className="bg-green-eco text-bg px-8 py-3.5 rounded-full text-base font-bold
                         flex items-center gap-2.5 hover:bg-[#72ff97] hover:-translate-y-1
                         hover:shadow-glow-lg transition-all duration-200">
              Start Selling Free <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => nav('/marketplace')}
              className="border border-border text-offwhite px-7 py-3.5 rounded-full text-[15px] font-medium
                         hover:border-green-eco hover:text-green-eco transition-all duration-200">
              Browse Listings
            </button>
          </div>

          <div className="flex items-center gap-4 mt-8 animate-fade-up animate-delay-4">
            <div className="flex">
              {['🧑','👩','🧔','👩‍🎓','🧑‍💻'].map((a, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-s3
                                        flex items-center justify-center text-sm -ml-2 first:ml-0">{a}</div>
              ))}
            </div>
            <p className="text-sm text-muted"><strong className="text-offwhite">12,400+</strong> students already saving</p>
          </div>
        </div>

        {/* Right — floating cards */}
        <div className="relative z-10 flex items-center justify-center h-[500px] animate-fade-up animate-delay-2">
          {/* Side card top */}
          <div className="absolute right-[-20px] top-[20px] w-[220px] bg-s2 border border-[rgba(61,255,110,0.13)]
                          rounded-2xl p-4 shadow-card animate-float-med">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🌍</span>
              <div>
                <div className="font-syne text-lg font-extrabold text-green-eco">2.1 Tonnes</div>
                <div className="text-xs text-muted">CO₂ saved this month</div>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="relative w-[300px] bg-s2 border border-[rgba(61,255,110,0.13)]
                          rounded-2xl p-5 shadow-card animate-float-slow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[44px]">📚</span>
              <span className="text-xs font-bold text-green-eco bg-[rgba(61,255,110,0.18)]
                               border border-[rgba(61,255,110,0.13)] px-3 py-1 rounded-full">
                🌿 2.4 kg CO₂
              </span>
            </div>
            <div className="font-syne text-base font-bold mb-1">Engineering Maths Vol. 2</div>
            <div className="font-syne text-[22px] font-extrabold text-green-eco">
              ₹180 <span className="text-sm text-muted font-normal line-through font-dm">₹720</span>
            </div>
            <div className="text-xs text-muted mt-1">👤 Aryan S. · VNIT Nagpur · Good cond.</div>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {['📚 Books','Negotiable','⭐ 4.9'].map((t, i) => (
                <span key={t} className={`text-xs px-2.5 py-1 rounded-full border ${
                  i === 0
                    ? 'bg-green-muted border-[rgba(61,255,110,0.13)] text-green-eco'
                    : 'bg-s3 border-[rgba(255,255,255,0.06)] text-muted'}`}>{t}</span>
              ))}
            </div>
          </div>

          {/* Side card bottom */}
          <div className="absolute left-[-10px] bottom-[20px] w-[200px] bg-s2 border border-[rgba(61,255,110,0.13)]
                          rounded-2xl p-4 shadow-card animate-float-fast">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="font-syne text-lg font-extrabold text-green-eco">#4 Ranked</div>
                <div className="text-xs text-muted">Eco Warrior · Campus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="flex border-t border-b border-[rgba(61,255,110,0.13)] bg-s1">
        {[['12.4K','Verified Students'],['₹48L','Student Money Saved'],['2.1T','kg CO₂ Offset'],['34K','Items Traded'],['98%','Satisfaction Rate']].map(([n, l], i, arr) => (
          <div key={l} className={`flex-1 py-7 text-center ${i < arr.length-1 ? 'border-r border-[rgba(61,255,110,0.13)]' : ''}`}>
            <div className="font-syne text-[32px] font-extrabold text-green-eco leading-none">{n}</div>
            <div className="text-sm text-muted mt-1.5">{l}</div>
          </div>
        ))}
      </div>

      {/* ── MARKETPLACE CTA ── */}
      <section className="px-6 md:px-20 py-16 border-b border-[rgba(61,255,110,0.13)] bg-s1/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <SectionLabel>🏪 CAMPUS MARKETPLACE</SectionLabel>
            <h2 className="font-syne text-3xl md:text-[36px] font-extrabold text-offwhite mt-2 leading-tight">
              See what&apos;s for sale right now
            </h2>
            <p className="text-sm text-muted mt-3 max-w-lg leading-relaxed">
              Real listings from students on your campus — books, gadgets, lab gear. Open the marketplace to browse,
              chat with sellers, and arrange pickup.
            </p>
          </div>
          <button
            type="button"
            onClick={() => nav('/marketplace')}
            className="shrink-0 bg-green-eco text-bg px-8 py-3.5 rounded-full text-base font-bold
                       hover:bg-[#72ff97] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200 w-fit"
          >
            Open marketplace →
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-20 py-24">
        <SectionLabel>⚙️ HOW IT WORKS</SectionLabel>
        <SectionH>Simple as <em className="text-green-eco not-italic">1, 2, 3</em></SectionH>
        <p className="text-base text-muted max-w-xl leading-relaxed">From joining to your first trade — everything takes under 5 minutes.</p>
        <div className="grid grid-cols-4 gap-5 mt-14">
          {STEPS.map(s => (
            <div key={s.n}
                 className="group bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 relative overflow-hidden
                            hover:border-[rgba(61,255,110,0.13)] hover:-translate-y-1 hover:shadow-card transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-eco to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="font-syne text-[48px] font-extrabold text-green-muted leading-none mb-4
                              [--tw-text-opacity:1] [-webkit-text-stroke:1px_rgba(61,255,110,0.2)]">{s.n}</div>
              <div className="text-[28px] mb-3">{s.ico}</div>
              <div className="font-syne text-[17px] font-bold mb-2">{s.t}</div>
              <div className="text-sm text-muted leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-20 pb-24">
        <SectionLabel>✨ FEATURES</SectionLabel>
        <SectionH>Built for <em className="text-green-eco not-italic">campus life</em></SectionH>
        <div className="grid grid-cols-2 gap-5 mt-14">
          {FEATURES.map(f => (
            <div key={f.t}
                 className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex gap-5
                            hover:border-[rgba(61,255,110,0.13)] hover:bg-s2 transition-all duration-200">
              <div className="w-[52px] h-[52px] rounded-xl bg-green-muted border border-[rgba(61,255,110,0.13)]
                              flex items-center justify-center text-2xl flex-shrink-0">{f.ico}</div>
              <div>
                <div className="font-syne text-[17px] font-bold mb-1.5">{f.t}</div>
                <div className="text-sm text-muted leading-relaxed">{f.d}</div>
              </div>
            </div>
          ))}
          {/* Wide feature */}
          <div className="col-span-2 bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex gap-5
                          hover:border-[rgba(61,255,110,0.13)] hover:bg-s2 transition-all duration-200">
            <div className="w-[60px] h-[60px] rounded-xl bg-green-muted border border-[rgba(61,255,110,0.13)]
                            flex items-center justify-center text-3xl flex-shrink-0">🏆</div>
            <div>
              <div className="font-syne text-[17px] font-bold mb-1.5">Campus Leaderboard & Gamification</div>
              <div className="text-sm text-muted leading-relaxed">
                Compete with your campus peers for the Eco Warrior crown. Earn badges, level up, and get recognized
                for sustainable choices. Because saving the planet should feel like winning.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-20 pb-24">
        <SectionLabel>💬 STUDENTS LOVE IT</SectionLabel>
        <SectionH>Real <em className="text-green-eco not-italic">campus stories</em></SectionH>
        <div className="grid grid-cols-3 gap-5 mt-12">
          {TESTIS.map(t => (
            <div key={t.name} className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
              <div className="text-warn text-sm mb-3">★★★★★</div>
              <p className="text-sm leading-relaxed text-offwhite">{t.q}</p>
              <div className="flex items-center gap-2.5 mt-4">
                <div className="w-9 h-9 rounded-full bg-s3 flex items-center justify-center text-lg">{t.av}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mx-20 mb-24 p-16 rounded-3xl border border-[rgba(61,255,110,0.13)] text-center relative overflow-hidden"
           style={{background:'linear-gradient(135deg,rgba(61,255,110,0.08) 0%,rgba(61,255,110,0.03) 100%)'}}>
        <div className="absolute inset-0 pointer-events-none"
             style={{background:'radial-gradient(ellipse at 50% 0%,rgba(61,255,110,0.12) 0%,transparent 60%)'}} />
        <div className="relative z-10">
          <SectionLabel>🚀 FREE FOR ALL STUDENTS</SectionLabel>
          <h2 className="font-syne text-[42px] font-extrabold mb-3">Ready to join 12,000+ eco-warriors?</h2>
          <p className="text-base text-muted mb-8">Your campus marketplace is waiting. Verify your .edu.in email and start trading in 60 seconds.</p>
          <button
            onClick={() => nav('/register')}
            className="bg-green-eco text-bg px-10 py-4 rounded-full text-base font-bold
                       hover:bg-[#72ff97] hover:-translate-y-1 hover:shadow-glow-lg transition-all duration-200">
            Create Free Account →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(61,255,110,0.13)] px-20 py-10 flex justify-between items-center text-sm text-muted">
        <div>
          <div className="font-syne text-lg font-extrabold text-green-eco">Uni<span className="text-offwhite">Thrift</span></div>
          <div className="mt-1.5">© 2025 UniThrift. Made for students, by students.</div>
        </div>
        <div className="flex gap-6">
          {['About','Privacy','Terms','Contact'].map(l => (
            <button
              key={l}
              type="button"
              onClick={() => showToast(`${l} page is coming soon.`)}
              className="text-muted hover:text-offwhite transition-colors"
            >
              {l}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
