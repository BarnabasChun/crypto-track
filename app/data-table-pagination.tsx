'use client';

import { Table } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { DEFAULT_PER_PAGE_OPTION } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import usePagination, {
  PAGINATION_ITEM_TYPES,
} from '@/lib/hooks/usePagination/usePagination';
import RowsPerPageSelector from './rows-per-page-selector';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage: number;
  rowsPerPage: number;
}

export function DataTablePagination<TData>({
  table,
  currentPage,
  rowsPerPage,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  const totalRows = table.getRowCount();

  const beginningResults = (currentPage - 1) * rowsPerPage + 1;
  const endResults = Math.min(rowsPerPage * currentPage, totalRows);

  const lastPageNumber = Math.ceil(totalRows / rowsPerPage);
  const { items: paginationItems } = usePagination({
    currentPage,
    totalPageCount: lastPageNumber,
    // TODO: check for screen width to apply siblingCount: 0 to reduce pagination items on smaller devices
  });

  const firstPageHref = {
    pathname: '/',
    ...(rowsPerPage !== DEFAULT_PER_PAGE_OPTION && {
      query: { per_page: rowsPerPage },
    }),
  };

  return (
    <div className="p-2 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div>
        Showing {beginningResults} to {endResults} of {totalRows} results
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            {paginationItems.map((paginationItem) => {
              const { next, previous, ellipsis, page } = PAGINATION_ITEM_TYPES;
              const pageQuery = {
                query: createQueryString(
                  'page',
                  paginationItem.pageNumber!.toString()
                ),
              };

              if (
                paginationItem.type === previous ||
                paginationItem.type === next
              ) {
                return (
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={paginationItem.disabled}
                    >
                      {paginationItem.type === previous ? (
                        <PaginationPrevious
                          href={currentPage === 2 ? firstPageHref : pageQuery}
                        />
                      ) : (
                        <PaginationNext href={pageQuery} />
                      )}
                    </Button>
                  </PaginationItem>
                );
              }

              if (paginationItem.type === page) {
                return (
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      disabled={currentPage === paginationItem.pageNumber}
                    >
                      <PaginationLink
                        isActive={paginationItem.isActive}
                        href={
                          paginationItem.pageNumber === 1
                            ? firstPageHref
                            : pageQuery
                        }
                      >
                        {paginationItem.pageNumber}
                      </PaginationLink>
                    </Button>
                  </PaginationItem>
                );
              }

              if (paginationItem.type === ellipsis) {
                return (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return null;
            })}
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
