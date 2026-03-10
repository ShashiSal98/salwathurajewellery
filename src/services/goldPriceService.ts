/**
 * Gold & Silver Price Service
 * 
 * Fetches live international gold/silver spot prices using GoldAPI.io
 * Formula: Gold per gram (LKR) = (Gold USD/oz × USD/LKR) ÷ 31.1035
 */

export interface LivePriceData {
  gold24kPerGram: number;
  gold22kPerGram: number;
  gold21kPerGram: number;
  gold18kPerGram: number;
  silver999PerGram: number;
  silver925PerGram: number;
  silver900PerGram: number;
  goldPerOzLKR: number;
  silverPerOzLKR: number;
  lastUpdated: string;
  source: "live" | "cached" | "default";
  provider: string;
}

const CACHE_KEY = "salwathura_live_prices_v22";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (GoldAPI allows many requests)
const TROY_OZ_TO_GRAMS = 31.1035;

// GoldAPI.io credentials
const GOLD_API_TOKEN = "goldapi-1h8hsmmkdfdt6-io";
const GOLD_API_BASE = "https://www.goldapi.io/api";

// Exchange rate API (free, no key needed)
const EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest/USD";

// ===== Cache helpers =====

function getCached(): LivePriceData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as LivePriceData;
    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (age > CACHE_DURATION) return null;
    return { ...data, source: "cached" };
  } catch {
    return null;
  }
}

function setCache(prices: LivePriceData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(prices));
  } catch { /* ignore */ }
}

function getExpiredCache(): LivePriceData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return { ...JSON.parse(raw) as LivePriceData, source: "cached" };
  } catch {
    return null;
  }
}

// ===== Build price object =====

function buildFromGoldSilverPerGram(
  goldPerGram: number,
  silverPerGram: number,
  provider: string
): LivePriceData {
  const g24 = Math.round(goldPerGram);
  const s999 = Math.round(silverPerGram);
  
  return {
    gold24kPerGram: g24,
    gold22kPerGram: Math.round(g24 * 22 / 24),
    gold21kPerGram: Math.round(g24 * 21 / 24),
    gold18kPerGram: Math.round(g24 * 18 / 24),
    silver999PerGram: s999,
    silver925PerGram: Math.round(s999 * 0.925),
    silver900PerGram: Math.round(s999 * 0.9),
    goldPerOzLKR: Math.round(goldPerGram * TROY_OZ_TO_GRAMS),
    silverPerOzLKR: Math.round(silverPerGram * TROY_OZ_TO_GRAMS),
    lastUpdated: new Date().toISOString(),
    source: "live",
    provider,
  };
}

// ===== CORS proxy helpers =====

const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

async function fetchJSON(url: string, options?: RequestInit, timeout = 10000): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithProxies(url: string, options?: RequestInit): Promise<unknown> {
  // Try direct first
  try {
    return await fetchJSON(url, options);
  } catch { /* continue to proxies */ }
  
  // Try each proxy
  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy(url);
      return await fetchJSON(proxyUrl, options, 12000);
    } catch { /* continue to next proxy */ }
  }
  
  throw new Error(`All fetches failed for ${url}`);
}

// =====================================================
// PRIMARY STRATEGY: GoldAPI.io (with your API key)
// =====================================================

