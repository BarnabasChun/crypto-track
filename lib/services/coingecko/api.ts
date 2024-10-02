import { env } from '@/lib/env';
import {
  coinsList,
  coinsWithMarketData,
  GetCoinsWithMarketDataParams,
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

export async function getCoinsMarketData(params: GetCoinsWithMarketDataParams) {
  const { page, currency, perPage } = params;

  const response = await request(
    `/coins/markets?vs_currency=${currency}&page=${page}&per_page=${perPage}`
  );

  return coinsWithMarketData.parse(response);
}
