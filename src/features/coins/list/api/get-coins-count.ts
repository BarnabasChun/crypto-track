import { unstable_cacheLife as cacheLife } from 'next/cache';
import { request } from '@/features/coins/utils/request';
import { z } from 'zod';

const coinsListCount = z.array(z.object({})).transform((val) => val.length);

export async function getCoinsCount() {
  'use cache';
  cacheLife('hours');

  return request('/coins/list', coinsListCount);
}
