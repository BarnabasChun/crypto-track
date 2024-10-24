import { env } from '@/config/env';
import {
  coinDetails,
  coinsList,
  coinsWithMarketData,
  getCoinsWithMarketDataParams,
} from './schemas';
import { z } from 'zod';

const BASE_URL = 'https://api.coingecko.com/api/v3';

class ErrorResponse extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

async function request<T extends z.ZodTypeAny>(
  endpoint: string,
  schema: T,
  options?: RequestInit
): Promise<[ErrorResponse, undefined] | [undefined, z.infer<T>]> {
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

  if (res.ok) {
    return [undefined, schema.parse(data)];
  }

  const coingeckoErrorResponse = z.object({ error: z.string() });

  const parsedCoingeckoError = coingeckoErrorResponse.safeParse(data);

  if (parsedCoingeckoError.success) {
    return [
      new ErrorResponse(parsedCoingeckoError.data.error, res.status),
      undefined,
    ];
  }

  return [new ErrorResponse('Unknown error', 500), undefined];
}

export async function getAllCoins() {
  return await request('/coins/list', coinsList, {
    next: { revalidate: 60 * 60 * 1 },
  });
}

export async function getCoinsMarketData({
  currency,
  page,
  perPage,
}: z.output<typeof getCoinsWithMarketDataParams>) {
  return await request(
    `/coins/markets?vs_currency=${currency}&page=${page}&per_page=${perPage}&price_change_percentage=1h,24h,7d`,
    coinsWithMarketData
  );
}

export async function getCoin(id: string) {
  const response = await request(`/coins/${id}`, coinDetails);

  return response;
}
