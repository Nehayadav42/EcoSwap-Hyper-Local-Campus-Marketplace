import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { me } from '../api/authApi';
import { getToken, clearToken } from '../auth/session';
import Toast, { useToast } from './Toast';

export default function RequireAuth({ children }) {
  const nav = useNavigate();
  const token = getToken();
  const { toast, showToast, hideToast } = useToast(2500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!token) {
        if (!alive) return;
        setLoading(false);
        nav('/login');
        return;
      }

      try {
        await me();
        if (!alive) return;
        setLoading(false);
      } catch (e) {
        if (!alive) return;
        clearToken();
        setLoading(false);
        showToast(e?.status === 403 ? 'Please verify your email first.' : 'Session expired. Please login again.');
        nav('/login');
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [nav, token, showToast]);

  if (loading) return <Toast message={toast} onClose={hideToast} />;
  return <>{children}</>;
}

