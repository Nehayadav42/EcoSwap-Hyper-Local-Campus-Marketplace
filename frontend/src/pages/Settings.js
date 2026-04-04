import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Toast, { useToast } from '../components/Toast';
import { clearToken } from '../auth/session';
import { useAuth, profileDisplayName } from '../context/AuthContext';
import { patchProfile } from '../api/authApi';

export default function Settings() {
  const nav = useNavigate();
  const { user, clearUser, setUser } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [notifEmail, setNotifEmail] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const displayName = profileDisplayName(user);

  useEffect(() => {
    setPhoneInput(user?.phone || '');
  }, [user?.phone]);

  return (
    <DashboardLayout>
      <Toast message={toast} onClose={hideToast} />
      <div className="max-w-2xl">
        <h1 className="font-syne text-[28px] font-extrabold mb-1">⚙️ Settings</h1>
        <p className="text-sm text-muted mb-8">Profile details come from your account. Full profile editing will sync with the server in a future update.</p>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6">
          <div className="text-[11px] font-bold text-muted tracking-wider mb-4">PROFILE</div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">DISPLAY NAME</label>
              <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{displayName || '—'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">EMAIL</label>
              <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{user?.email || '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">FIRST NAME</label>
                <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{user?.firstName?.trim() || '—'}</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted mb-1.5">LAST NAME</label>
                <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{user?.lastName?.trim() || '—'}</div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">COLLEGE</label>
              <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{user?.college?.trim() || '—'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">YEAR OF STUDY</label>
              <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">{user?.yearOfStudy?.trim() || '—'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-1.5">ECO POINTS (FROM DB)</label>
              <div className="bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm">
                {typeof user?.ecoPoints === 'number' ? user.ecoPoints : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6">
          <div className="text-[11px] font-bold text-muted tracking-wider mb-4">CONTACT FOR BUYERS</div>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            Optional phone number. Buyers see it when they open chat on your listings (unless you set a different number
            on a single listing).
          </p>
          <label className="block text-xs font-bold text-muted mb-1.5">PHONE</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="tel"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="flex-1 bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm outline-none focus:border-green-eco"
            />
            <button
              type="button"
              disabled={savingPhone}
              onClick={async () => {
                setSavingPhone(true);
                try {
                  const profile = await patchProfile({ phone: phoneInput });
                  setUser(profile);
                  showToast('Phone saved to your profile.');
                } catch (e) {
                  showToast(e?.message || 'Could not save phone.');
                } finally {
                  setSavingPhone(false);
                }
              }}
              className="bg-green-eco text-bg px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#72ff97] transition-all disabled:opacity-60 shrink-0"
            >
              {savingPhone ? 'Saving…' : 'Save phone'}
            </button>
          </div>
        </div>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-6">
          <div className="text-[11px] font-bold text-muted tracking-wider mb-4">NOTIFICATIONS</div>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-offwhite">Email for trades and messages</div>
              <div className="text-xs text-muted mt-0.5">We&apos;ll only send campus-related updates (demo toggle).</div>
            </div>
            <input
              type="checkbox"
              checked={notifEmail}
              onChange={e => setNotifEmail(e.target.checked)}
              className="w-5 h-5 accent-green-eco rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <div className="text-[11px] font-bold text-muted tracking-wider mb-4">SECURITY</div>
          <button
            type="button"
            onClick={() => showToast('Password change flow is coming soon. Use a strong password when registering.')}
            className="w-full text-left bg-s2 border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-sm font-semibold text-offwhite hover:border-[rgba(61,255,110,0.2)] transition-all mb-3"
          >
            Change password
          </button>
          <button
            type="button"
            onClick={() => {
              clearToken();
              clearUser();
              nav('/login');
            }}
            className="w-full text-left border border-[rgba(255,92,92,0.35)] rounded-xl px-4 py-3 text-sm font-semibold text-danger bg-transparent hover:bg-[rgba(255,92,92,0.08)] transition-all"
          >
            Log out on this device
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
