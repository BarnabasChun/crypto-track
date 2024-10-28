import {
  getCoinsMarketData,
  getCoinsWithMarketDataParams,
} from '@/features/coins/list/api/get-coins-market-data';
import { getCoinsCount } from '@/features/coins/list/api/get-coins-count';
import { columns } from '@/features/coins/list/lib/columns';
import { DataTable } from '@/features/coins/list/components/data-table';
import { PageProps } from '@/types';
import NotFound from '@/app/not-found';
import { TableCell, TableRow } from '@/components/ui/table';

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = getCoinsWithMarketDataParams.parse({
    page: searchParams.page,
    perPage: searchParams.per_page,
  });
  const [, coins] = await getCoinsMarketData(params);
  const [, coinsCount] = await getCoinsCount();

  if (coins && !coins.length) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">
        Cryptocurrency Prices by Market Cap
      </h1>

      <DataTable
        columns={columns}
        data={coins ?? []}
        rowCount={coinsCount ?? coins?.length ?? 0}
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
