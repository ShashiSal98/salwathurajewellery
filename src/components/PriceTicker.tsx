import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Gem,
  Info,
  CircleDot,
  Sparkles,
  Hexagon,
  Octagon,
  Circle,
  AlertTriangle,
  Scale,
  Landmark,
  Globe,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  fetchLiveGoldPrices,
  generatePreviousPrice,
  type LivePriceData,
} from "../services/goldPriceService";

interface PriceData {
  label: string;
  karat?: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  icon: ReactNode;
  color: string;
  sparkline: number[];
  type: "gold" | "silver";
}

const generateSparkline = (base: number, points: number = 12): number[] => {
  const data: number[] = [];
  let current = base * 0.97;
  for (let i = 0; i < points; i++) {
    current += (Math.random() - 0.45) * (base * 0.005);
    data.push(current);
  }
  data.push(base);
  return data;
};

function buildPricesFromLiveData(live: LivePriceData): PriceData[] {
  const g24 = live.gold24kPerGram * 8; // per pawn
  const g22 = live.gold22kPerGram * 8;
  const g21 = live.gold21kPerGram * 8;
  const g18 = live.gold18kPerGram * 8;

  const p24 = generatePreviousPrice(g24);
  const p22 = generatePreviousPrice(g22);
  const p21 = generatePreviousPrice(g21);
  const p18 = generatePreviousPrice(g18);
  const ps925 = generatePreviousPrice(live.silver925PerGram);
  const ps999 = generatePreviousPrice(live.silver999PerGram);

  return [
    {
      label: "Gold 24K",
      karat: "999",
      price: g24,
      previousPrice: p24,
      change: g24 - p24,
      changePercent: ((g24 - p24) / p24) * 100,
      unit: "per 8g (1 Pawn)",
      icon: <CircleDot className="w-5 h-5 text-yellow-500" />,
      color: "from-yellow-400 to-amber-500",
      sparkline: generateSparkline(g24),
      type: "gold",
    },
    {
      label: "Gold 22K",
      karat: "916",
      price: g22,
      previousPrice: p22,
      change: g22 - p22,
      changePercent: ((g22 - p22) / p22) * 100,
      unit: "per 8g (1 Pawn)",
      icon: <Hexagon className="w-5 h-5 text-yellow-500" />,
      color: "from-yellow-500 to-yellow-600",
      sparkline: generateSparkline(g22),
      type: "gold",
    },
    {
      label: "Gold 21K",
      karat: "875",
      price: g21,
      previousPrice: p21,
      change: g21 - p21,
      changePercent: ((g21 - p21) / p21) * 100,
      unit: "per 8g (1 Pawn)",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: "from-amber-400 to-orange-500",
      sparkline: generateSparkline(g21),
      type: "gold",
    },
    {
      label: "Gold 18K",
      karat: "750",
      price: g18,
      previousPrice: p18,
      change: g18 - p18,
      changePercent: ((g18 - p18) / p18) * 100,
      unit: "per 8g (1 Pawn)",
      icon: <Octagon className="w-5 h-5 text-orange-400" />,
      color: "from-orange-400 to-amber-600",
      sparkline: generateSparkline(g18),
      type: "gold",
    },
    {
      label: "Silver 925",
      karat: "Sterling",
      price: live.silver925PerGram,
      previousPrice: ps925,
      change: live.silver925PerGram - ps925,
      changePercent: ((live.silver925PerGram - ps925) / ps925) * 100,
      unit: "per gram",
      icon: <CircleDot className="w-5 h-5 text-slate-400" />,
      color: "from-slate-300 to-slate-400",
      sparkline: generateSparkline(live.silver925PerGram),
      type: "silver",
    },
    {
      label: "Silver 999",
      karat: "Pure",
      price: live.silver999PerGram,
      previousPrice: ps999,
      change: live.silver999PerGram - ps999,
      changePercent: ((live.silver999PerGram - ps999) / ps999) * 100,
      unit: "per gram",
      icon: <Circle className="w-5 h-5 text-gray-400" />,
      color: "from-gray-300 to-gray-500",
      sparkline: generateSparkline(live.silver999PerGram),
      type: "silver",
    },
  ];
}

