import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-10 py-20 bg-bg relative overflow-hidden">
      {/* BG radial */}
      <div className="absolute inset-0 pointer-events-none"
           style={{background:'radial-gradient(ellipse 600px 500px at 0% 50%,rgba(61,255,110,0.07) 0%,transparent 70%),radial-gradient(ellipse 400px 400px at 100% 20%,rgba(61,255,110,0.04) 0%,transparent 60%)'}} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none grid-bg-sm" />
      {children}
    </div>
  );
}
