import { getCoinsMarketData } from '@/lib/services/coingecko/requests';

export default async function Page() {
  const coins = await getCoinsMarketData();

  console.log(coins);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
