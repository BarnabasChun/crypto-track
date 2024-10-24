'use client';

import { Table } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMediaQuery } from 'usehooks-ts';
import { Pagination, PaginationContent } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination/use-pagination';
import { RowsPerPageSelector } from '@/features/coins/components/data-table/data-table-footer/rows-per-page-selector';
import { DataTablePaginationItem } from '@/features/coins/components/data-table/data-table-footer/data-table-pagination-item';
import { DEFAULT_PER_PAGE_OPTION } from '@/features/coins/constants';

interface DataTableFooterProps<TData> {
  table: Table<TData>;
  currentPage: number;
  rowsPerPage: number;
  resetSorting(): void;
}

export function DataTableFooter<TData>({
  table,
  currentPage,
  rowsPerPage,
  resetSorting,
}: DataTableFooterProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  const createQueryString = (
    name: 'page' | 'per_page',
    value: string,
    paramsToDelete: string[] = []
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    for (const p of paramsToDelete) {
      params.delete(p);
    }

    return params.toString();
  };

  const createPageQueryString = (pageNumber: number | null) =>
    pageNumber ? createQueryString('page', pageNumber.toString()) : '';

  const totalRows = table.getRowCount();

  const beginningResults = (currentPage - 1) * rowsPerPage + 1;
  const endResults = Math.min(rowsPerPage * currentPage, totalRows);

  const totalPageCount = table.getPageCount();
  const { items: paginationItems } = usePagination({
    currentPage,
    totalPageCount,
    siblingCount: isSmallDevice ? 0 : 1,
  });

  return (
    <div className="p-2 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div>
        Showing {beginningResults} to {endResults} of {totalRows} results
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            {paginationItems.map((paginationItem) => (
              <DataTablePaginationItem
                key={paginationItem.id}
                item={paginationItem}
                createPageQueryString={createPageQueryString}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                resetSorting={resetSorting}
              />
            ))}
          </PaginationContent>
        </Pagination>
      </div>

      <RowsPerPageSelector
        value={rowsPerPage}
        onChange={(value) => {
          resetSorting();
          const paramsToDelete =
            currentPage > 1
              ? [
                  'page',
                  Number(value) === DEFAULT_PER_PAGE_OPTION ? 'per_page' : '',
                ]
              : undefined;

          router.push(
            `${pathname}?${createQueryString('per_page', value, paramsToDelete)}`
          );
        }}
      />
    </div>
  );
}
