import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Toast, { useToast } from '../components/Toast';
import { getItem } from '../api/itemsApi';

export default function Chat() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const itemId = params.get('itemId');
  const { toast, showToast, hideToast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(itemId));
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return undefined;
    }
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getItem(itemId);
        if (alive) setItem(data);
      } catch (e) {
        if (alive) {
          showToast(e?.message || 'Could not load this listing.');
          setItem(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [itemId]);

  if (!itemId) {
    return (
      <div className="pt-[62px] min-h-[calc(100vh-62px)] bg-bg flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28 text-center max-w-[440px] mx-auto w-full">
          <div className="text-[52px] mb-5 leading-none" aria-hidden>
            💬
          </div>
          <h1 className="font-syne text-[26px] font-extrabold text-offwhite mb-3">No conversation selected</h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            Open a listing on the marketplace and tap <strong className="text-offwhite">Chat with seller</strong> to
            start talking about that item. Full messaging will sync here when the chat API is connected.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center w-full sm:w-auto">
            <button
              type="button"
              onClick={() => nav('/marketplace')}
              className="w-full sm:w-auto bg-green-eco text-bg px-6 py-3 rounded-xl text-sm font-bold
                         hover:bg-[#72ff97] hover:-translate-y-0.5 hover:shadow-glow-lg transition-all duration-200"
            >
              Browse marketplace
            </button>
            <button
              type="button"
              onClick={() => nav('/sell')}
              className="w-full sm:w-auto bg-s2 border border-[rgba(255,255,255,0.08)] text-offwhite px-6 py-3 rounded-xl text-sm font-semibold
                         hover:border-[rgba(61,255,110,0.2)] transition-all duration-200"
            >
              Sell an item
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-[62px] min-h-[calc(100vh-62px)] bg-bg flex items-center justify-center px-6">
        <p className="text-sm text-muted">Loading conversation…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-[62px] min-h-[calc(100vh-62px)] bg-bg flex flex-col items-center justify-center px-6 gap-4">
        <Toast message={toast} onClose={hideToast} />
        <p className="text-sm text-muted">This listing could not be loaded.</p>
        <button
          type="button"
          onClick={() => nav('/marketplace')}
          className="bg-green-eco text-bg px-5 py-2.5 rounded-full text-sm font-bold"
        >
          Back to marketplace
        </button>
      </div>
    );
  }

  const telHref = item.sellerContactPhone
    ? `tel:${String(item.sellerContactPhone).replace(/\s/g, '')}`
    : null;

  return (
    <div className="pt-[62px] min-h-[calc(100vh-62px)] bg-bg flex flex-col font-dm">
      <Toast message={toast} onClose={hideToast} />

      <div className="border-b border-[rgba(61,255,110,0.13)] bg-s1 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => nav('/marketplace')}
            className="text-sm text-green-eco font-semibold bg-transparent border-none p-0 shrink-0"
          >
            ← Marketplace
          </button>
          <div className="min-w-0">
            <div className="text-xs font-bold text-muted tracking-wide">LISTING</div>
            <div className="font-syne text-lg font-extrabold text-offwhite truncate">{item.title}</div>
            <div className="text-sm text-muted">
              Seller: <span className="text-offwhite font-medium">{item.sellerDisplayName || 'Student'}</span>
              {item.sellerCollege ? (
                <span className="text-muted"> · {item.sellerCollege}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {telHref ? (
            <a
              href={telHref}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-green-eco text-bg hover:bg-[#72ff97] transition-all"
            >
              📞 Call seller
            </a>
          ) : (
            <span className="text-xs text-muted self-center">No phone on file — use chat below</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-5 py-6">
        {item.isOwnListing ? (
          <div className="bg-green-muted border border-[rgba(61,255,110,0.2)] rounded-xl px-4 py-3 text-sm text-offwhite mb-4">
            This is <strong>your</strong> listing. Buyers will reach you here once real-time messaging is enabled.
          </div>
        ) : (
          <p className="text-sm text-muted mb-4">
            Say hi, ask about condition, or suggest a meetup spot. Messages are stored locally for now — server chat is
            coming next.
          </p>
        )}

        <div className="flex-1 min-h-[200px] bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 mb-4 text-sm text-muted flex items-center justify-center text-center">
          No messages yet — be the first to reach out.
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && draft.trim()) {
                showToast('Messaging API not connected yet — your note was not sent.');
                setDraft('');
              }
            }}
            placeholder="Type a message…"
            disabled={item.isOwnListing}
            className="flex-1 bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm outline-none focus:border-green-eco disabled:opacity-50"
          />
          <button
            type="button"
            disabled={item.isOwnListing || !draft.trim()}
            onClick={() => {
              showToast('Messaging API not connected yet — your note was not sent.');
              setDraft('');
            }}
            className="px-5 py-3 rounded-xl bg-green-eco text-bg text-sm font-bold hover:bg-[#72ff97] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
