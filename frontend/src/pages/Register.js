import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const getStrength = pwd => pwd.length === 0 ? 0 : pwd.length < 6 ? 1 : pwd.length < 10 ? 2 : 3;
const STRENGTH_LABEL = ['','Weak','Medium','Strong'];
const STRENGTH_COLOR = ['','text-danger','text-warn','text-green-eco'];
const BAR_COLOR      = ['','bg-danger','bg-warn','bg-green-eco'];

export default function Register() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('StrongPass1!');
  const strength = getStrength(pwd);

  return (
    <AuthLayout>
      <div className="w-[520px] bg-s1 border border-[rgba(61,255,110,0.13)] rounded-[22px] p-11
                      relative z-10 shadow-card-lg animate-card-in">
        <button onClick={() => nav('/')}
                className="flex items-center gap-1.5 text-muted text-sm mb-7 hover:text-offwhite transition-colors bg-transparent border-none p-0">
          ← Back to home
        </button>

        <div className="font-syne text-[22px] font-extrabold text-green-eco mb-1.5">
          Uni<span className="text-offwhite">Thrift</span>
        </div>
        <h1 className="font-syne text-[26px] font-extrabold mb-1.5">Join your campus 🌿</h1>
        <p className="text-sm text-muted mb-7">Create your free account — exclusive .edu.in access</p>

        {/* Google */}
        <button className="w-full flex items-center gap-3 bg-s2 border border-[rgba(255,255,255,0.06)]
                           text-offwhite px-5 py-3.5 rounded-xl text-[15px] font-semibold mb-5
                           hover:border-[rgba(61,255,110,0.13)] hover:bg-s3 transition-all duration-200">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
               style={{background:'linear-gradient(135deg,#4285f4,#34a853,#fbbc05,#ea4335)'}}>G</div>
          Sign up with Google (.edu.in)
          <span className="ml-auto text-[10px] font-bold text-green-eco bg-green-muted
                           border border-[rgba(61,255,110,0.13)] px-2 py-0.5 rounded-full">FASTEST</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted font-medium whitespace-nowrap">OR FILL IN DETAILS</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3.5 mb-4">
          {[['FIRST NAME','Aryan','text'],['LAST NAME','Sharma','text']].map(([lbl, val, type]) => (
            <div key={lbl}>
              <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">{lbl}</label>
              <input type={type} defaultValue={val}
                     className="w-full bg-s2 border border-border rounded-xl px-4 py-3.5 text-offwhite text-[15px] outline-none
                                focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
            </div>
          ))}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">COLLEGE EMAIL</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none">📧</span>
            <input type="email" defaultValue="aryan@vnit.ac.in"
                   className="w-full bg-s2 border border-border rounded-xl pl-12 pr-4 py-3.5 text-offwhite text-[15px] outline-none
                              focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
          </div>
          <div className="flex items-center gap-1.5 bg-[rgba(61,255,110,0.07)] border border-[rgba(61,255,110,0.13)]
                          rounded-lg px-3.5 py-2.5 mt-2">
            <span>✅</span>
            <span className="text-xs text-muted">Valid <strong className="text-green-eco font-semibold">.edu.in address detected</strong> — we'll send a verification OTP</span>
          </div>
        </div>

        {/* College + Year */}
        <div className="grid grid-cols-2 gap-3.5 mb-4">
          <div>
            <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">COLLEGE / UNIVERSITY</label>
            <input type="text" defaultValue="VNIT Nagpur"
                   className="w-full bg-s2 border border-border rounded-xl px-4 py-3.5 text-offwhite text-[15px] outline-none
                              focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
          </div>
          <div>
            <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">YEAR OF STUDY</label>
            <select className="w-full bg-s2 border border-border rounded-xl px-4 py-3.5 text-offwhite text-[15px] outline-none
                               focus:border-green-eco transition-all">
              {['1st Year','2nd Year','3rd Year','4th Year','Postgraduate'].map(y => (
                <option key={y} selected={y==='3rd Year'}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">PASSWORD</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none">🔑</span>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Min. 8 characters"
                   className="w-full bg-s2 border border-border rounded-xl pl-12 pr-4 py-3.5 text-offwhite text-[15px] outline-none
                              focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
          </div>
          {pwd.length > 0 && (
            <>
              <div className="flex gap-1 mt-2">
                {[1,2,3].map(i => (
                  <div key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-300
                                          ${i <= strength ? BAR_COLOR[strength] : 'bg-border'}`} />
                ))}
              </div>
              <p className="text-xs text-muted mt-1">
                Password strength: <span className={`font-semibold ${STRENGTH_COLOR[strength]}`}>{STRENGTH_LABEL[strength]}</span>
              </p>
            </>
          )}
        </div>

        <button onClick={() => nav('/verify')}
                className="w-full bg-green-eco text-bg py-3.5 rounded-xl text-base font-bold
                           hover:bg-[#72ff97] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200">
          Create Account & Verify Email →
        </button>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{' '}
          <button onClick={() => nav('/login')} className="text-green-eco font-semibold bg-transparent border-none p-0">Sign in</button>
        </p>
        <p className="text-xs text-muted text-center mt-3.5 leading-relaxed">
          By creating an account you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </AuthLayout>
  );
}
