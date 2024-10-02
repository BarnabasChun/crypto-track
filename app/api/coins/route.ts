import type { NextRequest } from 'next/server';

import { getCoinsMarketData } from '@/lib/services/coingecko/api';
import { getCoinsWithMarketDataParams } from '@/lib/services/coingecko/schemas';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const params = getCoinsWithMarketDataParams.parse({
    currency: searchParams.get('currency'),
    page: searchParams.get('page'),
    perPage: searchParams.get('perPage'),
  });

  const response = await getCoinsMarketData(params);

  return Response.json({ results: response });
}
