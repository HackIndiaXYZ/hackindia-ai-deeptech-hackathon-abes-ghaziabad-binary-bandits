import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  PORTFOLIO_HISTORY,
  ALLOCATION_DATA,
  MY_HOLDINGS,
  MOCK_ASSETS,
  formatCurrency,
} from "../data";

function PortfolioTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <div className="text-slate-400 text-xs mb-1">{label}</div>

      <div
        className="font-mono font-500"
        style={{ color: "#2ecc71" }}
      >
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  );
}

const RADIAN = Math.PI / 180;

function PieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) {
  const r =
    innerRadius + (outerRadius - innerRadius) * 0.5;

  const x =
    cx + r * Math.cos(-midAngle * RADIAN);

  const y =
    cy + r * Math.sin(-midAngle * RADIAN);

  return percent > 0.08 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 11,
        fontFamily: "JetBrains Mono",
        fontWeight: 500,
      }}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  ) : null;
}

export default function Portfolio() {
  const [yieldValue, setYieldValue] =
    useState(1842.3);

  const [claimed, setClaimed] = useState(false);

  const [chartKey, setChartKey] = useState(0);

  const canvasRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartKey((k) => k + 1);

      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setYieldValue((v) =>
        parseFloat((v + 0.0023).toFixed(4))
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || typeof window === "undefined")
      return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from(
      { length: 120 },
      () => ({
        x: Math.random() * canvas.width,
        y:
          Math.random() * canvas.height -
          canvas.height,
        r: Math.random() * 6 + 3,
        color: [
          "#2ecc71",
          "#0070f3",
          "#f59e0b",
          "#ec4899",
          "#a78bfa",
        ][Math.floor(Math.random() * 5)],
        tilt:
          Math.floor(Math.random() * 10) - 10,
        tiltAngleIncrement:
          Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 2,
      })
    );

    let frame;
    let alpha = 1;

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles.forEach((p) => {
        ctx.save();

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;

        ctx.moveTo(
          p.x + p.tilt + p.r / 4,
          p.y
        );

        ctx.lineTo(
          p.x + p.tilt,
          p.y + p.tilt + p.r / 4
        );

        ctx.stroke();
        ctx.restore();

        p.tiltAngle += p.tiltAngleIncrement;
        p.x += p.vx;
        p.y += p.vy;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      alpha -= 0.004;

      if (alpha > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    };

    draw();

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClaim = () => {
    setClaimed(true);

    launchConfetti();

    setTimeout(() => {
      setClaimed(false);
      setYieldValue(0);
    }, 3000);
  };

  const holdings = MY_HOLDINGS.map((h) => {
    const asset = MOCK_ASSETS.find(
      (a) => a.id === h.assetId
    );

    return {
      ...h,
      asset,
    };
  });

  const totalValue = holdings.reduce(
    (s, h) => s + h.currentValue,
    0
  );

  const totalInvested = holdings.reduce(
    (s, h) => s + h.invested,
    0
  );

  const totalReturn =
    totalValue - totalInvested;

  const returnPct = (
    (totalReturn / totalInvested) *
    100
  ).toFixed(2);

  return (
    <div className="p-4 md:p-6">
      <canvas
        ref={canvasRef}
        id="confetti-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      <div className="mb-6">
        <h1 className="font-display font-800 text-3xl text-white mb-1">
          My Portfolio
        </h1>

        <p className="text-slate-400 text-sm">
          Yield hub & asset holdings tracker
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Portfolio Value",
            value: formatCurrency(totalValue),
            sub: `+${returnPct}% total return`,
            accent: "neon",
          },
          {
            label: "Total Invested",
            value: formatCurrency(totalInvested),
            sub: "Across 3 assets",
            accent: "blue",
          },
          {
            label: "Total Yield Earned",
            value: formatCurrency(
              holdings.reduce(
                (s, h) => s + h.yield,
                0
              )
            ),
            sub: "All time",
            accent: "gold",
          },
          {
            label: "Active Positions",
            value: holdings.length.toString(),
            sub: "Assets held",
            accent: "neon",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-5"
          >
            <div className="text-xs text-slate-500 font-display font-600 uppercase tracking-wider mb-2">
              {s.label}
            </div>

            <div
              className={`font-display font-800 text-2xl mb-1 ${
                s.accent === "neon"
                  ? "text-neon"
                  : s.accent === "blue"
                  ? "text-blue-400"
                  : "text-yellow-400"
              }`}
            >
              {s.value}
            </div>

            <div className="text-xs text-slate-500">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Portfolio Growth */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-700 text-white">
              Portfolio Growth
            </h3>

            <span className="badge badge-neon">
              +51.8% YTD
            </span>
          </div>

          <div
            className="h-44"
            style={{ minHeight: 176 }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={PORTFOLIO_HISTORY}
                margin={{
                  top: 5,
                  right: 5,
                  bottom: 0,
                  left: -20,
                }}
              >
                <defs>
                  <linearGradient
                    id="portGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#2ecc71"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="95%"
                      stopColor="#2ecc71"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#475569",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#475569",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<PortfolioTooltip />}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2ecc71"
                  strokeWidth={2.5}
                  fill="url(#portGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display font-700 text-white mb-4">
            Asset Allocation
          </h3>

          <div
            className="h-44"
            style={{ minHeight: 176 }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={ALLOCATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  labelLine={false}
                  label={PieLabel}
                >
                  {ALLOCATION_DATA.map(
                    (entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={2}
                      />
                    )
                  )}
                </Pie>

                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        fontFamily: "DM Sans",
                      }}
                    >
                      {value}
                    </span>
                  )}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yield Section */}
      <div
        className="glass rounded-2xl p-6 mb-6"
        style={{
          border:
            "1px solid rgba(46,204,113,0.2)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-display font-600 uppercase tracking-wider mb-2">
              🟢 Live Yield Accrual
            </div>

            <div className="yield-counter">
              {formatCurrency(yieldValue, 4)}
            </div>

            <div className="text-xs text-slate-500 mt-1 font-mono">
              +$0.0023 / 300ms · Accruing in
              real-time
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className="btn-neon rounded-xl px-8 py-4 text-base font-display font-700 whitespace-nowrap"
          >
            {claimed
              ? "🎉 Claimed!"
              : "Claim Yield"}
          </button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-display font-700 text-white">
            My Holdings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {[
                  "Asset",
                  "Tokens",
                  "Invested",
                  "Current Value",
                  "Yield Earned",
                  "P&L",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-display font-600 text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {holdings.map((h, i) => {
                const pnl =
                  h.currentValue - h.invested;

                const pnlPct = (
                  (pnl / h.invested) *
                  100
                ).toFixed(1);

                return (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={h.asset?.image}
                          className="w-10 h-10 rounded-lg object-cover"
                          alt=""
                        />

                        <div>
                          <div className="font-display font-600 text-white text-sm">
                            {h.asset?.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            {h.asset?.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-white">
                      {h.tokens}
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-slate-300">
                      {formatCurrency(h.invested)}
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-white">
                      {formatCurrency(
                        h.currentValue
                      )}
                    </td>

                    <td className="px-5 py-4 font-mono text-sm text-yellow-400">
                      {formatCurrency(h.yield)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`font-mono text-sm font-600 ${
                          pnl >= 0
                            ? "text-neon"
                            : "text-red-400"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {formatCurrency(pnl)} (
                        {pnlPct}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}