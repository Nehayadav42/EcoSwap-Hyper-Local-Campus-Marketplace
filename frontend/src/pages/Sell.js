import React, { useState } from 'react';
import Toast, { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function Sell() {
  const nav = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const [title, setTitle] = useState('Engineering Maths Vol. 2');
  const [price, setPrice] = useState('180');
  const [condition, setCondition] = useState('Good');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [aiDescription, setAiDescription] = useState('');

  return (
    <div className="pt-[62px] bg-bg min-h-screen font-dm px-6 py-10">
      <Toast message={toast} onClose={hideToast} />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-syne text-3xl font-extrabold text-green-eco">📦 Sell an Item</h1>
            <p className="text-sm text-muted mt-1.5">Create a listing (demo). Buttons are fully clickable.</p>
          </div>
          <button
            type="button"
            onClick={() => nav('/dashboard')}
            className="bg-s2 border border-[rgba(255,255,255,0.06)] text-offwhite px-4 py-2.5 rounded-full text-sm font-semibold hover:border-[rgba(61,255,110,0.13)] transition-all"
          >
            Dashboard
          </button>
        </div>

        <div className="bg-s1 border border-[rgba(255,255,255,0.06)] rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-muted tracking-wider mb-2">TITLE</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-s2 border border-border rounded-xl px-4 py-2.5 text-offwhite text-sm outline-none
                           focus:border-green-eco transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted tracking-wider mb-2">PRICE (₹)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="numeric"
                className="w-full bg-s2 border border-border rounded-xl px-4 py-2.5 text-offwhite text-sm outline-none
                           focus:border-green-eco transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-muted tracking-wider mb-2">CONDITION</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-s2 border border-border rounded-xl px-4 py-2.5 text-offwhite text-sm outline-none
                           focus:border-green-eco transition-all"
              >
                {['Poor', 'Fair', 'Good', 'Like New'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <input
                id="negotiable"
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
              />
              <label htmlFor="negotiable" className="text-sm text-muted">
                Negotiable
              </label>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="text-xs font-bold text-muted tracking-wider">DESCRIPTION</div>
              <button
                type="button"
                onClick={() => {
                  const desc = `Selling "${title}" in ${condition.toLowerCase()} condition. Asking ₹${price}. ${
                    isNegotiable ? 'Negotiable offers welcome.' : 'Fixed price.'
                  } Includes quick pickup at campus (demo).`;
                  setAiDescription(desc);
                  showToast('AI description generated (demo).');
                }}
                className="bg-green-eco text-bg px-4 py-2.5 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
              >
                ✨ Generate with AI
              </button>
            </div>

            <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              rows={5}
              placeholder="Click 'Generate with AI' to fill this automatically."
              className="w-full bg-s2 border border-border rounded-xl px-4 py-3 text-offwhite text-sm outline-none
                         focus:border-green-eco transition-all resize-none"
            />

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !price.trim()) {
                    showToast('Please provide a title and price.');
                    return;
                  }
                  showToast('Listing submitted (demo).');
                  nav('/dashboard');
                }}
                className="bg-green-eco text-bg px-6 py-3 rounded-full text-sm font-bold hover:bg-[#72ff97] transition-all"
              >
                Publish Listing
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiDescription('');
                  showToast('Cleared description.');
                }}
                className="bg-transparent border border-[rgba(61,255,110,0.13)] text-green-eco px-6 py-3 rounded-full text-sm font-bold hover:bg-green-muted transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => showToast('Photo upload is coming soon (demo).')}
                className="bg-s2 border border-[rgba(255,255,255,0.06)] text-offwhite px-6 py-3 rounded-full text-sm font-semibold hover:border-[rgba(61,255,110,0.13)] transition-all"
              >
                Upload Photos
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted mt-4">
          Tip: This is a UI-only demo. When you connect a backend, these buttons can call your APIs.
        </div>
      </div>
    </div>
  );
}

