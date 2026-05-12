import React, { useState, useRef } from "react";
import { formatCurrency } from "../data";

const CATEGORIES = ["Real Estate", "Fine Art", "Invoice", "Infrastructure", "Commodities", "IP Rights"];

const STEP_LABELS = ["Asset Details", "Financials", "Upload Docs"];

function StepDot({ step, current }) {
  const state = step < current ? "done" : step === current ? "active" : "idle";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`step-dot ${state}`}>
        {state === "done" ? "✓" : step + 1}
      </div>
      <span className={`text-xs font-display font-600 text-center leading-tight max-w-16 ${
        state === "done" ? "text-neon" : state === "active" ? "text-white" : "text-slate-600"
      }`}>
        {STEP_LABELS[step]}
      </span>
    </div>
  );
}

export default function TokenizeAsset({ onMinted }) {
  const [step, setStep] = useState(0);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    totalValue: "",
    fractionPrice: "",
    apy: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fractionCount = form.totalValue && form.fractionPrice
    ? Math.floor(Number(form.totalValue.replace(/,/g, "")) / Number(form.fractionPrice.replace(/,/g, "")))
    : 0;

  const handleMint = async () => {
    setMinting(true);
    await new Promise((r) => setTimeout(r, 3200));
    setMinting(false);
    setMinted(true);

    const newAsset = {
      id: Date.now(),
      name: form.name || "Unnamed Asset",
      category: form.category || "Real Estate",
      location: "Location TBD",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
      totalValue: Number(form.totalValue.replace(/,/g, "")) || 1000000,
      fractionPrice: Number(form.fractionPrice.replace(/,/g, "")) || 100,
      apy: Number(form.apy) || 8.0,
      funded: 0,
      raised: 0,
      description: form.description || "Freshly tokenized asset.",
      mapCoords: { top: "40%", left: "50%" },
      badge: "New",
      badgeType: "neon",
      returns: Array.from({ length: 12 }, () => Math.floor(Math.random() * 500 + 200)),
    };

    setTimeout(() => {
      onMinted(newAsset);
    }, 1500);
  };

  if (minted) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="text-6xl mb-6 animate-float inline-block">🪙</div>
          <h2 className="font-display font-800 text-3xl text-neon text-glow-neon mb-3">Tokens Minted!</h2>
          <p className="text-slate-400 mb-2">
            <span className="font-mono text-white">{fractionCount.toLocaleString()}</span> fractional NFTs successfully deployed on Polygon.
          </p>
          <p className="text-slate-500 text-sm mb-8">Redirecting to Marketplace...</p>
          <div className="glass rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
            {[
              ["Token Standard", "ERC-1400"],
              ["Network", "Polygon PoS"],
              ["Fractions", fractionCount.toLocaleString()],
              ["Price / Token", `$${form.fractionPrice}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-mono text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-800 text-3xl text-white mb-1">Tokenize Asset</h1>
        <p className="text-slate-400 text-sm">No-code tokenization wizard · Deploy to Polygon in minutes</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEP_LABELS.map((_, i) => (
          <React.Fragment key={i}>
            <StepDot step={i} current={step} />
            {i < 2 && (
              <div className="flex-1 h-px mx-2 mb-5"
                style={{ background: i < step ? "rgba(46,204,113,0.5)" : "rgba(255,255,255,0.08)" }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-700 text-white text-xl">Asset Details</h2>

          <div>
            <label className="field-label">Asset Name</label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Manhattan Luxury Condo"
              className="input-field"
            />
          </div>

          <div>
            <label className="field-label">Category</label>
            <select value={form.category} onChange={set("category")} className="input-field">
              <option value="" disabled>Select a category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the asset, its location, tenant situation, etc."
              className="input-field"
              rows={4}
            />
          </div>

          <button
            onClick={() => setStep(1)}
            disabled={!form.name || !form.category}
            className="btn-neon w-full rounded-xl py-3 text-sm font-display font-700"
          >
            Continue to Financials →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-700 text-white text-xl">Financial Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Total Appraised Value ($)</label>
              <input
                type="number"
                value={form.totalValue}
                onChange={set("totalValue")}
                placeholder="e.g. 2000000"
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">Fraction Price ($)</label>
              <input
                type="number"
                value={form.fractionPrice}
                onChange={set("fractionPrice")}
                placeholder="e.g. 100"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Expected APY (%)</label>
            <input
              type="number"
              step="0.1"
              value={form.apy}
              onChange={set("apy")}
              placeholder="e.g. 8.5"
              className="input-field"
            />
          </div>

          {fractionCount > 0 && (
            <div className="p-4 rounded-xl" style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.2)" }}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-mono text-xl font-700 text-neon">{fractionCount.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Total Tokens</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-700 text-white">${form.fractionPrice}</div>
                  <div className="text-xs text-slate-500">Per Token</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-700 text-yellow-400">{form.apy || "—"}%</div>
                  <div className="text-xs text-slate-500">Est. APY</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="px-4 py-3 rounded-xl text-slate-400 text-sm font-display font-600"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ← Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!form.totalValue || !form.fractionPrice}
              className="btn-neon flex-1 rounded-xl py-3 text-sm font-display font-700"
            >
              Continue to Documents →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-700 text-white text-xl">Ownership Documents</h2>

          <div
            className={`drop-zone p-8 text-center ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              setUploadedFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" className="hidden"
              onChange={(e) => setUploadedFile(e.target.files[0])} />
            {uploadedFile ? (
              <div>
                <div className="text-4xl mb-3">📜</div>
                <div className="font-display font-600 text-neon text-lg mb-1">{uploadedFile.name}</div>
                <div className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📄</div>
                <div className="font-display font-600 text-white text-base mb-2">Upload Ownership Papers</div>
                <div className="text-sm text-slate-400 mb-2">Title Deed · Valuation Certificate · Legal Agreement</div>
                <div className="text-xs text-slate-600">PDF, PNG, JPG supported</div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="font-display font-600 text-white text-sm mb-3">Deployment Summary</div>
            {[
              ["Asset Name", form.name],
              ["Category", form.category],
              ["Total Value", formatCurrency(Number(form.totalValue || 0), 0)],
              ["Fraction Price", formatCurrency(Number(form.fractionPrice || 0), 0)],
              ["Tokens to Mint", fractionCount.toLocaleString()],
              ["Expected APY", `${form.apy}%`],
              ["Network", "Polygon PoS"],
              ["Standard", "ERC-1400"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-mono text-white">{val || "—"}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl text-slate-400 text-sm font-display font-600"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              ← Back
            </button>
            <button
              onClick={handleMint}
              disabled={minting}
              className="btn-neon flex-1 rounded-xl py-3 text-sm font-display font-700 flex items-center justify-center gap-2"
            >
              {minting ? (
                <>
                  <div className="spin-ring" />
                  <span>Generating Smart Contracts on Blockchain...</span>
                </>
              ) : (
                "🪙 Mint Fractional Tokens"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
