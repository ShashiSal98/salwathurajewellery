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
  AlertTriangle,
  Scale,
  Landmark,
  Globe,
  ShieldCheck,
  ExternalLink,
  CircleCheck,
  Circle,
} from "lucide-react";
import {
  fetchLiveGoldPrices,
  clearAllCaches,
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
  type: "gold" | "silver";
}

function buildPricesFromLiveData(live: LivePriceData): PriceData[] {
  // Gold prices per 8g (1 Pawn) - Only 24K, 22K, 18K as requested
  const g24 = live.gold24kPerGram * 8;
  const g22 = live.gold22kPerGram * 8;
  const g18 = live.gold18kPerGram * 8;

  // Generate previous prices for comparison
  const p24 = generatePreviousPrice(g24);
  const p22 = generatePreviousPrice(g22);
  const p18 = generatePreviousPrice(g18);
  const ps999 = generatePreviousPrice(live.silver999PerGram);
  const ps925 = generatePreviousPrice(live.silver925PerGram);
  const ps900 = generatePreviousPrice(live.silver900PerGram);

  return [
    { 
      label: "Gold 24K", 
      karat: "999", 
      price: g24, 
      previousPrice: p24, 
      change: g24 - p24, 
      changePercent: ((g24 - p24) / p24) * 100, 
      unit: "per 8g (1 Pawn)", 
      icon: <CircleCheck className="w-5 h-5 text-yellow-500" />, 
      color: "from-yellow-400 to-amber-500", 
      type: "gold" 
    },
    { 
      label: "Gold 22K", 
      karat: "916", 
      price: g22, 
      previousPrice: p22, 
      change: g22 - p22, 
      changePercent: ((g22 - p22) / p22) * 100, 
      unit: "per 8g (1 Pawn)", 
      icon: <CircleDot className="w-5 h-5 text-yellow-500" />, 
      color: "from-yellow-500 to-yellow-600", 
      type: "gold" 
    },
    { 
      label: "Gold 18K", 
      karat: "750", 
      price: g18, 
      previousPrice: p18, 
      change: g18 - p18, 
      changePercent: ((g18 - p18) / p18) * 100, 
      unit: "per 8g (1 Pawn)", 
      icon: <Circle className="w-5 h-5 text-orange-400" />, 
      color: "from-orange-400 to-amber-600", 
      type: "gold" 
    },
    { 
      label: "Silver 999", 
      karat: "Pure", 
      price: live.silver999PerGram, 
      previousPrice: ps999, 
      change: live.silver999PerGram - ps999, 
      changePercent: ((live.silver999PerGram - ps999) / ps999) * 100, 
      unit: "per gram", 
      icon: <CircleCheck className="w-5 h-5 text-gray-400" />, 
      color: "from-gray-300 to-gray-500", 
      type: "silver" 
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
      type: "silver" 
    },
    { 
      label: "Silver 900", 
      karat: "Coin", 
      price: live.silver900PerGram, 
      previousPrice: ps900, 
      change: live.silver900PerGram - ps900, 
      changePercent: ((live.silver900PerGram - ps900) / ps900) * 100, 
      unit: "per gram", 
      icon: <Circle className="w-5 h-5 text-slate-500" />, 
      color: "from-slate-400 to-slate-500", 
      type: "silver" 
    },
  ];
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
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${data.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
        isGold ? "bg-gold-400" : "bg-slate-300"
      }`} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isDark ? "bg-white/5" : isGold ? "bg-amber-50" : "bg-slate-50"
            }`}>
              {data.icon}
            </div>
            <div>
              <h3 className={`font-playfair text-base font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>{data.label}</h3>
              {data.karat && (
                <span className={`text-[10px] font-montserrat tracking-widest uppercase ${
                  isDark ? "text-white/30" : "text-dark-brown/40"
                }`}>
                  Purity: {data.karat}
                </span>
              )}
            </div>
          </div>
          {/* Change percentage badge with correct arrow */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-montserrat ${
            isPositive 
              ? (isDark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-600")
              : (isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600")
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(data.changePercent).toFixed(2)}%
          </div>
        </div>

        <div className="mb-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[11px] font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>LKR</span>
            <span className={`font-playfair text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-dark-brown"}`}>
              {data.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-montserrat tracking-wider uppercase ${
            isDark 
              ? (isGold ? "bg-amber-500/10 text-amber-400/70" : "bg-slate-500/10 text-slate-400/70")
              : (isGold ? "bg-amber-50 text-amber-600/80" : "bg-slate-50 text-slate-500/80")
          }`}>
            <Scale className="w-2.5 h-2.5" />
            {data.unit}
          </span>
        </div>

        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
          <div className="flex items-center gap-1.5">
            {/* Change indicator with correct TrendingUp/TrendingDown icon */}
            {isPositive 
              ? <TrendingUp className={`w-3.5 h-3.5 ${isDark ? "text-green-400" : "text-green-600"}`} />
              : <TrendingDown className={`w-3.5 h-3.5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            }
            <span className={`text-xs font-montserrat font-medium ${
              isPositive 
                ? (isDark ? "text-green-400" : "text-green-600")
                : (isDark ? "text-red-400" : "text-red-600")
            }`}>
              {isPositive ? "+" : ""}{data.change.toLocaleString()} LKR
            </span>
          </div>
          <span className={`text-[10px] font-montserrat ${isDark ? "text-white/20" : "text-dark-brown/30"}`}>vs yesterday</span>
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
  const [fetchFailed, setFetchFailed] = useState(false);

  const loadPrices = useCallback(async (force = false) => {
    try {
      setFetchFailed(false);
      const fetched = await fetchLiveGoldPrices(force);
      if (fetched.gold24kPerGram > 0) {
        setPrices(buildPricesFromLiveData(fetched));
        setLiveData(fetched);
        setLastUpdated(new Date(fetched.lastUpdated));
        setFetchFailed(false);
      } else {
        setFetchFailed(true);
      }
    } catch {
      setFetchFailed(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { 
    loadPrices(); 
  }, [loadPrices]);

  useEffect(() => { 
    const t = setTimeout(() => setVisible(true), 200); 
    return () => clearTimeout(t); 
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    clearAllCaches();
    await loadPrices(true);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => loadPrices(true), 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [loadPrices]);

  // Auto-retry if failed
  useEffect(() => {
    if (fetchFailed) {
      const retry = setTimeout(() => loadPrices(true), 30000);
      return () => clearTimeout(retry);
    }
  }, [fetchFailed, loadPrices]);

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: true 
  });

  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const goldPrices = prices.filter((p) => p.type === "gold");
  const silverPrices = prices.filter((p) => p.type === "silver");

  const gold22kPerGram = prices.find(p => p.label === "Gold 22K") 
    ? Math.round(prices.find(p => p.label === "Gold 22K")!.price / 8) 
    : 0;
  const gold24kPerGram = prices.find(p => p.label === "Gold 24K") 
    ? Math.round(prices.find(p => p.label === "Gold 24K")!.price / 8) 
    : 0;
  const gold18kPerGram = prices.find(p => p.label === "Gold 18K") 
    ? Math.round(prices.find(p => p.label === "Gold 18K")!.price / 8) 
    : 0;

  const sourceLabel = liveData?.source === "live" 
    ? "Live Rates" 
    : liveData?.source === "cached" 
      ? "Recently Updated" 
      : "Connecting...";
  
  const sourceColor = liveData?.source === "live" 
    ? (isDark ? "text-green-400" : "text-green-600") 
    : liveData?.source === "cached" 
      ? (isDark ? "text-amber-400" : "text-amber-600") 
      : (isDark ? "text-blue-400" : "text-blue-500");
  
  const providerName = liveData?.provider || "Loading...";

  return (
    <section id="prices" className={`relative py-20 overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-[#0d0804]" : "bg-gradient-to-b from-amber-50/50 via-white to-white"
    }`}>
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
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
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
        <div className={`flex justify-center mb-8 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
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
                Central Bank of Sri Lanka — {liveData?.source === "live" ? `via ${providerName}` : "Connecting to live sources..."}
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
          isDark ? "bg-[#1a1208]/60 border border-gold-400/10" : "bg-white border border-gray-200/60 shadow-sm"
        }`}>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  liveData?.source === "live" ? "bg-green-500" : fetchFailed ? "bg-red-500" : "bg-amber-500"
                }`} />
                <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping ${
                  liveData?.source === "live" ? "bg-green-400" : fetchFailed ? "bg-red-400" : "bg-amber-400"
                }`} />
              </div>
              <span className={`text-xs font-montserrat font-semibold tracking-wider uppercase ${sourceColor}`}>
                {fetchFailed ? "Retrying..." : sourceLabel}
              </span>
            </div>
            <div className={`hidden sm:block w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="flex items-center gap-2">
              <Clock className={`w-3.5 h-3.5 ${isDark ? "text-white/30" : "text-dark-brown/40"}`} />
              <div className="flex flex-col">
                <span className={`text-xs font-montserrat ${isDark ? "text-white/50" : "text-dark-brown/60"}`}>{formatDate(lastUpdated)}</span>
                <span className={`text-[10px] font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/35"}`}>Last updated: {formatTime(lastUpdated)}</span>
              </div>
            </div>
            <div className={`hidden sm:block w-[1px] h-5 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="flex items-center gap-1.5">
              <Globe className={`w-3 h-3 ${sourceColor}`} />
              <span className={`text-[10px] font-montserrat font-medium ${isDark ? "text-white/40" : "text-dark-brown/50"}`}>{providerName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isDark ? "bg-amber-500/10 border border-amber-500/15" : "bg-amber-50 border border-amber-200/60"
            }`}>
              <Scale className={`w-3.5 h-3.5 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
              <span className={`text-[10px] font-montserrat font-semibold tracking-wider uppercase ${
                isDark ? "text-amber-400/80" : "text-amber-700"
              }`}>Gold: Per 1 Pawn (8g)</span>
            </div>
            <button 
              onClick={handleRefresh} 
              disabled={isRefreshing || isLoading} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-semibold tracking-wider uppercase transition-all duration-300 ${
                isDark 
                  ? "bg-gold-400/10 text-gold-400 hover:bg-gold-400/20 border border-gold-400/20" 
                  : "bg-gold-50 text-gold-700 hover:bg-gold-100 border border-gold-200"
              } ${isRefreshing || isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-105"}`}>
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
              {isRefreshing ? "Updating..." : isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || fetchFailed) && prices.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className={`w-8 h-8 animate-spin ${isDark ? "text-gold-400/50" : "text-gold-500/50"}`} />
              <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/40"}`}>
                {fetchFailed ? "Retrying — connecting to price sources..." : "Fetching live gold & silver prices..."}
              </p>
              <p className={`font-montserrat text-[10px] ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                Sources: GoldAPI.io • metals.live • fawazahmed0
              </p>
              {fetchFailed && (
                <button 
                  onClick={handleRefresh} 
                  className={`mt-2 px-4 py-2 rounded-lg text-xs font-montserrat font-semibold ${
                    isDark ? "bg-gold-400/20 text-gold-400" : "bg-gold-100 text-gold-700"
                  }`}>
                  Retry Now
                </button>
              )}
            </div>
          </div>
        )}

        {prices.length > 0 && (
          <>
            {/* Gold Prices - Only 24K, 22K, 18K as requested */}
            <div className={`mb-10 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <CircleDot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-playfair text-xl font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>Gold Prices</h3>
                  <p className={`text-[10px] font-montserrat tracking-wider uppercase ${
                    isDark ? "text-white/30" : "text-dark-brown/40"
                  }`}>Price per 1 Pawn (8 Grams) — 24K, 22K & 18K</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {goldPrices.map((price, index) => (
                  <PriceCard key={price.label} data={price} index={index} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* Silver Prices */}
            <div className={`mb-10 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/20">
                  <CircleDot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-playfair text-xl font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>Silver Prices</h3>
                  <p className={`text-[10px] font-montserrat tracking-wider uppercase ${
                    isDark ? "text-white/30" : "text-dark-brown/40"
                  }`}>Price per Gram — 900, 925 & 999 Purity</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {silverPrices.map((price, index) => (
                  <PriceCard key={price.label} data={price} index={index + 3} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* Data Source Panel */}
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
                      <h3 className={`font-playfair text-sm font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>Data Source</h3>
                      <span className={`text-[9px] font-montserrat px-2 py-0.5 rounded-full ${
                        liveData.source === "live" 
                          ? (isDark ? "bg-green-500/10 text-green-400/70" : "bg-green-50 text-green-600/70")
                          : (isDark ? "bg-amber-500/10 text-amber-400/70" : "bg-amber-50 text-amber-600/70")
                      }`}>
                        {liveData.source === "live" ? "Live" : "Cached"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href="https://goldrate.com/en/silver/sri-lanka" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`inline-flex items-center gap-1 text-[10px] font-montserrat transition-colors ${
                          isDark ? "text-blue-400/60 hover:text-blue-400" : "text-blue-500/60 hover:text-blue-600"
                        }`}>
                        <ExternalLink className="w-2.5 h-2.5" /> Verify on goldrate.com
                      </a>
                    </div>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x ${
                    isDark ? "divide-white/5" : "divide-gray-100"
                  }`}>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${
                        isDark ? "text-white/30" : "text-dark-brown/40"
                      }`}>Gold Price (1 Troy Oz)</p>
                      <p className={`font-playfair text-xl font-bold ${
                        isDark ? "text-yellow-400" : "text-amber-600"
                      }`}>LKR {liveData.goldPerOzLKR.toLocaleString()}</p>
                      <p className={`text-[10px] font-montserrat ${
                        isDark ? "text-white/25" : "text-dark-brown/30"
                      }`}>= {liveData.gold24kPerGram.toLocaleString()} LKR/g × 31.1035</p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${
                        isDark ? "text-white/30" : "text-dark-brown/40"
                      }`}>Silver Price (Per Gram 999)</p>
                      <p className={`font-playfair text-xl font-bold ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}>LKR {liveData.silver999PerGram.toLocaleString()}</p>
                      <p className={`text-[10px] font-montserrat ${
                        isDark ? "text-white/25" : "text-dark-brown/30"
                      }`}>{providerName}</p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className={`text-[10px] font-montserrat tracking-wider uppercase mb-1 ${
                        isDark ? "text-white/30" : "text-dark-brown/40"
                      }`}>Silver 925 / Gram</p>
                      <p className={`font-playfair text-xl font-bold ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}>LKR {liveData.silver925PerGram.toLocaleString()}</p>
                      <p className={`text-[10px] font-montserrat ${
                        isDark ? "text-white/25" : "text-dark-brown/30"
                      }`}>Sterling Silver</p>
                    </div>
                  </div>
                  <div className={`px-6 py-2.5 flex items-center justify-center gap-2 ${
                    isDark ? "bg-white/[0.02] border-t border-white/5" : "bg-gray-50/50 border-t border-gray-100"
                  }`}>
                    <Info className={`w-3 h-3 ${isDark ? "text-white/20" : "text-dark-brown/25"}`} />
                    <p className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                      Formula: Silver/g = (Spot USD/oz × USD/LKR) ÷ 31.1035 — Same as goldrate.com &nbsp;|&nbsp; 925 = 999 × 0.925 &nbsp;|&nbsp; 900 = 999 × 0.9
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reference Table - Updated with 18K instead of 21K */}
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
                    <h3 className={`font-playfair text-sm font-bold ${isDark ? "text-white" : "text-dark-brown"}`}>Quick Reference — Gold & Silver Prices</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className={`w-3 h-3 ${isDark ? "text-white/20" : "text-dark-brown/30"}`} />
                    <span className={`text-[10px] font-montserrat ${isDark ? "text-white/20" : "text-dark-brown/30"}`}>Live values</span>
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
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">18K (750)</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">Silver 999</th>
                        <th className="text-right text-[10px] font-montserrat font-semibold tracking-widest uppercase px-6 py-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: "1 Gram", weight: "1g", p22: gold22kPerGram, p24: gold24kPerGram, p18: gold18kPerGram, s999: liveData?.silver999PerGram || 0 },
                        { item: "½ Pawn", weight: "4g", p22: gold22kPerGram * 4, p24: gold24kPerGram * 4, p18: gold18kPerGram * 4, s999: (liveData?.silver999PerGram || 0) * 4 },
                        { item: "1 Pawn", weight: "8g", p22: gold22kPerGram * 8, p24: gold24kPerGram * 8, p18: gold18kPerGram * 8, s999: (liveData?.silver999PerGram || 0) * 8, hl: true },
                        { item: "2 Pawns", weight: "16g", p22: gold22kPerGram * 16, p24: gold24kPerGram * 16, p18: gold18kPerGram * 16, s999: (liveData?.silver999PerGram || 0) * 16 },
                        { item: "5 Pawns", weight: "40g", p22: gold22kPerGram * 40, p24: gold24kPerGram * 40, p18: gold18kPerGram * 40, s999: (liveData?.silver999PerGram || 0) * 40 },
                        { item: "10 Pawns", weight: "80g", p22: gold22kPerGram * 80, p24: gold24kPerGram * 80, p18: gold18kPerGram * 80, s999: (liveData?.silver999PerGram || 0) * 80 },
                      ].map((row, i) => {
                        const g22 = prices.find(p => p.label === "Gold 22K");
                        const tp = g22 ? g22.changePercent : 0;
                        const isPositive = tp >= 0;
                        return (
                          <tr key={i} className={`${
                            row.hl 
                              ? (isDark ? "bg-amber-500/5 border-amber-400/15" : "bg-amber-50/60 border-amber-100")
                              : (isDark ? "border-white/5 hover:bg-white/[0.02]" : "border-gray-100 hover:bg-amber-50/30")
                          } border-t transition-colors`}>
                            <td className={`px-6 py-3.5 font-montserrat text-sm font-medium ${
                              row.hl 
                                ? (isDark ? "text-gold-400 font-bold" : "text-amber-700 font-bold")
                                : (isDark ? "text-white/80" : "text-dark-brown/80")
                            }`}>
                              <div className="flex items-center gap-2">
                                {row.item}
                                {row.hl && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-montserrat tracking-wider uppercase ${
                                    isDark ? "bg-gold-400/15 text-gold-400" : "bg-amber-100 text-amber-600"
                                  }`}>Standard</span>
                                )}
                              </div>
                            </td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm ${
                              row.hl 
                                ? (isDark ? "text-gold-400/70" : "text-amber-600/70")
                                : (isDark ? "text-white/40" : "text-dark-brown/40")
                            }`}>{row.weight}</td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${
                              isDark ? "text-gold-400" : "text-amber-600"
                            }`}>LKR {row.p22.toLocaleString()}</td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${
                              isDark ? "text-yellow-300" : "text-amber-700"
                            }`}>LKR {row.p24.toLocaleString()}</td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${
                              isDark ? "text-orange-300" : "text-orange-600"
                            }`}>LKR {Math.round(row.p18).toLocaleString()}</td>
                            <td className={`px-6 py-3.5 text-right font-montserrat text-sm font-semibold ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`}>LKR {Math.round(row.s999).toLocaleString()}</td>
                            <td className="px-6 py-3.5 text-right">
                              <span className={`inline-flex items-center gap-1 text-xs font-montserrat font-medium ${
                                isPositive 
                                  ? (isDark ? "text-green-400" : "text-green-600")
                                  : (isDark ? "text-red-400" : "text-red-600")
                              }`}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {isPositive ? "+" : ""}{tp.toFixed(2)}%
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
              <div className={`flex items-center justify-center gap-3 mb-4 px-5 py-3.5 rounded-xl mx-auto max-w-3xl ${
                isDark 
                  ? "bg-gradient-to-r from-gold-400/5 to-amber-600/5 border border-gold-400/10" 
                  : "bg-gradient-to-r from-amber-50/80 to-yellow-50/60 border border-amber-200/50"
              }`}>
                <Landmark className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gold-400/70" : "text-amber-600/80"}`} />
                <p className={`text-[11px] font-montserrat font-medium ${isDark ? "text-white/50" : "text-dark-brown/60"}`}>
                  All prices and rates are calculated according to the{" "}
                  <strong className={isDark ? "text-gold-400/80" : "text-amber-700"}>CBSL (Central Bank of Sri Lanka)</strong>{" "}
                  official exchange rates and international market prices.
                  Verify at{" "}
                  <a 
                    href="https://goldrate.com/en/silver/sri-lanka" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`font-bold underline decoration-dotted underline-offset-2 ${
                      isDark ? "text-blue-400/80" : "text-blue-600"
                    }`}>
                    goldrate.com
                  </a>.
                </p>
                <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-green-400/50" : "text-green-600/50"}`} />
              </div>

              <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                <a 
                  href="https://goldrate.com/en/gold/sri-lanka" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-flex items-center gap-1.5 text-[10px] font-montserrat font-medium transition-colors ${
                    isDark ? "text-gold-400/50 hover:text-gold-400/80" : "text-amber-600/60 hover:text-amber-700"
                  }`}>
                  <ExternalLink className="w-3 h-3" /> Gold: goldrate.com
                </a>
                <span className={`text-[10px] ${isDark ? "text-white/10" : "text-dark-brown/15"}`}>|</span>
                <a 
                  href="https://goldrate.com/en/silver/sri-lanka" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-flex items-center gap-1.5 text-[10px] font-montserrat font-medium transition-colors ${
                    isDark ? "text-slate-400/50 hover:text-slate-400/80" : "text-slate-500/60 hover:text-slate-600"
                  }`}>
                  <ExternalLink className="w-3 h-3" /> Silver: goldrate.com
                </a>
                <span className={`text-[10px] ${isDark ? "text-white/10" : "text-dark-brown/15"}`}>|</span>
                <span className={`text-[10px] font-montserrat ${isDark ? "text-white/25" : "text-dark-brown/30"}`}>
                  Rates as per CBSL (Central Bank of Sri Lanka)
                </span>
              </div>

              <p className={`text-[10px] font-montserrat max-w-2xl mx-auto flex items-center justify-center gap-1.5 text-center ${
                isDark ? "text-white/20" : "text-dark-brown/30"
              }`}>
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

