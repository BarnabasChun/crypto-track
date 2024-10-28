import { unstable_cacheLife as cacheLife } from 'next/cache';
import { z } from 'zod';
import { request } from '../../utils/request';

const coinsListCount = z.array(z.object({})).transform((val) => val.length);

export async function getCoinsCount() {
  'use cache';
  cacheLife('hours');

  return request('/coins/list', coinsListCount);
}