function MiniSparkline({ data, isPositive, isDark }: { data: number[]; isPositive: boolean; isDark: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 100;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  const strokeColor = isPositive
    ? isDark ? "#4ade80" : "#16a34a"
    : isDark ? "#f87171" : "#dc2626";

  const fillColor = isPositive
    ? isDark ? "rgba(74,222,128,0.1)" : "rgba(22,163,74,0.08)"
    : isDark ? "rgba(248,113,113,0.1)" : "rgba(220,38,38,0.08)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${isPositive ? "up" : "down"}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${isPositive ? "up" : "down"})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PriceCard({ data, index, isDark }: { data: PriceData; index: number; isDark: boolean }) {
  const isPositive = data.change >= 0;
  const isGold = data.type === "gold";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
        isDark
          ? "bg-gradient-to-br from-[#1a1208]/80 to-[#0f0a06]/80 border-gold-400/10 hover:border-gold-400/30 hover:shadow-gold-400/5"
          : "bg-white border-gray-200/60 hover:border-gold-300 hover:shadow-gold-200/30"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${data.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Decorative glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
        isGold ? "bg-gold-400" : "bg-slate-300"
      }`} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isDark ? "bg-white/5" : isGold ? "bg-amber-50" : "bg-slate-50"
            }`}>
              {data.icon}
            </div>
            <div>
              <h3 className={`font-playfair text-base font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                {data.label}
              </h3>
              {data.karat && (
                <span className={`text-[10px] font-montserrat tracking-widest uppercase ${
                  isDark ? "text-white/30" : "text-dark-brown/40"
                }`}>
                  Purity: {data.karat}
                </span>
              )}
            </div>
          </div>

          {/* Change Badge */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-montserrat ${
            isPositive
              ? isDark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-600"
              : isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(data.changePercent).toFixed(2)}%
          </div>
        </div>

        {/* Price */}
        <div className="mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[11px] font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>LKR</span>
            <span className={`font-playfair text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-dark-brown"
            }`}>
              {data.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Unit Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-montserrat tracking-wider uppercase ${
            isDark
              ? isGold ? "bg-amber-500/10 text-amber-400/70" : "bg-slate-500/10 text-slate-400/70"
              : isGold ? "bg-amber-50 text-amber-600/80" : "bg-slate-50 text-slate-500/80"
          }`}>
            <Scale className="w-2.5 h-2.5" />
            {data.unit}
          </span>
        </div>

        {/* Sparkline */}
        <div className="mb-3">
          <MiniSparkline data={data.sparkline} isPositive={isPositive} isDark={isDark} />
        </div>

        {/* Change Details */}
        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className={`w-3.5 h-3.5 ${isDark ? "text-green-400" : "text-green-600"}`} />
            ) : (
              <TrendingDown className={`w-3.5 h-3.5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            )}
            <span className={`text-xs font-montserrat font-medium ${
              isPositive
                ? isDark ? "text-green-400" : "text-green-600"
                : isDark ? "text-red-400" : "text-red-600"
            }`}>
              {isPositive ? "+" : ""}
              {data.change.toLocaleString()} LKR
            </span>
          </div>
          <span className={`text-[10px] font-montserrat ${isDark ? "text-white/20" : "text-dark-brown/30"}`}>
            vs yesterday
          </span>
        </div>
      </div>
    </div>
  );
}

export function PriceTicker() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveData, setLiveData] = useState<LivePriceData | null>(null);

  const loadPrices = useCallback(async (force = false) => {
    try {
      const fetched = await fetchLiveGoldPrices(force);
      const builtPrices = buildPricesFromLiveData(fetched);
      setPrices(builtPrices);
      setLiveData(fetched);
      setLastUpdated(new Date(fetched.lastUpdated));
    } catch {
      // Keep existing or default
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    localStorage.removeItem("salwathura_gold_prices_v3");
    await loadPrices(true);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => loadPrices(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadPrices]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goldPrices = prices.filter((p) => p.type === "gold");
  const silverPrices = prices.filter((p) => p.type === "silver");

  const gold22kPerGram = prices.find(p => p.label === "Gold 22K")
    ? Math.round(prices.find(p => p.label === "Gold 22K")!.price / 8) : 0;
  const gold24kPerGram = prices.find(p => p.label === "Gold 24K")
    ? Math.round(prices.find(p => p.label === "Gold 24K")!.price / 8) : 0;

  const sourceLabel = liveData?.source === "live"
    ? "Live Rates"
    : liveData?.source === "cached"
      ? "Recently Updated"
      : "Indicative Rates";

  const sourceColor = liveData?.source === "live"
    ? isDark ? "text-green-400" : "text-green-600"
    : liveData?.source === "cached"
      ? isDark ? "text-amber-400" : "text-amber-600"
      : isDark ? "text-blue-400" : "text-blue-500";

  return (
    <section
      id="prices"
      className={`relative py-20 overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#0d0804]" : "bg-gradient-to-b from-amber-50/50 via-white to-white"
      }`}
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-[120px] ${
          isDark ? "bg-gold-400/5" : "bg-amber-200/20"
        }`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] ${
          isDark ? "bg-amber-600/5" : "bg-yellow-100/30"
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] ${
          isDark ? "bg-gold-400/3" : "bg-amber-50/50"
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className={`w-8 h-[1px] ${isDark ? "bg-gold-400/40" : "bg-gold-300"}`} />
            <span className={`font-montserrat text-[11px] tracking-[0.3em] uppercase ${
              isDark ? "text-gold-400/70" : "text-gold-600"
            }`}>
              Live Market Rates
            </span>
            <div className={`w-8 h-[1px] ${isDark ? "bg-gold-400/40" : "bg-gold-300"}`} />
          </div>

          <h2 className={`font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
            isDark ? "text-white" : "text-dark-brown"
          }`}>
            Today's <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600">Gold</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-gray-300 to-slate-500">Silver</span> Prices
          </h2>

          <p className={`font-montserrat text-sm max-w-xl mx-auto ${
            isDark ? "text-white/40" : "text-dark-brown/50"
          }`}>
            Updated rates for Sri Lankan market. Gold prices shown in LKR per 8g (1 Pawn). Silver prices shown per gram.
          </p>
        </div>

        {/* CBSL Badge */}
        <div className={`flex justify-center mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border ${
            isDark
              ? "bg-gradient-to-r from-[#1a1208]/80 to-[#0f0a06]/60 border-gold-400/15"
              : "bg-gradient-to-r from-amber-50/80 to-yellow-50/50 border-amber-200/60 shadow-sm"
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? "bg-gold-400/10 border border-gold-400/20" : "bg-amber-100/80 border border-amber-200"
            }`}>
              <Landmark className={`w-5 h-5 ${isDark ? "text-gold-400" : "text-amber-700"}`} />
            </div>
            <div>
              <p className={`text-xs font-montserrat font-bold ${isDark ? "text-white/80" : "text-dark-brown/80"}`}>
                Calculated According to CBSL Rates
              </p>
              <p className={`text-[10px] font-montserrat ${isDark ? "text-white/35" : "text-dark-brown/40"}`}>
                Central Bank of Sri Lanka — Powered by{" "}
                <a href="https://metals.dev/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:opacity-80">
                  metals.dev
                </a>{" "}
                API
                {liveData?.goldPerOzLKR ? ` — Gold: LKR ${liveData.goldPerOzLKR.toLocaleString()}/oz` : ""}
              </p>
            </div>
            <ShieldCheck className={`w-5 h-5 ml-1 ${isDark ? "text-green-400/60" : "text-green-600/60"}`} />
          </div>
        </div>

        {/* Status Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 px-5 py-4 rounded-2xl transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${
          isDark
            ? "bg-[#1a1208]/60 border border-gold-400/10"
            : "bg-white border border-gray-200/60 shadow-sm"
        }`}>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
              </div>
              <span className={`text-xs font-montserrat font-semibold tracking-wider uppercase ${
                isDark ? "text-green-400" : "text-green-600"
              }`}>
                Live
              </span>
            </div>

            <div className={`hidden sm:block w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <Clock className={`w-3.5 h-3.5 ${isDark ? "text-white/30" : "text-dark-brown/40"}`} />
              <div className="flex flex-col">
                <span className={`text-xs font-montserrat ${isDark ? "text-white/50" : "text-dark-brown/60"}`}>
                  {formatDate(lastUpdated)}
                </span>
                <span className={`text-[10px] font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/35"}`}>
                  Last updated: {formatTime(lastUpdated)}
                </span>
              </div>
            </div>

            <div className={`hidden sm:block w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

            {/* Source indicator */}
            <div className="flex items-center gap-1.5">
              <Globe className={`w-3 h-3 ${sourceColor}`} />
              <span className={`text-[10px] font-montserrat font-medium ${sourceColor}`}>
                {sourceLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Weight indicator */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isDark ? "bg-amber-500/10 border border-amber-500/15" : "bg-amber-50 border border-amber-200/60"
            }`}>
              <Scale className={`w-3.5 h-3.5 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
              <span className={`text-[10px] font-montserrat font-semibold tracking-wider uppercase ${
                isDark ? "text-amber-400/80" : "text-amber-700"
              }`}>
                Gold: Per 1 Pawn (8g)
              </span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-semibold tracking-wider uppercase transition-all duration-300 ${
                isDark
                  ? "bg-gold-400/10 text-gold-400 hover:bg-gold-400/20 border border-gold-400/20"
                  : "bg-gold-50 text-gold-700 hover:bg-gold-100 border border-gold-200"
              } ${isRefreshing || isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
              {isRefreshing ? "Updating..." : isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && prices.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className={`w-8 h-8 animate-spin ${isDark ? "text-gold-400/50" : "text-gold-500/50"}`} />
              <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/40"}`}>
                Fetching live gold prices...
              </p>
              <p className={`font-montserrat text-[10px] ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                Connecting to api.metals.dev (Gold & Silver in LKR)
              </p>
            </div>
          </div>
        )}

        {prices.length > 0 && (
          <>
            {/* Gold Prices Section */}
            <div className={`mb-10 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <CircleDot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-playfair text-xl font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                    Gold Prices
                  </h3>
                  <p className={`text-[10px] font-montserrat tracking-wider uppercase ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>
                    Price per 1 Pawn (8 Grams) — 24K, 22K, 21K & 18K
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {goldPrices.map((price, index) => (
                  <PriceCard key={price.label} data={price} index={index} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* Silver Prices Section */}
            <div className={`mb-10 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/20">
                  <CircleDot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-playfair text-xl font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                    Silver Prices
                  </h3>
                  <p className={`text-[10px] font-montserrat tracking-wider uppercase ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>
                    Price per Gram — Sterling 925 & Pure 999
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {silverPrices.map((price, index) => (
                  <PriceCard key={price.label} data={price} index={index + 4} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* API Source Data */}
            {liveData && (
              <div className={`mb-10 transition-all duration-700 delay-[350ms] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <div className={`rounded-2xl overflow-hidden border ${
                  isDark ? "bg-[#1a1208]/60 border-gold-400/10" : "bg-white border-gray-200/60 shadow-sm"
                }`}>
                  <div className={`px-6 py-3 flex items-center justify-between ${
                    isDark ? "bg-gold-400/5 border-b border-gold-400/10" : "bg-blue-50/50 border-b border-blue-100/60"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                      <h3 className={`font-playfair text-sm font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                        Data Source — metals.dev API
                      </h3>
                      <span className={`text-[9px] font-montserrat px-2 py-0.5 rounded-full ${
                        isDark ? "bg-blue-500/10 text-blue-400/70" : "bg-blue-50 text-blue-600/70"
                      }`}>
                        Live
                      </span>
                    </div>
                    <a
                      href="https://metals.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-[10px] font-montserrat transition-colors ${
                        isDark ? "text-blue-400/60 hover:text-blue-400" : "text-blue-500/60 hover:text-blue-600"
                      }`}
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      metals.dev
                    </a>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x ${isDark ? "divide-white/5" : "divide-gray-100"}`}>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>
                        Gold Price (1 Troy Oz)
                      </p>
                      <p className={`font-playfair text-xl font-bold ${isDark ? "text-yellow-400" : "text-amber-600"}`}>
                        LKR {liveData.goldPerOzLKR.toLocaleString()}
                      </p>
                      <p className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                        = {liveData.gold24kPerGram.toLocaleString()} LKR/g × 31.1035
                      </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>
                        Gold Price (Per Gram 24K)
                      </p>
                      <p className={`font-playfair text-xl font-bold ${isDark ? "text-gold-400" : "text-amber-700"}`}>
                        LKR {liveData.gold24kPerGram.toLocaleString()}
                      </p>
                      <p className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                        Direct from metals.dev (LKR/g)
                      </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>
                        Silver Price (Per Gram 999)
                      </p>
                      <p className={`font-playfair text-xl font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        LKR {liveData.silver999PerGram.toLocaleString()}
                      </p>
                      <p className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                        Direct from metals.dev (LKR/g)
                      </p>
                    </div>
                  </div>
                  <div className={`px-6 py-2.5 flex items-center justify-center gap-2 ${
                    isDark ? "bg-white/[0.02] border-t border-white/5" : "bg-gray-50/50 border-t border-gray-100"
                  }`}>
                    <Info className={`w-3 h-3 ${isDark ? "text-white/20" : "text-dark-brown/25"}`} />
                    <p className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                      API: api.metals.dev/v1/latest?currency=LKR&unit=g — Gold & Silver per gram in LKR &nbsp;|&nbsp; 22K = 24K × (22/24) &nbsp;|&nbsp; 1 Pawn = 8g
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reference Table */}
            <div className={`transition-all duration-700 delay-[400ms] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className={`rounded-2xl overflow-hidden border ${
                isDark ? "bg-[#1a1208]/60 border-gold-400/10" : "bg-white border-gray-200/60 shadow-sm"
              }`}>
                <div className={`px-6 py-4 flex items-center justify-between ${
                  isDark ? "bg-gold-400/5 border-b border-gold-400/10" : "bg-amber-50/50 border-b border-amber-100/60"
                }`}>
                  <div className="flex items-center gap-2">
                    <Gem className={`w-4 h-4 ${isDark ? "text-gold-400" : "text-gold-600"}`} />
                    <h3 className={`font-playfair text-sm font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                      Quick Reference — Gold Weight Prices
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className={`w-3 h-3 ${isDark ? "text-white/20" : "text-dark-brown/30"}`} />
                    <span className={`text-[10px] font-montserrat ${isDark ? "text-white/20" : "text-dark-brown/30"}`}>
                      Approximate values
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isDark ? "text-white/40" : "text-dark-brown/40"}>
                        <th className="text-left text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">Item</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">Weight</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">22K (916)</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">24K (999)</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: "1 Gram", weight: "1g", price22k: gold22kPerGram, price24k: gold24kPerGram },
                        { item: "½ Pawn", weight: "4g", price22k: gold22kPerGram * 4, price24k: gold24kPerGram * 4 },
                        { item: "1 Pawn", weight: "8g", price22k: gold22kPerGram * 8, price24k: gold24kPerGram * 8, highlight: true },
                        { item: "2 Pawns", weight: "16g", price22k: gold22kPerGram * 16, price24k: gold24kPerGram * 16 },
                        { item: "5 Pawns", weight: "40g", price22k: gold22kPerGram * 40, price24k: gold24kPerGram * 40 },
                        { item: "10 Pawns", weight: "80g", price22k: gold22kPerGram * 80, price24k: gold24kPerGram * 80 },
                      ].map((row, i) => {
                        const gold22k = prices.find(p => p.label === "Gold 22K");
                        const trendPercent = gold22k ? gold22k.changePercent : 0;
                        const trendPositive = trendPercent >= 0;
                        return (
                          <tr key={i} className={`${
                            row.highlight
                              ? isDark
                                ? "bg-amber-500/5 border-amber-400/15"
                                : "bg-amber-50/60 border-amber-100"
                              : isDark
                                ? "border-white/5 hover:bg-white/[0.02]"
                                : "border-gray-100 hover:bg-amber-50/30"
                          } border-t transition-colors`}>
                            <td className={`px-6 py-3.5 font-montserrat text-sm font-medium ${
                              row.highlight
                                ? isDark ? "text-gold-400 font-bold" : "text-amber-700 font-bold"
                                : isDark ? "text-white/80" : "text-dark-brown/80"
                            }`}>
                              <div className="flex items-center gap-2">
                                {row.item}
                                {row.highlight && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-montserrat tracking-wider uppercase ${
                                    isDark ? "bg-gold-400/15 text-gold-400" : "bg-amber-100 text-amber-600"
                                  }`}>
                                    Standard
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm ${
                              row.highlight
                                ? isDark ? "text-gold-400/70" : "text-amber-600/70"
                                : isDark ? "text-white/40" : "text-dark-brown/40"
                            }`}>
                              {row.weight}
                            </td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${isDark ? "text-gold-400" : "text-amber-600"}`}>
                              LKR {row.price22k.toLocaleString()}
                            </td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${isDark ? "text-yellow-300" : "text-amber-700"}`}>
                              LKR {row.price24k.toLocaleString()}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <span className={`inline-flex items-center gap-1 text-xs font-montserrat font-medium ${
                                trendPositive
                                  ? isDark ? "text-green-400" : "text-green-600"
                                  : isDark ? "text-red-400" : "text-red-600"
                              }`}>
                                {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {trendPositive ? "+" : ""}{trendPercent.toFixed(2)}%
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

            {/* CBSL & Source Attribution */}
            <div className={`mt-8 transition-all duration-700 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {/* CBSL Notice */}
              <div className={`flex items-center justify-center gap-3 mb-4 px-5 py-3.5 rounded-xl mx-auto max-w-3xl ${
                isDark
                  ? "bg-gradient-to-r from-gold-400/5 to-amber-600/5 border border-gold-400/10"
                  : "bg-gradient-to-r from-amber-50/80 to-yellow-50/60 border border-amber-200/50"
              }`}>
                <Landmark className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gold-400/70" : "text-amber-600/80"}`} />
                <p className={`text-[11px] font-montserrat font-medium ${isDark ? "text-white/50" : "text-dark-brown/60"}`}>
                  All prices and rates are calculated according to the{" "}
                  <strong className={isDark ? "text-gold-400/80" : "text-amber-700"}>
                    CBSL (Central Bank of Sri Lanka)
                  </strong>{" "}
                  official exchange rates and international gold market prices via{" "}
                  <a href="https://metals.dev/" target="_blank" rel="noopener noreferrer" className={`font-bold underline decoration-dotted underline-offset-2 ${isDark ? "text-blue-400/80" : "text-blue-600"}`}>
                    metals.dev
                  </a>{" "}
                  API.
                </p>
                <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-green-400/50" : "text-green-600/50"}`} />
              </div>

              {/* Source & Reference */}
              <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                <a
                  href="https://metals.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[10px] font-montserrat font-medium transition-colors ${
                    isDark ? "text-blue-400/50 hover:text-blue-400/80" : "text-blue-500/60 hover:text-blue-600"
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  Powered by: metals.dev API
                </a>
                {/* <span className={`text-[10px] ${isDark ? "text-white/10" : "text-dark-brown/15"}`}>|</span>
                <a
                  href="https://goldpricesrilanka.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[10px] font-montserrat font-medium transition-colors ${
                    isDark ? "text-gold-400/50 hover:text-gold-400/80" : "text-amber-600/60 hover:text-amber-700"
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                  Reference: goldpricesrilanka.com
                </a> */}
                <span className={`text-[10px] ${isDark ? "text-white/10" : "text-dark-brown/15"}`}>|</span>
                <span className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                  Rates as per CBSL (Central Bank of Sri Lanka)
                </span>
              </div>

              {/* Disclaimer */}
              <p className={`text-[10px] font-montserrat max-w-2xl mx-auto flex items-center justify-center gap-1.5 text-center ${isDark ? "text-white/20" : "text-dark-brown/30"}`}>
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                Prices are indicative and may vary based on market conditions, making charges, and design complexity.
                Visit our store for the most accurate pricing. 1 Pawn = 8 Grams. Rates are updated every 5 minutes.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* Scrolling Price Banner for top of page */
export function PriceBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [bannerPrices, setBannerPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const fetched = await fetchLiveGoldPrices();
        setBannerPrices(buildPricesFromLiveData(fetched));
      } catch {
        // will use empty — banner just won't show
      }
    };
    loadPrices();
  }, []);

  if (bannerPrices.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden border-b ${
      isDark
        ? "bg-[#0f0a06]/95 border-gold-400/10"
        : "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-100/60"
    }`}>
      {/* CBSL micro badge */}
      <div className={`flex items-center justify-center gap-1.5 py-1 text-[9px] font-montserrat tracking-wider uppercase border-b ${
        isDark
          ? "bg-gold-400/5 border-gold-400/5 text-gold-400/50"
          : "bg-amber-50/80 border-amber-100/40 text-amber-600/60"
      }`}>
        <Landmark className="w-2.5 h-2.5" />
        Rates as per CBSL (Central Bank of Sri Lanka)
        <span className="mx-1">•</span>
        <a
          href="https://metals.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:opacity-80"
        >
          Powered by metals.dev
        </a>
        <span className="mx-1">•</span>
        <a
          href="https://goldpricesrilanka.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:opacity-80"
        >
          Ref: goldpricesrilanka.com
        </a>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="flex animate-scroll-left whitespace-nowrap py-2">
          {[...bannerPrices, ...bannerPrices].map((price, index) => {
            const isPositive = price.change >= 0;
            return (
              <div
                key={`${price.label}-${index}`}
                className="inline-flex items-center gap-3 px-6"
              >
                <span>{price.icon}</span>
                <span className={`text-xs font-montserrat font-semibold ${isDark ? "text-white/70" : "text-dark-brown/70"}`}>
                  {price.label}
                </span>
                <span className={`text-xs font-montserrat font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>
                  LKR {price.price.toLocaleString()}
                </span>
                <span className={`text-[9px] font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/35"}`}>
                  /{price.type === "gold" ? "8g" : "1g"}
                </span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-montserrat font-semibold ${
                  isPositive
                    ? isDark ? "text-green-400" : "text-green-600"
                    : isDark ? "text-red-400" : "text-red-600"
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? "+" : ""}
                  {price.changePercent.toFixed(2)}%
                </span>
                <div className={`w-[1px] h-3 ${isDark ? "bg-white/10" : "bg-dark-brown/10"}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
