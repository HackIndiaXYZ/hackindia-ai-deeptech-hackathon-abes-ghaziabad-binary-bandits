import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber } from "../data";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="text-neon font-mono font-500">${payload[0].value}</div>
    </div>
  );
}

export default function AssetModal({ asset, kycStatus, onClose }) {
  if (!asset) return null;
  const chartData = asset.returns.map((v, i) => ({
    month: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
    returns: v,
  }));

  const remaining = asset.totalValue - asset.raised;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        {/* Hero image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, #0f172a)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-5">
            <span className={`badge badge-${asset.badgeType} mr-2`}>{asset.badge}</span>
            <span className="badge" style={{ background: "rgba(0,0,0,0.6)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>
              {asset.category}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="font-display font-700 text-2xl text-white mb-1">{asset.name}</h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <span>📍</span> {asset.location}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Value", value: formatCurrency(asset.totalValue, 0) },
              { label: "Fraction Price", value: formatCurrency(asset.fractionPrice, 0) },
              { label: "Expected APY", value: `${asset.apy}%`, highlight: true },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className={`font-display font-700 text-lg ${s.highlight ? "text-neon" : "text-white"}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Funding bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Funding Progress</span>
              <span className="font-mono font-500 text-neon">{asset.funded}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${asset.funded}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1.5 text-slate-500">
              <span>{formatCurrency(asset.raised, 0)} raised</span>
              <span>{formatCurrency(remaining, 0)} remaining</span>
            </div>
          </div>

          {/* Returns chart */}
          <div>
            <h3 className="font-display font-600 text-white text-sm mb-3">Monthly Returns (12M)</h3>
            <div className="h-36 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", minHeight: 144 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={144}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="returns" stroke="#2ecc71" strokeWidth={2} fill="url(#retGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-display font-600 text-white text-sm mb-3">Asset Location</h3>
            <div className="map-placeholder h-40 rounded-xl" style={{ position: "relative" }}>
              <div
                className="map-pin"
                style={{ top: asset.mapCoords.top, left: asset.mapCoords.left, position: "absolute" }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  top: asset.mapCoords.top, left: asset.mapCoords.left,
                  width: 40, height: 40,
                  background: "rgba(46,204,113,0.15)",
                  border: "1px solid rgba(46,204,113,0.4)",
                  transform: "translate(-50%, -50%)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <div className="absolute bottom-3 right-3 text-xs font-mono text-neon opacity-60">
                {asset.location}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-display font-600 text-white text-sm mb-2">About This Asset</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{asset.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="flex-1 btn-neon rounded-xl py-3 text-sm"
              disabled={kycStatus !== "VERIFIED"}
            >
              {kycStatus === "VERIFIED" ? "Buy Fractional NFT" : "🔒 KYC Required"}
            </button>
            <button
              className="px-4 py-3 rounded-xl text-sm font-display font-600 text-slate-300"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              📄 View Legal Title Deed
            </button>
          </div>

          {kycStatus !== "VERIFIED" && (
            <p className="text-xs text-center text-slate-500">
              Complete KYC verification to unlock fractional purchases
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
