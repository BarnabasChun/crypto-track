import {
  getCoinsListCount,
  getCoinsMarketData,
} from '@/lib/services/coingecko/requests';

import { columns } from './columns';
import { DataTable } from './data-table';
import { PageProps } from '@/lib/types';
import { getCoinsWithMarketDataParams } from '@/lib/services/coingecko/schemas';
import NotFound from '@/components/not-found';

export default async function Home({ searchParams }: PageProps) {
  const params = getCoinsWithMarketDataParams.parse({
    page: searchParams.page,
    perPage: searchParams.per_page,
  });
  const coins = await getCoinsMarketData(params);
  const coinsListCount = await getCoinsListCount();

  if (!coins.length) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Cryptocurrency Prices by Market Cap
      </h1>

      <DataTable
        // @ts-expect-error https://github.com/TanStack/table/issues/4302#issuecomment-1883209783
        columns={columns}
        data={coins}
        rowCount={coinsListCount}
        rowsPerPage={params.perPage}
        currentPage={params.page}
      />
    </div>
  );
}
