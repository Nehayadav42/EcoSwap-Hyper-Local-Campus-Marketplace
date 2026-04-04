import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getUserProfile, setUserProfile } from '../auth/session';

const AuthContext = createContext(null);

function profileDisplayName(user) {
  if (!user) return '';
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  if (full) return full;
  const local = (user.email || '').split('@')[0] || '';
  const pretty = local.replace(/[._-]+/g, ' ');
  return pretty.replace(/\b\w/g, c => c.toUpperCase()) || 'there';
}

function profileFirstName(user) {
  if (!user) return 'there';
  if (user.firstName && user.firstName.trim()) return user.firstName.trim();
  const name = profileDisplayName(user);
  return name.split(/\s+/)[0] || 'there';
}

function profileSubtitle(user) {
  if (!user) return '';
  const handle = (user.email || '').split('@')[0];
  const parts = [];
  if (handle) parts.push(`@${handle}`);
  if (user.college && String(user.college).trim()) parts.push(user.college.trim());
  if (user.yearOfStudy && String(user.yearOfStudy).trim()) parts.push(user.yearOfStudy.trim());
  return parts.join(' · ') || (handle ? `@${handle}` : '');
}

function greetingPeriod() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUserProfile());

  const setUser = useCallback(next => {
    setUserState(next);
    setUserProfile(next);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    setUserProfile(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, clearUser }), [user, setUser, clearUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { profileDisplayName, profileFirstName, profileSubtitle, greetingPeriod };
