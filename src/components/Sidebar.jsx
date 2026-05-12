import React from "react";

const NAV_ITEMS = [
  { id: "marketplace", label: "Marketplace", icon: "◈" },
  { id: "portfolio", label: "My Portfolio", icon: "◉" },
  { id: "kyc", label: "KYC Verification", icon: "◎" },
  { id: "tokenize", label: "Tokenize Asset", icon: "◇" },
];

export default function Sidebar({ active, onChange, kycStatus, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside
        className={`sidebar fixed md:relative z-50 md:z-auto flex flex-col
          w-64 h-full min-h-screen bg-slate-900 border-r border-white/5 shrink-0
          ${isOpen ? "open" : ""}`}
        style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: "linear-gradient(135deg, #2ecc71, #0070f3)" }}
            >
              S
            </div>
            <div>
              <div className="font-display font-800 text-white text-lg leading-tight">Sliver</div>
              <div className="text-xs text-slate-500 font-mono">RWA Platform v2.1</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 mb-3">
            <span className="text-xs font-display font-600 text-slate-600 uppercase tracking-widest">Navigation</span>
          </div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onChange(item.id); onClose(); }}
              className={`nav-item w-full text-left ${active === item.id ? "active" : ""}`}
            >
              <span className="text-lg w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "kyc" && (
                <span className={`ml-auto text-xs badge ${kycStatus === "VERIFIED" ? "badge-verified" : "badge-blue"}`}>
                  {kycStatus === "VERIFIED" ? "✓ Done" : "Pending"}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* KYC Status card */}
        <div className="mx-3 mb-4 p-3 rounded-xl" style={{ background: "rgba(46,204,113,0.06)", border: "1px solid rgba(46,204,113,0.15)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${kycStatus === "VERIFIED" ? "bg-neon animate-pulse-slow" : "bg-yellow-500"}`} />
            <span className="text-xs font-display font-600 text-slate-400 uppercase tracking-wider">KYC Status</span>
          </div>
          <div className={`font-display font-700 text-sm ${kycStatus === "VERIFIED" ? "text-neon text-glow-neon" : "text-yellow-400"}`}>
            {kycStatus === "VERIFIED" ? "✓ Verified" : "⚠ Unverified"}
          </div>
          {kycStatus !== "VERIFIED" && (
            <button
              onClick={() => { onChange("kyc"); onClose(); }}
              className="mt-2 text-xs btn-blue rounded-lg px-3 py-1.5 w-full"
            >
              Complete KYC →
            </button>
          )}
        </div>

        {/* Version */}
        <div className="px-5 py-3 border-t border-white/5">
          <div className="text-xs text-slate-600 font-mono">Sliver Protocol © 2025</div>
        </div>
      </aside>
    </>
  );
}
