import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Toast, { useToast } from '../components/Toast';
import { login, me } from '../api/authApi';
import { setToken } from '../auth/session';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast, showToast, hideToast } = useToast();

  return (
    <AuthLayout>
      <Toast message={toast} onClose={hideToast} />
      <div className="w-[460px] bg-s1 border border-[rgba(61,255,110,0.13)] rounded-[22px] p-11
                      relative z-10 shadow-card-lg animate-card-in">
        <button onClick={() => nav('/')}
                className="flex items-center gap-1.5 text-muted text-sm mb-7 hover:text-offwhite transition-colors bg-transparent border-none p-0">
          ← Back to home
        </button>

        <div className="font-syne text-[22px] font-extrabold text-green-eco mb-1.5">
          Uni<span className="text-offwhite">Thrift</span>
        </div>
        <h1 className="font-syne text-[26px] font-extrabold mb-1.5">Welcome back 👋</h1>
        <p className="text-sm text-muted mb-7">Sign in to your campus marketplace</p>

        {/* Google */}
        <button
          onClick={() => {
            showToast('Google sign-in is not wired up yet. Use email/password.');
          }}
          className="w-full flex items-center gap-3 bg-s2 border border-[rgba(255,255,255,0.06)]
                           text-offwhite px-5 py-3.5 rounded-xl text-[15px] font-semibold mb-5
                           hover:border-[rgba(61,255,110,0.13)] hover:bg-s3 transition-all duration-200">
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
               style={{background:'linear-gradient(135deg,#4285f4,#34a853,#fbbc05,#ea4335)'}}>G</div>
          Continue with Google (.edu.in)
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted font-medium whitespace-nowrap">OR SIGN IN WITH EMAIL</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[11.5px] font-bold text-muted tracking-[0.6px] mb-2">COLLEGE EMAIL</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none">📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@college.edu.in"
                   className="w-full bg-s2 border border-border rounded-xl pl-12 pr-4 py-3.5 text-offwhite text-[15px] outline-none
                              focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
          </div>
          <div className="flex items-center gap-1.5 bg-[rgba(61,255,110,0.07)] border border-[rgba(61,255,110,0.13)]
                          rounded-lg px-3.5 py-2.5 mt-2">
            <span>🔒</span>
            <span className="text-xs text-muted">
              Campus email recommended (demo accepts any email)
            </span>
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11.5px] font-bold text-muted tracking-[0.6px]">PASSWORD</label>
            <button
              type="button"
              onClick={() => showToast('Forgot password flow is coming soon.')}
              className="text-xs text-green-eco font-semibold bg-transparent border-none p-0"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none">🔑</span>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
                   className="w-full bg-s2 border border-border rounded-xl pl-12 pr-14 py-3.5 text-offwhite text-[15px] outline-none
                              focus:border-green-eco focus:shadow-[0_0_0_3px_rgba(61,255,110,0.12)] transition-all" />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-green-eco font-semibold bg-transparent border-none">
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              if (!email.trim() || !password) {
                showToast('Enter your college email and password.');
                return;
              }
              const result = await login(email, password);
              setToken(result.token);
              const profile = await me();
              setUser(profile);
              showToast('Signed in successfully.');
              nav('/dashboard');
            } catch (e) {
              if (e?.status === 403) {
                showToast('Email not verified. Enter OTP to continue.');
                nav(`/verify?email=${encodeURIComponent(email)}`);
                return;
              }
              showToast(e?.message || 'Sign in failed.');
            }
          }}
                className="w-full bg-green-eco text-bg py-3.5 rounded-xl text-base font-bold mt-1.5
                           hover:bg-[#72ff97] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200">
          Sign In →
        </button>

        <p className="text-center text-sm text-muted mt-5">
          Don't have an account?{' '}
          <button onClick={() => nav('/register')} className="text-green-eco font-semibold bg-transparent border-none p-0">
            Create one free
          </button>
        </p>
        <p className="text-xs text-muted text-center mt-3.5 leading-relaxed">
          By continuing you agree to our{' '}
          <button
            type="button"
            onClick={() => showToast('Terms are coming soon.')}
            className="underline text-muted bg-transparent border-none p-0"
          >
            Terms
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => showToast('Privacy Policy is coming soon.')}
            className="underline text-muted bg-transparent border-none p-0"
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
