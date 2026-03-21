import React, { useState } from 'react';

const CONTACTS = [
  { id:1, name:'Aryan Sharma',  av:'🧑', preview:'Sure, ₹160 works for me! 🙌',       time:'2m',  unread:2, online:true  },
  { id:2, name:'Priya Kumari',  av:'👩', preview:'Is the charger still available?',    time:'1h',  unread:1, online:false },
  { id:3, name:'Dev Mehta',     av:'🧔', preview:'Sold! Thanks for the drafter 🙏',   time:'3h',  unread:0, online:false },
  { id:4, name:'Sneha Reddy',   av:'👩‍🎓',preview:'Can you hold it till Friday?',      time:'1d',  unread:0, online:true  },
  { id:5, name:'Karan T.',      av:'🧑‍💻',preview:"Hey, what's the lamp condition?", time:'2d',  unread:0, online:false },
];

const MSGS = [
  { id:1, type:'recv', av:'🧑', text:"Hey! Is the Engineering Maths book still available? I'm in 2nd year and really need it for exams 😅", time:'10:32 AM' },
  { id:2, type:'sent', text:"Yes it's available! Good condition, minor pencil marks only in Ch. 3 and 5. All pages intact 📸", time:'10:34 AM' },
  { id:3, type:'recv', av:'🧑', text:"Looks great! Would you take ₹150 for it? I'm a bit short this month 🙏", time:'10:36 AM' },
  { id:4, type:'sent', text:"₹150 is a bit too low — it's the 2022 edition, fresh. How about ₹160? That's my best 😊", time:'10:38 AM' },
  { id:5, type:'offer', av:'🧑', amount:'₹160', orig:'₹180', save:'₹20', time:'10:40 AM' },
  { id:6, type:'sent', text:"Deal! ₹160 it is 🤝 Let's meet tomorrow at 4 PM — Library entrance gate?", time:'10:42 AM' },
  { id:7, type:'recv', av:'🧑', text:'Sure, ₹160 works for me! Library gate at 4 PM tomorrow. See you! 🙌', time:'10:43 AM' },
];

