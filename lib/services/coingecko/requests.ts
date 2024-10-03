import { env } from '@/lib/env';
import {
  coinsList,
  coinsWithMarketData,
  CoinWithMarketData,
  GetCoinsWithMarketDataParams,
  getCoinsWithMarketDataParams,
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

async function getAllCoins() {
  const response = await request('/coins/list');

  return coinsList.parse(response);
}

export async function getCoinsListCount() {
  const allCoins = await getAllCoins();

  return allCoins.length;
}

export async function getCoinsMarketData(
  params: GetCoinsWithMarketDataParams = {}
): Promise<CoinWithMarketData[]> {
  const { page, currency, perPage } = getCoinsWithMarketDataParams.parse({
    params,
  });

  const response = await request(
    `/coins/markets?vs_currency=${currency}&page=${page}&per_page=${perPage}&price_change_percentage=1h,24h,7d`
  );

  return coinsWithMarketData.parse(response);
}
