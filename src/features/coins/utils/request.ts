import { env } from '@/config/env';
import { ErrorResponse } from '@/types';
import { z } from 'zod';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function request<T extends z.ZodTypeAny>(
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
      new ErrorResponse({
        message: parsedCoingeckoError.data.error,
        statusCode: res.status,
      }),
      undefined,
    ];
  }

  return [
    new ErrorResponse({
      message: 'Unknown error',
      statusCode: 500,
    }),
    undefined,
  ];
}
