import React, { useState } from "react";
import { formatCurrency } from "../data";

export default function Header({ walletBalance, kycStatus, onMenuToggle }) {
  const [connected, setConnected] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16"
      style={{
        background: "rgba(10,15,26,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3" width="20" height="2" rx="1"/>
            <rect y="9" width="20" height="2" rx="1"/>
            <rect y="15" width="20" height="2" rx="1"/>
          </svg>
        </button>
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #2ecc71, #0070f3)" }}>S</div>
          <span className="font-display font-700 text-white">Sliver 🌐</span>
        </div>
        <div className="hidden md:block">
          <span className="text-xs text-slate-500 font-mono">Real-World Asset Tokenization Platform</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Network badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-slow" />
          <span className="text-xs font-mono text-neon">Polygon</span>
        </div>

        {/* Balance */}
        {connected && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-500 font-mono">Balance</span>
            <span className="text-sm font-display font-700 text-white">{formatCurrency(walletBalance)}</span>
          </div>
        )}

        {/* KYC badge */}
        {kycStatus === "VERIFIED" && (
          <span className="badge badge-verified hidden sm:inline-flex">✓ KYC</span>
        )}

        {/* Wallet button */}
        <button
          onClick={() => setConnected(!connected)}
          className={`btn-${connected ? "neon" : "blue"} rounded-xl px-3 md:px-5 py-2 text-sm flex items-center gap-2`}
        >
          <span>{connected ? "●" : "◌"}</span>
          <span className="hidden sm:inline">
            {connected ? "0x3f...a9e2" : "Connect Wallet"}
          </span>
          <span className="sm:hidden">{connected ? "0x3f" : "Connect"}</span>
        </button>
      </div>
    </header>
  );
}
