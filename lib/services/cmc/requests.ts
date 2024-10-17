import { env } from '@/lib/env';
import { cmcResponse, coinListingsResponse } from './schemas';
import { ResponseStatus } from '@/lib/types';
import { CoinListingsResponse, GetCoinsListingParams } from './types';

const BASE_URL = 'https://pro-api.coinmarketcap.com';

async function request(endpoint: string, options?: RequestInit) {
  const headers = {
    Accept: 'application/json',
    'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
    'Accept-Encoding': 'deflate, gzip',
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  const parsedResponse = cmcResponse.parse(data);

  return {
    ...parsedResponse,
    response_status:
      parsedResponse.status.error_code !== 0
        ? ResponseStatus.error
        : ResponseStatus.success,
  };
}

export async function getCoinsListing({
  currency,
  page,
  perPage,
}: GetCoinsListingParams): Promise<CoinListingsResponse> {
  const start = (page - 1) * perPage + 1;

  const response = await request(
    `/v1/cryptocurrency/listings/latest?start=${start}&limit=${perPage}&convert=${currency}`
  );

  return coinListingsResponse.parse(response);
}
