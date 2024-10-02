import { getCoinsListCount } from '@/lib/services/coingecko/api';

export async function GET() {
  const res = await getCoinsListCount();

  return Response.json({ count: res });
}
