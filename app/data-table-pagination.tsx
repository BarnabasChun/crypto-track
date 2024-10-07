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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEFAULT_PER_PAGE_OPTION, PER_PAGE_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import usePagination, {
  PAGINATION_ITEM_TYPES,
} from '@/lib/hooks/usePagination/usePagination';

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
  const previousPageHref =
    currentPage === 2
      ? firstPageHref
      : { query: createQueryString('page', (currentPage - 1).toString()) };

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
                        <PaginationPrevious href={previousPageHref} />
                      ) : (
                        <PaginationNext
                          href={{
                            query: createQueryString(
                              'page',
                              (currentPage + 1).toString()
                            ),
                          }}
                        />
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
                            : {
                                query: createQueryString(
                                  'page',
                                  paginationItem.pageNumber?.toString()!
                                ),
                              }
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

      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows</p>
        <Select
          value={`${rowsPerPage}`}
          onValueChange={(value) => {
            router.push(`${pathname}?${createQueryString('per_page', value)}`);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={rowsPerPage} />
          </SelectTrigger>
          <SelectContent side="top">
            {PER_PAGE_OPTIONS.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
