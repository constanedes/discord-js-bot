import { getJson } from "./http.js";

export const POPULAR_COINS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    DOT: "polkadot",
    MATIC: "matic-network",
    LTC: "litecoin",
    AVAX: "avalanche-2",
    LINK: "chainlink",
    TRX: "tron",
    UNI: "uniswap",
    ATOM: "cosmos",
};

export const SUPPORTED_FIAT = new Set(["USD", "EUR", "GBP", "JPY", "ARS", "CLP", "MXN", "BRL", "CHF", "CAD", "AUD"]);

export type PriceQuote = Record<string, Record<string, number>>;

export type CoinInfo = {
    name: string;
    symbol: string;
    image?: { large?: string };
    market_data?: {
        current_price?: Record<string, number>;
        market_cap_rank?: number;
        market_cap?: Record<string, number>;
        price_change_percentage_24h?: number;
    };
};

/** Resolves a symbol (BTC) or id (bitcoin) to a CoinGecko id. */
export function resolveCoinId(symbol: string): string {
    return POPULAR_COINS[symbol.toUpperCase()] ?? symbol.toLowerCase();
}

export function fetchPrice(id: string, fiat: string): Promise<PriceQuote> {
    const query = `ids=${encodeURIComponent(id)}&vs_currencies=${fiat.toLowerCase()}&include_24hr_change=true`;
    return getJson<PriceQuote>(`https://api.coingecko.com/api/v3/simple/price?${query}`);
}

export function fetchCoin(id: string): Promise<CoinInfo> {
    return getJson<CoinInfo>(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}`);
}
