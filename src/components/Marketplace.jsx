import React, { useState, useEffect } from "react";
import { fetchAssets, formatCurrency } from "../data";
import AssetModal from "./AssetModal";

function AssetCard({ asset, kycStatus, onClick }) {
  const remaining = asset.totalValue - asset.raised;
  const tokensLeft = Math.floor(remaining / asset.fractionPrice);

  return (
    <div
      className="glass glass-hover rounded-2xl overflow-hidden flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={asset.image}
          alt={asset.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,15,26,0.95))" }}
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`badge badge-${asset.badgeType}`}>{asset.badge}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="font-display font-700 text-white text-base leading-tight">{asset.name}</div>
          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <span>📍</span>{asset.location}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Total Value</div>
            <div className="font-mono text-xs font-500 text-white">{formatCurrency(asset.totalValue, 0)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Per Fraction</div>
            <div className="font-mono text-xs font-500 text-white">{formatCurrency(asset.fractionPrice)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-0.5">Est. APY</div>
            <div className="font-mono text-xs font-700 text-neon text-glow-neon">{asset.apy}%</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">{asset.funded}% funded</span>
            <span className="text-slate-500 font-mono">{formatCurrency(remaining, 0)} left</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${asset.funded}%` }} />
          </div>
        </div>

        <div className="text-xs text-slate-600 mb-3 font-mono">{tokensLeft.toLocaleString()} fractions remaining</div>

        {/* Button */}
        <button
          className="btn-neon rounded-xl py-2.5 text-sm mt-auto w-full"
          disabled={kycStatus !== "VERIFIED"}
          onClick={(e) => e.stopPropagation()}
        >
          {kycStatus === "VERIFIED" ? "Buy Fractional NFT" : "🔒 KYC Required"}
        </button>
      </div>
    </div>
  );
}

export default function Marketplace({ kycStatus, newAsset }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchAssets().then((data) => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (newAsset) {
      setAssets((prev) => [newAsset, ...prev]);
    }
  }, [newAsset]);

  const categories = ["All", "Real Estate", "Fine Art", "Invoice"];
  const filtered = assets
    .filter((a) => filter === "All" || a.category === filter || (filter === "Invoice" && a.category === "Invoice"))
    .sort((a, b) => {
      if (sortBy === "apy") return b.apy - a.apy;
      if (sortBy === "value") return b.totalValue - a.totalValue;
      if (sortBy === "funded") return b.funded - a.funded;
      return a.id - b.id;
    });

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-800 text-3xl text-white mb-1">Asset Marketplace</h1>
        <p className="text-slate-400 text-sm">Fractional ownership of premium real-world assets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all duration-200 ${
                filter === c
                  ? "bg-neon text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-xs py-2 px-3 w-auto"
            style={{ width: "140px" }}
          >
            <option value="default">Sort: Default</option>
            <option value="apy">Sort: Highest APY</option>
            <option value="value">Sort: Total Value</option>
            <option value="funded">Sort: % Funded</option>
          </select>
        </div>
      </div>

      {/* KYC banner */}
      {kycStatus !== "VERIFIED" && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
          style={{ background: "rgba(0,112,243,0.08)", border: "1px solid rgba(0,112,243,0.2)" }}>
          <span className="text-2xl">🔒</span>
          <div>
            <div className="font-display font-600 text-blue-300 text-sm">KYC Verification Required</div>
            <div className="text-xs text-slate-400 mt-0.5">Complete identity verification to unlock purchase functionality</div>
          </div>
          <span className="badge badge-blue ml-auto">Unverified</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="spin-ring" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <div className="text-slate-500 font-mono text-sm">Loading assets from chain...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              kycStatus={kycStatus}
              onClick={() => setSelectedAsset(asset)}
            />
          ))}
        </div>
      )}

      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          kycStatus={kycStatus}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
}
