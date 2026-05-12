# Sliver 🌐 — RWA Fractional Tokenization Platform

A premium, enterprise-grade React dashboard for Real World Asset fractional tokenization.

## Tech Stack

- **React 18** — UI framework
- **Tailwind CSS 3** — styling
- **Recharts** — charts (area, pie)
- **Webpack 5** — bundler
- **Syne + DM Sans + JetBrains Mono** — typography

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Build for production
npm run build
```

## Features

| Module | Description |
|--------|-------------|
| **Marketplace** | Asset grid with filters, progress bars, buy buttons (KYC-gated) |
| **Asset Modal** | Slide-out panel with charts, map, legal docs button |
| **KYC Verification** | Drag-and-drop ID upload with laser scan animation |
| **Portfolio Hub** | Live yield counter, area/pie charts, holdings table, confetti claim |
| **Tokenize Asset** | 3-step no-code wizard to mint fractional NFTs |

## Backend API

The frontend connects to `http://localhost:8080/api` with automatic fallback to mock data.

### Endpoints Used

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/assets` | Fetch marketplace assets |
| POST | `/api/kyc/verify` | Submit KYC document |

### KYC Response Format

```json
{
  "status": "VERIFIED",
  "wallet": "0x...",
  "timestamp": 1700000000000
}
```

### Asset Response Format

```json
[
  {
    "id": 1,
    "name": "Manhattan Luxury Condo",
    "category": "Real Estate",
    "totalValue": 4200000,
    "fractionPrice": 100,
    "apy": 8.5,
    "funded": 75,
    ...
  }
]
```

## Project Structure

```
sliver-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Marketplace.jsx
│   │   ├── AssetModal.jsx
│   │   ├── KYCVerification.jsx
│   │   ├── Portfolio.jsx
│   │   └── TokenizeAsset.jsx
│   ├── App.jsx
│   ├── data.js          ← Mock data + API utilities
│   ├── index.js
│   └── styles.css
├── package.json
├── webpack.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Design System

| Token | Value |
|-------|-------|
| Neon Green | `#2ecc71` |
| Brand Blue | `#0070f3` |
| Deep Background | `#0a0f1a` |
| Card Background | `#111827` |
| Display Font | Syne |
| Body Font | DM Sans |
| Mono Font | JetBrains Mono |
