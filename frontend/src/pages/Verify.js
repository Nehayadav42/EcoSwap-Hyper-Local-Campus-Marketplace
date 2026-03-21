import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const TOTAL = 167;

export default function Verify() {
  const nav = useNavigate();
  const [otp, setOtp] = useState(['4','8','3','','','']);
  const [secs, setSecs] = useState(TOTAL);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const progress = (secs / TOTAL) * 100;

  const handleChange = (i, val) => {
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) refs.current[i+1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus();
  };

  return (
    <AuthLayout>
      <div className="w-[460px] bg-s1 border border-[rgba(61,255,110,0.13)] rounded-[22px] p-11
                      relative z-10 shadow-card-lg animate-card-in text-center">
        {/* Icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-green-muted border border-[rgba(61,255,110,0.13)]
                        flex items-center justify-center text-[32px] mx-auto mb-5">📬</div>

        <h1 className="font-syne text-2xl font-extrabold mb-2">Check your inbox</h1>
        <p className="text-sm text-muted">We sent a 6-digit code to</p>
        <p className="text-sm font-semibold text-green-eco mb-6">aryan@vnit.ac.in</p>

        {/* Progress bar */}
        <div className="bg-s2 rounded-full h-1 overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-1000"
               style={{width:`${progress}%`, background:'linear-gradient(90deg,#3dff6e,#a8ff78)'}} />
        </div>
        <p className="text-xs text-muted mb-5">
          Code expires in <span className="text-warn font-semibold">{fmt(secs)}</span>
        </p>

        {/* OTP Boxes */}
        <div className="flex gap-2.5 justify-center mb-6">
          {otp.map((v, i) => (
            <input key={i} ref={el => refs.current[i] = el}
                   maxLength={1} value={v}
                   onChange={e => handleChange(i, e.target.value)}
                   onKeyDown={e => handleKey(i, e)}
                   className={`w-[54px] h-[60px] rounded-xl text-center text-2xl font-bold text-offwhite outline-none
                               border transition-all duration-200
                               focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)]
                               ${v ? 'border-green-eco bg-green-muted' : 'border-border bg-s2'}`} />
          ))}
        </div>

        <button onClick={() => nav('/dashboard')}
                className="w-full bg-green-eco text-bg py-3.5 rounded-xl text-base font-bold
                           hover:bg-[#72ff97] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200">
          ✓ Verify & Enter UniThrift
        </button>

        <p className="text-sm text-muted mt-4">
          Didn't get it?{' '}
          <a href="#" className="text-green-eco font-semibold">Resend code</a>
          {' · '}
          <button onClick={() => nav('/register')} className="text-green-eco font-semibold bg-transparent border-none p-0">
            Change email
          </button>
        </p>

        {/* Tips */}
        <div className="bg-s2 border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mt-4 text-left">
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-offwhite">💡 Tips:</strong> Check your spam/junk folder.
            Make sure you used your official college email.
            Codes are valid for <strong className="text-offwhite">10 minutes</strong>.
          </p>
        </div>

        <p className="text-sm text-muted mt-4">
          <button onClick={() => nav('/login')} className="text-green-eco font-semibold bg-transparent border-none p-0">
            ← Back to login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
