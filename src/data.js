// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_ASSETS = [
  {
    id: 1,
    name: "Manhattan Luxury Condo",
    category: "Real Estate",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    totalValue: 4200000,
    fractionPrice: 100,
    apy: 8.5,
    funded: 75,
    raised: 3150000,
    description: "A stunning 3,200 sq ft penthouse in the heart of Midtown Manhattan. Fully tenanted with blue-chip corporate lessees. Verified title deed on-chain.",
    mapCoords: { top: "38%", left: "28%" },
    badge: "Top Pick",
    badgeType: "neon",
    returns: [820, 940, 870, 1050, 980, 1120, 1200, 1180, 1300, 1280, 1400, 1450],
  },
  {
    id: 2,
    name: "Banksy – \"Devolved Parliament\"",
    category: "Fine Art",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    totalValue: 12800000,
    fractionPrice: 250,
    apy: 12.3,
    funded: 42,
    raised: 5376000,
    description: "Authenticated piece by Banksy. Held in secure gallery storage in Mayfair, London. Insurance-backed, insured for £14M. Fractions provide exposure to blue-chip contemporary art.",
    mapCoords: { top: "25%", left: "47%" },
    badge: "High Yield",
    badgeType: "gold",
    returns: [500, 620, 580, 750, 820, 900, 1050, 980, 1100, 1230, 1180, 1350],
  },
  {
    id: 3,
    name: "Dubai Marina Penthouse",
    category: "Real Estate",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    totalValue: 2800000,
    fractionPrice: 50,
    apy: 9.8,
    funded: 91,
    raised: 2548000,
    description: "Luxurious 4BR penthouse with panoramic Marina views. Managed by Emaar Hospitality. Short-term rental income distributed quarterly to token holders.",
    mapCoords: { top: "45%", left: "63%" },
    badge: "Almost Full",
    badgeType: "blue",
    returns: [400, 480, 520, 490, 600, 650, 700, 720, 780, 810, 860, 900],
  },
  {
    id: 4,
    name: "Berlin Commercial Invoice #4421",
    category: "Invoice",
    location: "Berlin, Germany",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
    totalValue: 380000,
    fractionPrice: 25,
    apy: 14.2,
    funded: 60,
    raised: 228000,
    description: "A 90-day invoice from AAA-rated manufacturer Siemens AG. Discounted receivable with fixed maturity yield. Rated A+ by on-chain credit oracle.",
    mapCoords: { top: "28%", left: "52%" },
    badge: "Fixed Yield",
    badgeType: "gold",
    returns: [1200, 1350, 1300, 1450, 1420, 1550, 1600, 1700, 1650, 1800, 1850, 1900],
  },
  {
    id: 5,
    name: "Tokyo Shibuya Office Block",
    category: "Real Estate",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    totalValue: 8500000,
    fractionPrice: 200,
    apy: 7.1,
    funded: 55,
    raised: 4675000,
    description: "Grade-A office building in Shibuya ward. 98% occupancy. Anchor tenants include Sony and Rakuten. JPY-hedged returns distributed monthly.",
    mapCoords: { top: "35%", left: "83%" },
    badge: "Stable",
    badgeType: "neon",
    returns: [300, 380, 420, 410, 450, 490, 530, 520, 560, 590, 610, 640],
  },
  {
    id: 6,
    name: "Warhol – \"Marilyn Diptych\" (Fragment)",
    category: "Fine Art",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80",
    totalValue: 6200000,
    fractionPrice: 150,
    apy: 10.5,
    funded: 33,
    raised: 2046000,
    description: "Authenticated Andy Warhol piece fragment, co-owned by MoMA foundation. Provenance fully verified. Institutional-grade vault storage in Geneva Freeport.",
    mapCoords: { top: "38%", left: "28%" },
    badge: "Rare",
    badgeType: "gold",
    returns: [250, 310, 390, 420, 480, 530, 610, 680, 720, 780, 850, 920],
  },
];

export const PORTFOLIO_HISTORY = [
  { month: "Jan", value: 8200 }, { month: "Feb", value: 8800 },
  { month: "Mar", value: 9100 }, { month: "Apr", value: 8700 },
  { month: "May", value: 9600 }, { month: "Jun", value: 10200 },
  { month: "Jul", value: 10800 }, { month: "Aug", value: 11200 },
  { month: "Sep", value: 10900 }, { month: "Oct", value: 11800 },
  { month: "Nov", value: 12100 }, { month: "Dec", value: 12450 },
];

export const ALLOCATION_DATA = [
  { name: "Real Estate", value: 62, color: "#2ecc71" },
  { name: "Fine Art", value: 25, color: "#0070f3" },
  { name: "Invoices", value: 13, color: "#f59e0b" },
];

export const MY_HOLDINGS = [
  { assetId: 1, tokens: 45, invested: 4500, currentValue: 5220, yield: 442.50 },
  { assetId: 3, tokens: 120, invested: 6000, currentValue: 6840, yield: 670.20 },
  { assetId: 4, tokens: 15, invested: 375, currentValue: 390, yield: 53.20 },
];

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:8080/api";

export async function fetchAssets() {
  try {
    const res = await fetch(`${API_BASE}/assets`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("Non-2xx response");
    return await res.json();
  } catch {
    console.info("[Sliver] Backend offline — using mock asset data.");
    return MOCK_ASSETS;
  }
}

export async function submitKYC(walletAddress, file) {
  try {
    const formData = new FormData();
    formData.append("wallet", walletAddress);
    formData.append("document", file);
    const res = await fetch(`${API_BASE}/kyc/verify`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("KYC API error");
    return await res.json();
  } catch {
    console.info("[Sliver] KYC API offline — simulating VERIFIED response.");
    return { status: "VERIFIED", wallet: walletAddress, timestamp: Date.now() };
  }
}

export function formatCurrency(val, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatNumber(val) {
  return new Intl.NumberFormat("en-US").format(val);
}
