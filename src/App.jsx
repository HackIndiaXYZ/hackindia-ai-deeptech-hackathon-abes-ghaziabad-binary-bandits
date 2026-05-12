import React, { useState, useEffect } from "react";
import "./styles.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Marketplace from "./components/Marketplace";
import Portfolio from "./components/Portfolio";
import KYCVerification from "./components/KYCVerification";
import TokenizeAsset from "./components/TokenizeAsset";

export default function App() {
  const [activeView, setActiveView] = useState("marketplace");
  const [kycStatus, setKycStatus] = useState("UNVERIFIED"); // "UNVERIFIED" | "VERIFIED"
  const [walletBalance] = useState(5000.0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newAsset, setNewAsset] = useState(null);

  const handleKYCVerified = () => {
    setKycStatus("VERIFIED");
    setTimeout(() => setActiveView("marketplace"), 1800);
  };

  const handleMinted = (asset) => {
    setNewAsset(asset);
    setActiveView("marketplace");
  };

  // Trigger resize whenever view changes so Recharts recalculates dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
    return () => clearTimeout(timer);
  }, [activeView]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0f1a" }}>
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(46,204,113,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          zIndex: 0,
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-20%", left: "-10%",
          width: "50vw", height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,204,113,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-20%", right: "-10%",
          width: "50vw", height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,112,243,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar
          active={activeView}
          onChange={setActiveView}
          kycStatus={kycStatus}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header
          walletBalance={walletBalance}
          kycStatus={kycStatus}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto">
          <div style={{ display: activeView === "marketplace" ? "block" : "none" }}>
            <Marketplace kycStatus={kycStatus} newAsset={newAsset} />
          </div>
          <div style={{ display: activeView === "portfolio" ? "block" : "none" }}>
            <Portfolio />
          </div>
          <div style={{ display: activeView === "kyc" ? "block" : "none" }}>
            <KYCVerification
              kycStatus={kycStatus}
              onVerified={handleKYCVerified}
              walletAddress="0x3f...a9e2"
            />
          </div>
          <div style={{ display: activeView === "tokenize" ? "block" : "none" }}>
            <TokenizeAsset onMinted={handleMinted} />
          </div>
        </main>
      </div>
    </div>
  );
}
