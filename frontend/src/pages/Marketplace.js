import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';
import { listItems } from '../api/itemsApi';
import { getToken } from '../auth/session';
import { useAuth } from '../context/AuthContext';

const CATS = [
  { ico: '📚', n: 'Books', c: '2,340' },
  { ico: '💻', n: 'Electronics', c: '980' },
  { ico: '🔬', n: 'Lab Gear', c: '430' },
  { ico: '🛏', n: 'Hostel', c: '1,120' },
  { ico: '🖊', n: 'Stationery', c: '670' },
  { ico: '🎸', n: 'Others', c: '560' }
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
    <h1 className="font-syne text-[40px] md:text-[44px] font-extrabold leading-tight tracking-tight mb-3">
      {children}
    </h1>
  );
}

export default function Marketplace() {
  const nav = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const { user } = useAuth();
  const [liveItems, setLiveItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setItemsLoading(true);
      setItemsError('');
      try {
        const data = await listItems();
        if (!alive) return;
        setLiveItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setItemsError(e?.message || 'Could not load listings.');
        setLiveItems([]);
      } finally {
        if (alive) setItemsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function handleChatClick(item) {
    if (!getToken()) {
      showToast('Log in to message the seller.');
      nav('/login');
      return;
    }
    const me = user?.email?.toLowerCase();
    if (me && item.sellerEmail === me) {
      showToast('This is your own listing.');
      return;
    }
    nav(`/chat?itemId=${item._id}`);
  }

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm">
      <Toast message={toast} onClose={hideToast} />

      <div className="px-6 md:px-12 lg:px-20 py-10 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <SectionLabel>🏪 MARKETPLACE</SectionLabel>
            <SectionH>
              What students are <em className="text-green-eco not-italic">selling now</em>
            </SectionH>
            <p className="text-base text-muted max-w-2xl leading-relaxed">
              Live listings from your campus database. Log in to chat with a seller or call if they shared a number
              (shown in chat).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => nav('/')}
              className="border border-border text-offwhite px-5 py-2.5 rounded-full text-sm font-medium hover:border-green-eco hover:text-green-eco transition-all"
            >
              ← Home
            </button>
            {getToken() ? (
              <button
                type="button"
                onClick={() => nav('/sell')}
                className="bg-green-eco text-bg px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
              >
                + Sell item
              </button>
            ) : null}
          </div>
        </div>

        {itemsLoading ? (
          <p className="text-sm text-muted mb-16">Loading listings…</p>
        ) : itemsError ? (
          <div className="mb-16 text-sm text-danger bg-s1 border border-[rgba(255,92,92,0.25)] rounded-2xl px-5 py-4">
            {itemsError}
          </div>
        ) : liveItems.length === 0 ? (
          <div className="mb-16 bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-10 text-center max-w-2xl">
            <p className="text-offwhite font-semibold mb-2">No listings yet</p>
            <p className="text-sm text-muted mb-4">Be the first to post something for sale.</p>
            <button
              type="button"
              onClick={() => (getToken() ? nav('/sell') : nav('/register'))}
              className="bg-green-eco text-bg px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
            >
              {getToken() ? 'Sell an item' : 'Sign up to sell'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-20">
            {liveItems.map(item => (
              <div
                key={item._id}
                className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col
                           hover:border-[rgba(61,255,110,0.15)] transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h2 className="font-syne text-lg font-bold text-offwhite leading-snug">{item.title}</h2>
                  <span className="font-syne text-xl font-extrabold text-green-eco whitespace-nowrap">₹{item.price}</span>
                </div>
                <p className="text-xs text-muted mb-1">
                  Seller: <span className="text-offwhite">{item.sellerDisplayName || 'Student'}</span>
                  {item.sellerCollege ? ` · ${item.sellerCollege}` : ''}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-muted border border-[rgba(61,255,110,0.13)] text-green-eco">
                    {item.condition || '—'}
                  </span>
                  {item.isNegotiable ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-s3 border border-[rgba(255,255,255,0.06)] text-muted">
                      Negotiable
                    </span>
                  ) : null}
                  {item.hasSellerContact ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-s3 border border-[rgba(255,255,255,0.06)] text-muted">
                      Phone in chat
                    </span>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="text-sm text-muted flex-1 mb-4 max-h-[4.5rem] overflow-hidden">{item.description}</p>
                ) : (
                  <div className="flex-1" />
                )}
                <button
                  type="button"
                  onClick={() => handleChatClick(item)}
                  className="w-full mt-auto bg-green-eco text-bg py-3 rounded-xl text-sm font-bold hover:bg-[#72ff97] transition-all"
                >
                  Chat with seller
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-[rgba(61,255,110,0.13)] pt-16">
          <SectionLabel>📦 CATEGORIES</SectionLabel>
          <SectionH>
            Browse by <em className="text-green-eco not-italic">type</em>
          </SectionH>
          <p className="text-sm text-muted mb-8 max-w-xl">Filters are coming soon — for now, scroll the grid above for all live items.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {CATS.map(c => (
              <button
                key={c.n}
                type="button"
                onClick={() => showToast(`${c.n} filters are coming soon.`)}
                className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 text-center cursor-pointer
                              hover:border-[rgba(61,255,110,0.13)] hover:bg-s2 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-[36px] mb-2.5">{c.ico}</div>
                <div className="text-sm font-semibold">{c.n}</div>
                <div className="text-xs text-muted mt-0.5">{c.c} items</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
