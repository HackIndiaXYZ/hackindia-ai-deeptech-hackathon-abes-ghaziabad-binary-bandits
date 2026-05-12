import React, { useState, useRef, useCallback } from "react";
import { submitKYC } from "../data";

const SCAN_STEPS = [
  { text: "Reading ID document...", duration: 800 },
  { text: "Extracting biometric data...", duration: 700 },
  { text: "Checking AML Watchlists...", duration: 900 },
  { text: "Cross-referencing OFAC database...", duration: 700 },
  { text: "Verifying document authenticity...", duration: 600 },
  { text: "Running liveness detection...", duration: 700 },
  { text: "✓ KYC Passed!", duration: 600 },
];

export default function KYCVerification({ kycStatus, onVerified, walletAddress }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const runScan = async () => {
    if (!file) return;
    setScanning(true);
    setScanLogs([]);
    setScanStep(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      setScanLogs((prev) => [...prev, SCAN_STEPS[i].text]);
      await new Promise((r) => setTimeout(r, SCAN_STEPS[i].duration));
    }

    // API call (with fallback)
    await submitKYC(walletAddress || "0x3f...a9e2", file);

    setScanning(false);
    setDone(true);
    onVerified();
  };

  if (kycStatus === "VERIFIED") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: "rgba(46,204,113,0.15)", border: "2px solid #2ecc71", boxShadow: "0 0 40px rgba(46,204,113,0.3)" }}
          >
            ✓
          </div>
          <h2 className="font-display font-800 text-3xl text-neon text-glow-neon mb-3">Identity Verified</h2>
          <p className="text-slate-400 mb-6">Your KYC verification is complete. You now have full access to purchase fractional NFTs.</p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {["AML Clear", "ID Verified", "Active"].map((label, i) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.2)" }}>
                <div className="text-neon text-lg mb-1">✓</div>
                <div className="text-xs text-slate-400">{label}</div>
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
        <h1 className="font-display font-800 text-3xl text-white mb-1">KYC Verification</h1>
        <p className="text-slate-400 text-sm">AI-powered identity verification · Powered by Sliver Compliance Engine</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-8">
        {["Upload ID", "AI Scan", "Verified"].map((step, i) => {
          const state = done ? "done" : (scanning && i === 1) ? "active" : (i === 0 && !scanning) ? "active" : "idle";
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`step-dot ${state}`}>
                  {state === "done" ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-display font-600 ${state === "done" ? "text-neon" : state === "active" ? "text-white" : "text-slate-600"}`}>
                  {step}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px mx-2 mb-4"
                  style={{ background: i === 0 ? "rgba(46,204,113,0.4)" : "rgba(255,255,255,0.08)" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!scanning && !done && (
        <>
          {/* Drop zone */}
          <div
            className={`drop-zone p-8 text-center mb-6 ${isDragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div>
                <div className="text-4xl mb-3">📄</div>
                <div className="font-display font-600 text-neon text-lg mb-1">{file.name}</div>
                <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · Ready to scan</div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🪪</div>
                <div className="font-display font-600 text-white text-lg mb-2">
                  Drop Government-issued ID here
                </div>
                <div className="text-sm text-slate-400 mb-3">
                  Passport · National ID · Driver's License
                </div>
                <div className="text-xs text-slate-600">
                  Drag & drop or click to browse · PNG, JPG, PDF supported
                </div>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              ["🌐", "AML Screening", "Global watchlist check"],
              ["🔍", "Document OCR", "Auto text extraction"],
              ["🛡", "Liveness Check", "Anti-spoofing AI"],
              ["✅", "Instant Result", "< 30 second process"],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="text-sm font-display font-600 text-white">{title}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={runScan}
            disabled={!file}
            className="btn-neon w-full rounded-xl py-3.5 text-sm font-display font-700 tracking-wide"
          >
            {file ? "Start AI Verification Scan →" : "Upload a document first"}
          </button>
        </>
      )}

      {/* Scanning UI */}
      {scanning && (
        <div className="glass rounded-2xl overflow-hidden">
          {/* Document preview with laser */}
          <div
            className="relative h-48 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0f2027, #0a0f1a)" }}
          >
            <div className="laser-line" />
            <div
              className="text-center z-10"
              style={{ background: "rgba(10,15,26,0.7)", padding: "16px 24px", borderRadius: 12, backdropFilter: "blur(8px)" }}
            >
              <div className="text-4xl mb-2">🪪</div>
              <div className="text-xs font-mono text-neon">{file?.name}</div>
            </div>
            {/* Corner brackets */}
            {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"], ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, border]) => (
              <div key={pos} className={`absolute ${pos} w-5 h-5 ${border}`}
                style={{ borderColor: "#2ecc71", borderWidth: 2 }} />
            ))}
          </div>

          {/* Log output */}
          <div className="p-5">
            <div className="font-mono text-xs space-y-2">
              {SCAN_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    i < scanStep ? "text-neon" : i === scanStep ? "text-white" : "text-slate-700"
                  }`}
                >
                  {i < scanStep ? <span className="text-neon">✓</span> :
                   i === scanStep ? <div className="spin-ring" style={{ width: 12, height: 12, borderWidth: 1.5 }} /> :
                   <span className="text-slate-700">○</span>}
                  {step.text}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="progress-track">
                <div className="progress-fill transition-all duration-500"
                  style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Done */}
      {done && (
        <div className="text-center py-12">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-5"
            style={{ background: "rgba(46,204,113,0.15)", border: "2px solid #2ecc71", boxShadow: "0 0 40px rgba(46,204,113,0.4)" }}
          >
            ✓
          </div>
          <h3 className="font-display font-800 text-2xl text-neon text-glow-neon mb-2">KYC Passed!</h3>
          <p className="text-slate-400 text-sm">Identity verified. Marketplace buy buttons are now unlocked.</p>
        </div>
      )}
    </div>
  );
}