export default function Chat() {
  const [active, setActive] = useState(1);
  const [input, setInput] = useState('');

  return (
    <div className="grid mt-[62px] h-[calc(100vh-62px)] overflow-hidden"
         style={{gridTemplateColumns:'300px 1fr 280px'}}>

      {/* ── SIDEBAR ── */}
      <div className="border-r border-[rgba(61,255,110,0.13)] flex flex-col overflow-hidden bg-s1">
        <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(61,255,110,0.13)]">
          <span className="font-syne text-lg font-extrabold">Messages</span>
          <div className="w-8 h-8 rounded-full bg-green-muted border border-[rgba(61,255,110,0.13)]
                          flex items-center justify-center text-lg text-green-eco cursor-pointer
                          hover:bg-green-eco hover:text-bg transition-all">+</div>
        </div>
        <div className="px-4 py-3 border-b border-[rgba(61,255,110,0.13)]">
          <div className="bg-s2 border border-border rounded-lg px-3.5 py-2.5 flex items-center gap-2.5">
            <span className="text-muted">🔍</span>
            <input className="bg-transparent border-none outline-none text-offwhite text-sm flex-1 placeholder-muted"
                   placeholder="Search conversations..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {CONTACTS.map(c => (
            <div key={c.id} onClick={() => setActive(c.id)}
                 className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150
                             border-b border-[rgba(255,255,255,0.03)]
                             ${active === c.id
                               ? 'bg-green-muted border-l-[2.5px] border-l-green-eco'
                               : 'hover:bg-s2'}`}>
              <div className="relative flex-shrink-0">
                <div className="w-[42px] h-[42px] rounded-full bg-s3 flex items-center justify-center text-[19px]">{c.av}</div>
                {c.online && <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-eco border-2 border-bg" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted truncate">{c.preview}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs text-muted">{c.time}</span>
                {c.unread > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-full bg-green-eco text-bg text-[10px] font-extrabold
                                   flex items-center justify-center px-1.5">{c.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CHAT ── */}
      <div className="flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center gap-3.5 px-5 py-3.5 border-b border-[rgba(61,255,110,0.13)] bg-s1 flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full bg-s3 flex items-center justify-center text-lg flex-shrink-0">
            🧑
            <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-eco border-2 border-bg" />
          </div>
          <div>
            <div className="font-semibold text-[15px]">Aryan Sharma</div>
            <div className="text-xs text-muted">📚 Engineering Maths Vol. 2 · ₹180 listed</div>
          </div>
          <div className="ml-auto flex gap-2">
            {['📞 Call','✅ Mark as Sold','⋯'].map((lbl, i) => (
              <button key={lbl}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                                  ${i === 1
                                    ? 'bg-green-muted border-[rgba(61,255,110,0.13)] text-green-eco'
                                    : 'bg-s2 border-[rgba(255,255,255,0.06)] text-muted hover:text-offwhite hover:border-[rgba(61,255,110,0.13)]'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5 flex flex-col gap-3.5">
          {/* Day separator */}
          <div className="flex items-center gap-2.5 text-xs text-muted">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            Today · Jan 15
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          {MSGS.map(m => {
            if (m.type === 'offer') return (
              <div key={m.id} className="flex items-end gap-2.5 max-w-[72%] self-start">
                <div className="w-[30px] h-[30px] rounded-full bg-s3 flex items-center justify-center text-sm flex-shrink-0">{m.av}</div>
                <div>
                  <div className="bg-s1 border border-[rgba(61,255,110,0.13)] rounded-2xl p-4 max-w-[280px]">
                    <div className="text-[11px] font-bold text-muted tracking-wide mb-2">💸 COUNTER OFFER SENT</div>
                    <div className="font-syne text-[28px] font-extrabold text-green-eco">{m.amount}</div>
                    <div className="text-xs text-muted mt-0.5">Original: {m.orig} · You save: {m.save}</div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-green-eco text-bg border-none py-2 px-4 rounded-full text-xs font-bold">✓ Accept {m.amount}</button>
                      <button className="border border-[rgba(255,92,92,0.35)] text-danger bg-transparent py-2 px-3.5 rounded-full text-xs">✗ Decline</button>
                    </div>
                  </div>
                  <div className="text-[10.5px] text-muted mt-1">{m.time}</div>
                </div>
              </div>
            );
            return (
              <div key={m.id} className={`flex items-end gap-2.5 max-w-[72%] ${m.type === 'sent' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className="w-[30px] h-[30px] rounded-full bg-s3 flex items-center justify-center text-sm flex-shrink-0">
                  {m.type === 'recv' ? m.av : '🙋'}
                </div>
                <div>
                  <div className={`px-4 py-2.5 rounded-[18px] text-sm leading-snug
                                   ${m.type === 'sent'
                                     ? 'bg-green-eco text-bg font-medium rounded-br-[4px]'
                                     : 'bg-s2 border border-[rgba(255,255,255,0.06)] rounded-bl-[4px]'}`}>
                    {m.text}
                  </div>
                  <div className={`text-[10.5px] text-muted mt-1 ${m.type === 'sent' ? 'text-right' : ''}`}>
                    {m.time}{m.type === 'sent' ? ' ✓✓' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-t border-[rgba(61,255,110,0.13)] bg-s1 flex-shrink-0">
          <div className="flex gap-1.5">
            {['📎','📸','💸'].map(ico => (
              <div key={ico} className="w-9 h-9 rounded-full bg-s2 border border-[rgba(255,255,255,0.06)]
                                        flex items-center justify-center text-sm text-muted cursor-pointer
                                        hover:border-[rgba(61,255,110,0.13)] hover:text-offwhite transition-all">{ico}</div>
            ))}
          </div>
          <input value={input} onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && setInput('')}
                 placeholder="Type a message or make an offer..."
                 className="flex-1 bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm outline-none
                            focus:border-green-eco transition-colors placeholder-muted" />
          <button onClick={() => setInput('')}
                  className="w-[42px] h-[42px] rounded-full bg-green-eco border-none text-bg text-lg
                             hover:bg-[#72ff97] hover:scale-110 transition-all duration-200">➤</button>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="border-l border-[rgba(61,255,110,0.13)] overflow-y-auto scrollbar-hide px-4 py-5 flex flex-col gap-4 bg-s1">
        {/* Listing */}
        <div className="bg-s2 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
          <div className="text-[11px] font-bold text-muted tracking-[0.8px] mb-3">LISTING</div>
          <div className="flex gap-3 items-start">
            <div className="w-[52px] h-[52px] rounded-xl bg-s3 flex items-center justify-center text-2xl flex-shrink-0">📚</div>
            <div>
              <div className="font-semibold text-sm mb-0.5">Engineering Maths Vol. 2</div>
              <div className="font-syne text-lg font-extrabold text-green-eco">₹180</div>
              <div className="text-xs text-muted mt-0.5">Good · 2022 Ed.</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {['✅ Mark as Sold','💸 Send Offer Card','📍 Share Meet Location'].map((lbl, i) => (
              <button key={lbl}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-medium text-left border transition-all duration-150
                                  ${i === 0
                                    ? 'bg-green-muted border-[rgba(61,255,110,0.13)] text-green-eco font-bold'
                                    : 'bg-s3 border-[rgba(255,255,255,0.06)] text-offwhite hover:border-[rgba(61,255,110,0.13)]'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction */}
        <div className="bg-s2 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
          <div className="text-[11px] font-bold text-muted tracking-[0.8px] mb-3">TRANSACTION STATUS</div>
          {[['Listed Price','₹180',''],['Agreed Price','₹160','text-green-eco'],['Status','● Negotiating','text-warn'],['Meet Time','Tomorrow 4 PM',''],['Meet Place','Library Gate','']].map(([l,v,c]) => (
            <div key={l} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
              <span className="text-xs text-muted">{l}</span>
              <span className={`text-xs font-semibold ${c || ''}`}>{v}</span>
            </div>
          ))}
        </div>

        {/* Eco */}
        <div className="bg-s2 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
          <div className="text-[11px] font-bold text-muted tracking-[0.8px] mb-3">ECO IMPACT</div>
          <div className="bg-green-muted border border-[rgba(61,255,110,0.13)] rounded-xl p-3.5 text-center mb-2.5">
            <div className="font-syne text-[26px] font-extrabold text-green-eco">2.4 kg</div>
            <div className="text-xs text-muted mt-0.5">CO₂ saved by this trade 🌿</div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            = Not driving <strong className="text-offwhite">10 km</strong> or planting <strong className="text-offwhite">0.2 trees</strong>
          </p>
        </div>

        {/* Seller */}
        <div className="bg-s2 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
          <div className="text-[11px] font-bold text-muted tracking-[0.8px] mb-3">SELLER RATING</div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-s3 flex items-center justify-center text-xl flex-shrink-0">🧑</div>
            <div>
              <div className="font-semibold text-sm">Aryan Sharma</div>
              <div className="text-warn text-xs">★★★★★ 4.9</div>
              <div className="text-xs text-muted">23 completed trades</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
