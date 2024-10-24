import { getAllCoins, getCoinsMarketData } from '@/features/coins/api/requests';

import { columns } from '@/features/coins/lib/columns';
import { DataTable } from '@/features/coins/components/data-table/data-table';
import { PageProps } from '@/types';
import { getCoinsWithMarketDataParams } from '@/features/coins/api/schemas';
import NotFound from '@/app/not-found';
import { TableCell, TableRow } from '@/components/ui/table';

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = getCoinsWithMarketDataParams.parse({
    page: searchParams.page,
    perPage: searchParams.per_page,
  });
  const [, coins] = await getCoinsMarketData(params);
  const [, allCoins] = await getAllCoins();

  if (coins && !coins.length) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">
        Cryptocurrency Prices by Market Cap
      </h1>

      <DataTable
        // @ts-expect-error https://github.com/TanStack/table/issues/4302#issuecomment-1883209783   // @ts-expect-error https://github.com/TanStack/table/issues/4302#issuecomment-1883209783
        columns={columns}
        data={coins ?? []}
        rowCount={allCoins?.length ?? coins?.length ?? 0}
        rowsPerPage={params.perPage}
        currentPage={params.page}
        tableBody={
          coins ? null : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Failed to load coin listings. Please try again later.
              </TableCell>
            </TableRow>
          )
        }
      />
    </div>
  );
}
