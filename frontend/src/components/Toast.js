import React, { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(timeoutMs = 2500) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const hide = useCallback(() => {
    setMessage(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (nextMessage) => {
      setMessage(nextMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMessage(null), timeoutMs);
    },
    [timeoutMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast: message, showToast: show, hideToast: hide };
}

export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[72px] left-1/2 -translate-x-1/2 z-[100] px-4"
    >
      <div
        className="bg-s1 border border-[rgba(61,255,110,0.18)] rounded-full px-4 py-2.5 shadow-card"
        onClick={onClose}
      >
        <span className="text-sm font-semibold text-offwhite">{message}</span>
      </div>
    </div>
  );
}

