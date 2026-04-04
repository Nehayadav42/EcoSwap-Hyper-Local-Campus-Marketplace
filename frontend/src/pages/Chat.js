import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const nav = useNavigate();

  return (
    <div className="pt-[62px] min-h-[calc(100vh-62px)] bg-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28 text-center max-w-[440px] mx-auto w-full">
        <div className="text-[52px] mb-5 leading-none" aria-hidden>
          💬
        </div>
        <h1 className="font-syne text-[26px] font-extrabold text-offwhite mb-3">No conversations yet</h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          Start your first chat when you buy or sell on campus — messages with buyers and sellers will show up here.
          Browse listings to find something you need, or list your own item to hear from interested students.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center w-full sm:w-auto">
          <button
            type="button"
            onClick={() => nav('/')}
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
        <p className="text-xs text-muted mt-10 max-w-sm">
          After you connect with someone over a listing, the thread will appear here for meetups and handoffs.
        </p>
      </div>
    </div>
  );
}
