import { env } from '@/config/env';
import {
  coinsList,
  coinsWithMarketData,
  GetCoinsWithMarketDataParams,
  parseCoingeckoResponse,
} from './schemas';

const BASE_URL = 'https://api.coingecko.com/api/v3';

async function request(endpoint: string, options?: RequestInit) {
  const headers = {
    accept: 'application/json',
    'x-cg-demo-api-key': env.COINGECKO_API_KEY,
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res.json();
}

export async function getAllCoins() {
  const response = await request('/coins/list', {
    next: { revalidate: 60 * 60 * 1 },
  });

  return parseCoingeckoResponse(response, coinsList);
}

export async function getCoinsMarketData({
  currency,
  page,
  perPage,
}: GetCoinsWithMarketDataParams) {
  const response = await request(
    `/coins/markets?vs_currency=${currency}&page=${page}&per_page=${perPage}&price_change_percentage=1h,24h,7d`
  );

  return parseCoingeckoResponse(response, coinsWithMarketData);
}
