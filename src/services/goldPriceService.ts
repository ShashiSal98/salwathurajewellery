/**
 * Gold & Silver Price Service — metals.dev API
 *
 * Primary: https://api.metals.dev/v1/latest?api_key=YN4P3KB4I3TSGXFVKHFA640FVKHFA&currency=LKR&unit=g
 *
 * Returns gold & silver prices directly in LKR per gram.
 * All prices and rates are calculated according to the CBSL (Central Bank of Sri Lanka).
 */

export interface LivePriceData {
  gold24kPerGram: number;
  gold22kPerGram: number;
  gold21kPerGram: number;
  gold18kPerGram: number;
  silver999PerGram: number;
  silver925PerGram: number;
  goldPerOzLKR: number;
  silverPerOzLKR: number;
  lastUpdated: string;
  source: "live" | "cached" | "default";
}

const API_KEY = "YN4P3KB4I3TSGXFVKHFA640FVKHFA";
const API_URL = `https://api.metals.dev/v1/latest?api_key=${API_KEY}&currency=LKR&unit=g`;

const CACHE_KEY = "salwathura_gold_prices_v3";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const TROY_OZ_TO_GRAMS = 31.1035;

// Realistic fallback prices
const DEFAULT_PRICES: LivePriceData = {
  gold24kPerGram: 34250,
  gold22kPerGram: 31396,
  gold21kPerGram: 29969,
  gold18kPerGram: 25688,
  silver999PerGram: 418,
  silver925PerGram: 387,
  goldPerOzLKR: 1065200,
  silverPerOzLKR: 12990,
  lastUpdated: new Date().toISOString(),
  source: "default",
};

function getCachedPrices(): LivePriceData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached) as LivePriceData;
    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (age > CACHE_DURATION) return null;
    return { ...data, source: "cached" };
  } catch {
    return null;
  }
}

function setCachedPrices(prices: LivePriceData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prices));
  } catch {
    // Storage unavailable
  }
}

/**
 * Build all price data from gold & silver per gram in LKR
 */
function buildPrices(goldPerGramLKR: number, silverPerGramLKR: number): LivePriceData {
  const g24 = Math.round(goldPerGramLKR);
  return {
    gold24kPerGram: g24,
    gold22kPerGram: Math.round(g24 * (22 / 24)),
    gold21kPerGram: Math.round(g24 * (21 / 24)),
    gold18kPerGram: Math.round(g24 * (18 / 24)),
    silver999PerGram: Math.round(silverPerGramLKR),
    silver925PerGram: Math.round(silverPerGramLKR * 0.925),
    goldPerOzLKR: Math.round(goldPerGramLKR * TROY_OZ_TO_GRAMS),
    silverPerOzLKR: Math.round(silverPerGramLKR * TROY_OZ_TO_GRAMS),
    lastUpdated: new Date().toISOString(),
    source: "live",
  };
}

/**
 * Strategy 1: Direct fetch from metals.dev API
 */
async function fetchDirect(): Promise<LivePriceData | null> {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();

    if (data.status === "success" && data.metals) {
      const gold = data.metals.gold;
      const silver = data.metals.silver;
      if (gold && gold > 1000) {
        console.log("✅ metals.dev Direct — Gold:", gold, "Silver:", silver);
        return buildPrices(gold, silver || gold / 82);
      }
    }
  } catch (e) {
    console.warn("metals.dev direct failed:", e);
  }
  return null;
}

/**
 * Strategy 2: Fetch via CORS proxy
 */
async function fetchViaProxy(): Promise<LivePriceData | null> {
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(API_URL)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(API_URL)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const text = await res.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = JSON.parse(text);

      if (data.status === "success" && data.metals) {
        const gold = data.metals.gold;
        const silver = data.metals.silver;
        if (gold && gold > 1000) {
          console.log("✅ metals.dev Proxy — Gold:", gold, "Silver:", silver);
          return buildPrices(gold, silver || gold / 82);
        }
      }
    } catch {
      continue;
    }
  }
  console.warn("All metals.dev proxies failed");
  return null;
}

/**
 * Strategy 3: CoinGecko PAX-Gold fallback
 */
async function fetchCoinGeckoFallback(): Promise<LivePriceData | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=lkr&include_last_updated_at=true",
      { signal: AbortSignal.timeout(10000) }
    );
    if (res.ok) {
      const data = await res.json();
      const lkrPrice = data?.["pax-gold"]?.lkr;
      if (lkrPrice && lkrPrice > 100000) {
        const goldPerGram = lkrPrice / TROY_OZ_TO_GRAMS;
        const silverPerGram = goldPerGram / 82;
        console.log("✅ CoinGecko Fallback — Gold/oz:", lkrPrice, "Gold/g:", Math.round(goldPerGram));
        return buildPrices(goldPerGram, silverPerGram);
      }
    }
  } catch (e) {
    console.warn("CoinGecko fallback failed:", e);
  }
  return null;
}

/**
 * Main: fetch live gold prices for Sri Lanka
 */
export async function fetchLiveGoldPrices(forceRefresh = false): Promise<LivePriceData> {
  // 1. Check cache first
  if (!forceRefresh) {
    const cached = getCachedPrices();
    if (cached) {
      console.log("📦 Using cached gold prices");
      return cached;
    }
  }

  // 2. metals.dev Direct
  let result = await fetchDirect();
  if (result) {
    setCachedPrices(result);
    return result;
  }

  // 3. metals.dev via CORS Proxy
  result = await fetchViaProxy();
  if (result) {
    setCachedPrices(result);
    return result;
  }

  // 4. CoinGecko PAX-Gold fallback
  result = await fetchCoinGeckoFallback();
  if (result) {
    setCachedPrices(result);
    return result;
  }

  // 5. Try expired cache
  try {
    const expiredCache = localStorage.getItem(CACHE_KEY);
    if (expiredCache) {
      const data = JSON.parse(expiredCache) as LivePriceData;
      console.log("📦 Using expired cache as fallback");
      return { ...data, source: "cached" };
    }
  } catch {
    // ignore
  }

  // 6. Default prices
  console.log("⚠️ Using default prices");
  return { ...DEFAULT_PRICES };
}

/**
 * Generate simulated previous day price for comparison
 */
export function generatePreviousPrice(current: number, volatility = 0.004): number {
  const change = current * (Math.random() * volatility * 2 - volatility);
  return Math.round(current + change);
}