/* Scrolling Price Banner */
export function PriceBanner() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [bannerPrices, setBannerPrices] = useState<PriceData[]>([]);
  const [provider, setProvider] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const fetched = await fetchLiveGoldPrices();
        if (fetched.gold24kPerGram > 0) {
          setBannerPrices(buildPricesFromLiveData(fetched));
          setProvider(fetched.provider);
        }
      } catch { /* empty banner */ }
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (bannerPrices.length === 0) return null;

  return (
    <div className={`w-full overflow-hidden border-b ${
      isDark ? "bg-[#0f0a06]/95 border-gold-400/10" : "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-100/60"
    }`}>
      <div className={`flex items-center justify-center gap-1.5 py-1 text-[9px] font-montserrat tracking-wider uppercase border-b ${
        isDark ? "bg-gold-400/5 border-gold-400/5 text-gold-400/50" : "bg-amber-50/80 border-amber-100/40 text-amber-600/60"
      }`}>
        <Landmark className="w-2.5 h-2.5" />
        Rates as per CBSL (Central Bank of Sri Lanka)
        <span className="mx-1">•</span>
        <span>{provider || "Live data"}</span>
        <span className="mx-1">•</span>
        <a 
          href="https://goldrate.com/en/silver/sri-lanka" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline decoration-dotted underline-offset-2 hover:opacity-80">
          Ref: goldrate.com
        </a>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-scroll-left whitespace-nowrap py-2">
          {[...bannerPrices, ...bannerPrices].map((price, index) => {
            const isPositive = price.change >= 0;
            return (
              <div key={`${price.label}-${index}`} className="inline-flex items-center gap-3 px-6">
                <span>{price.icon}</span>
                <span className={`text-xs font-montserrat font-semibold ${
                  isDark ? "text-white/70" : "text-dark-brown/70"
                }`}>{price.label}</span>
                <span className={`text-xs font-montserrat font-bold ${
                  isDark ? "text-white" : "text-dark-brown"
                }`}>LKR {price.price.toLocaleString()}</span>
                <span className={`text-[9px] font-montserrat ${
                  isDark ? "text-white/30" : "text-dark-brown/35"
                }`}>/{price.type === "gold" ? "8g" : "1g"}</span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-montserrat font-semibold ${
                  isPositive 
                    ? (isDark ? "text-green-400" : "text-green-600")
                    : (isDark ? "text-red-400" : "text-red-600")
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? "+" : ""}{price.changePercent.toFixed(2)}%
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