import { getAllCoins, getCoinsMarketData } from '@/features/coins/api/requests';

import { columns } from '@/features/coins/lib/columns';
import { DataTable } from '@/features/coins/components/data-table/data-table';
import { PageProps } from '@/types';
import { getCoinsWithMarketDataParams } from '@/features/coins/api/schemas';
import NotFound from '@/components/not-found';
import { TableCell, TableRow } from '@/components/ui/table';

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = getCoinsWithMarketDataParams.parse({
    page: searchParams.page,
    perPage: searchParams.per_page,
  });
  const coins = await getCoinsMarketData(params);
  const allCoins = await getAllCoins();

  if (coins.status === 'error' && allCoins.status === 'error') {
    // TODO: Better error page
    return (
      <div>
        <h1>Oops something went wrong!</h1>
      </div>
    );
  }

  if (coins.status === 'success' && !coins.data.length) {
    return <NotFound />;
  }

  const getRowCount = () => {
    if (allCoins.status === 'error') {
      return coins.status === 'success' ? coins.data.length : 0;
    }

    return allCoins.data.length;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Cryptocurrency Prices by Market Cap
      </h1>

      <DataTable
        // @ts-expect-error https://github.com/TanStack/table/issues/4302#issuecomment-1883209783
        columns={columns}
        data={coins.status === 'success' ? coins.data : []}
        rowCount={getRowCount()}
        rowsPerPage={params.perPage}
        currentPage={params.page}
        tableBody={
          coins.status === 'success' ? null : (
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
