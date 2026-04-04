import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { listMyItems } from '../api/itemsApi';

export default function MyListings() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listMyItems();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load listings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="font-syne text-[28px] font-extrabold mb-1">📦 My Listings</h1>
        <p className="text-sm text-muted mb-8">
          Items you publish appear here and in the shared Atlas items collection (matched by your email or user id).
        </p>

        {loading ? (
          <p className="text-sm text-muted">Loading your listings…</p>
        ) : error ? (
          <div className="bg-s1 border border-[rgba(255,92,92,0.25)] rounded-2xl p-6 text-sm text-danger">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-12 flex flex-col items-center justify-center text-center max-w-2xl">
            <span className="text-5xl mb-4">🏷️</span>
            <p className="text-lg text-offwhite font-semibold mb-2">No listings yet</p>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-md">
              Create a listing so other students can discover your books and gear. It will be stored in MongoDB under your account.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => nav('/sell')}
                className="bg-green-eco text-bg px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#72ff97] transition-all"
              >
                Create listing
              </button>
              <button
                type="button"
                onClick={() => nav('/marketplace')}
                className="bg-s2 border border-[rgba(255,255,255,0.08)] text-offwhite px-6 py-3 rounded-xl text-sm font-semibold hover:border-[rgba(61,255,110,0.2)] transition-all"
              >
                Browse marketplace
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 hover:border-[rgba(61,255,110,0.15)] transition-all"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h2 className="font-syne text-lg font-bold text-offwhite leading-snug">{item.title}</h2>
                  <span className="font-syne text-xl font-extrabold text-green-eco whitespace-nowrap">₹{item.price}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-green-muted border border-[rgba(61,255,110,0.15)] text-green-eco">
                    {item.condition || '—'}
                  </span>
                  {item.isNegotiable ? (
                    <span className="px-2.5 py-1 rounded-full bg-s3 border border-[rgba(255,255,255,0.06)] text-muted">
                      Negotiable
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-s3 border border-[rgba(255,255,255,0.06)] text-muted">
                      Fixed price
                    </span>
                  )}
                </div>
                {item.description ? (
                  <p className="text-sm text-muted mt-3 max-h-[4.5rem] overflow-hidden">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