async function fetchFromGoldAPI(): Promise<LivePriceData | null> {
  try {
    // Fetch gold price in USD
    const goldOptions = {
      method: 'GET',
      headers: {
        'x-access-token': GOLD_API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    // Fetch silver price in USD
    const silverOptions = {
      method: 'GET',
      headers: {
        'x-access-token': GOLD_API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    // Fetch both gold and silver in parallel
    const [goldResponse, silverResponse, rateResponse] = await Promise.allSettled([
      fetchWithProxies(`${GOLD_API_BASE}/XAU/USD`, goldOptions),
      fetchWithProxies(`${GOLD_API_BASE}/XAG/USD`, silverOptions),
      fetchWithProxies(EXCHANGE_RATE_API)
    ]);

    // Get USD to LKR rate
    let usdToLkr = 320; // fallback rate
    if (rateResponse.status === 'fulfilled') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rateData = rateResponse.value as any;
      if (rateData?.rates?.LKR) {
        usdToLkr = rateData.rates.LKR;
      }
    }

    // Process gold data
    let goldUsdPerOz = 0;
    if (goldResponse.status === 'fulfilled') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const goldData = goldResponse.value as any;
      if (goldData?.price) {
        goldUsdPerOz = goldData.price;
        console.log(`✅ GoldAPI.io: Gold = $${goldUsdPerOz}/oz`);
      }
    }

    // Process silver data
    let silverUsdPerOz = 0;
    if (silverResponse.status === 'fulfilled') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const silverData = silverResponse.value as any;
      if (silverData?.price) {
        silverUsdPerOz = silverData.price;
        console.log(`✅ GoldAPI.io: Silver = $${silverUsdPerOz}/oz`);
      }
    }

    // If we have at least gold price, calculate everything
    if (goldUsdPerOz > 0) {
      // Calculate LKR per gram
      const goldPerGramLKR = (goldUsdPerOz * usdToLkr) / TROY_OZ_TO_GRAMS;
      
      // Calculate silver per gram (either from API or estimate)
      let silverPerGramLKR = goldPerGramLKR / 85; // fallback estimate
      if (silverUsdPerOz > 0) {
        silverPerGramLKR = (silverUsdPerOz * usdToLkr) / TROY_OZ_TO_GRAMS;
      }

      console.log(`📊 Calculated Rates:\n` +
        `   Gold: LKR ${Math.round(goldPerGramLKR)}/g (${Math.round(goldPerGramLKR * 8)}/8g)\n` +
        `   Silver: LKR ${Math.round(silverPerGramLKR)}/g\n` +
        `   USD/LKR: ${usdToLkr.toFixed(2)}`
      );

      return buildFromGoldSilverPerGram(
        goldPerGramLKR,
        silverPerGramLKR,
        `GoldAPI.io (1 USD = ${usdToLkr.toFixed(2)} LKR)`
      );
    }

    return null;
  } catch (e) {
    console.warn("Strategy 1 (GoldAPI.io) failed:", e);
    return null;
  }
}

// =====================================================
// STRATEGY 2: metals.live (free) + exchange rate API
// =====================================================

async function fetchFromMetalsLiveAndExchangeRate(): Promise<LivePriceData | null> {
  try {
    const [spotData, rateData] = await Promise.all([
      fetchWithProxies("https://api.metals.live/v1/spot"),
      fetchWithProxies(EXCHANGE_RATE_API),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spot: any = Array.isArray(spotData) ? spotData[0] : spotData;
    const goldUsdPerOz = spot?.gold;
    const silverUsdPerOz = spot?.silver;

    if (!goldUsdPerOz || goldUsdPerOz < 1000) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usdToLkr = (rateData as any)?.rates?.LKR;
    if (!usdToLkr || usdToLkr < 100) {
      return null;
    }

    const goldPerGramLKR = (goldUsdPerOz * usdToLkr) / TROY_OZ_TO_GRAMS;
    const silverPerGramLKR = silverUsdPerOz
      ? (silverUsdPerOz * usdToLkr) / TROY_OZ_TO_GRAMS
      : goldPerGramLKR / 85;

    return buildFromGoldSilverPerGram(
      goldPerGramLKR,
      silverPerGramLKR,
      `metals.live (1 USD = ${usdToLkr.toFixed(2)} LKR)`
    );
  } catch (e) {
    console.warn("Strategy 2 (metals.live) failed:", e);
    return null;
  }
}

// =====================================================
// STRATEGY 3: fawazahmed0 currency API (free, no key)
// =====================================================

async function fetchFromCurrencyAPI(): Promise<LivePriceData | null> {
  try {
    const data = await fetchWithProxies(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const xauRates = (data as any)?.xau;
    if (xauRates?.lkr) {
      const goldPerOzLKR = xauRates.lkr;
      if (goldPerOzLKR > 100000) {
        const goldPerGram = goldPerOzLKR / TROY_OZ_TO_GRAMS;

        let silverPerGram = goldPerGram / 85;
        try {
          const silverData = await fetchWithProxies(
            "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xag.json"
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const xagLkr = (silverData as any)?.xag?.lkr;
          if (xagLkr && xagLkr > 1000) {
            silverPerGram = xagLkr / TROY_OZ_TO_GRAMS;
          }
        } catch { /* use estimate */ }

        return buildFromGoldSilverPerGram(goldPerGram, silverPerGram, "fawazahmed0 currency API");
      }
    }
  } catch (e) {
    console.warn("Strategy 3 (fawazahmed0) failed:", e);
  }
  return null;
}

// =====================================================
// MAIN: Try all strategies in order
// =====================================================

export async function fetchLiveGoldPrices(forceRefresh = false): Promise<LivePriceData> {
  // Check cache (unless forced)
  if (!forceRefresh) {
    const cached = getCached();
    if (cached) {
      console.log("📦 Using cached prices from", cached.provider);
      return cached;
    }
  }

  // Try each strategy in order (prioritizing GoldAPI.io)
  const strategies = [
    fetchFromGoldAPI,
    fetchFromMetalsLiveAndExchangeRate,
    fetchFromCurrencyAPI,
  ];

  for (const strategy of strategies) {
    const result = await strategy();
    if (result && result.gold24kPerGram > 0) {
      setCache(result);
      return result;
    }
  }

  // Try expired cache as last resort
  const expired = getExpiredCache();
  if (expired) {
    console.log("📦 Using expired cache from", expired.provider);
    return expired;
  }

  // Return fallback with zeros - UI will show loading/retry state
  console.warn("⚠️ All price sources failed — no data available");
  return {
    gold24kPerGram: 0,
    gold22kPerGram: 0,
    gold21kPerGram: 0,
    gold18kPerGram: 0,
    silver999PerGram: 0,
    silver925PerGram: 0,
    silver900PerGram: 0,
    goldPerOzLKR: 0,
    silverPerOzLKR: 0,
    lastUpdated: new Date().toISOString(),
    source: "default",
    provider: "unavailable",
  };
}

/**
 * Clear all cached data (for refresh button)
 */
export function clearAllCaches(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Generate simulated previous day price for comparison display
 */
export function generatePreviousPrice(current: number, volatility = 0.004): number {
  const change = current * (Math.random() * volatility * 2 - volatility);
  return Math.round(current + change);
}