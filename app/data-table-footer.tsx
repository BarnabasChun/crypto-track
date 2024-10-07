'use client';

import { Table } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination, PaginationContent } from '@/components/ui/pagination';
import usePagination from '@/lib/hooks/usePagination/usePagination';
import RowsPerPageSelector from './rows-per-page-selector';
import DataTablePaginationItem from './data-table-pagination-item';

interface DataTableFooterProps<TData> {
  table: Table<TData>;
  currentPage: number;
  rowsPerPage: number;
}

export function DataTableFooter<TData>({
  table,
  currentPage,
  rowsPerPage,
}: DataTableFooterProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  const createPageQueryString = (pageNumber: number | null) =>
    pageNumber ? createQueryString('page', pageNumber.toString()) : '';

  const totalRows = table.getRowCount();

  const beginningResults = (currentPage - 1) * rowsPerPage + 1;
  const endResults = Math.min(rowsPerPage * currentPage, totalRows);

  const lastPageNumber = Math.ceil(totalRows / rowsPerPage);
  const { items: paginationItems } = usePagination({
    currentPage,
    totalPageCount: lastPageNumber,
    // TODO: check for screen width to apply siblingCount: 0 to reduce pagination items on smaller devices
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
              />
            ))}
          </PaginationContent>
        </Pagination>
      </div>

      <RowsPerPageSelector
        value={rowsPerPage}
        onChange={(value) => {
          router.push(`${pathname}?${createQueryString('per_page', value)}`);
        }}
      />
    </div>
  );
}
