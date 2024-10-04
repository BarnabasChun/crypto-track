import {
  getCoinsListCount,
  getCoinsMarketData,
} from '@/lib/services/coingecko/requests';

import { columns } from './columns';
import { DataTable } from './data-table';

export default async function Home() {
  const coins = await getCoinsMarketData();
  const coinsListCount = await getCoinsListCount();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Cryptocurrency Prices by Market Cap
      </h1>

      {/* @ts-expect-error https://github.com/TanStack/table/issues/4302#issuecomment-1883209783 */}
      <DataTable columns={columns} data={coins} rowCount={coinsListCount} />
    </div>
  );
}
