import { env } from '@/lib/env';
import { coinsList } from './schemas';
import { ResponseStatus } from '@/lib/types';

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

  const data = await res.json();

  return {
    ...data,
    response_status: data.error ? ResponseStatus.error : ResponseStatus.success,
  };
}

export async function getAllCoins() {
  const response = await request('/coins/list');

  return coinsList.parse(response);
}
