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
import { getCoinsWithMarketDataParams } from '@/lib/services/coingecko/schemas';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  };

  const { page: currentPage, perPage: rowsPerPage } =
    getCoinsWithMarketDataParams.parse({
      page: searchParams.get('page'),
      perPage: searchParams.get('per_page'),
    });
  const totalRows = table.getRowCount();

  const beginningResults = (currentPage - 1) * rowsPerPage + 1;
  const endResults = Math.min(rowsPerPage * currentPage, totalRows);

  const lastPageNumber = Math.ceil(totalRows / rowsPerPage);

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
            <PaginationItem>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={!table.getCanPreviousPage()}
              >
                <PaginationPrevious href={previousPageHref} />
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button variant="ghost" disabled={currentPage === 1}>
                <PaginationLink
                  isActive={currentPage === 1}
                  href={firstPageHref}
                >
                  1
                </PaginationLink>
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button variant="ghost" disabled={currentPage === 2}>
                <PaginationLink
                  href={{
                    query: createQueryString('page', '2'),
                  }}
                  isActive={currentPage === 2}
                >
                  2
                </PaginationLink>
              </Button>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <Button variant="ghost" disabled={currentPage === lastPageNumber}>
                <PaginationLink
                  isActive={lastPageNumber === currentPage}
                  href={{
                    query: createQueryString('page', lastPageNumber.toString()),
                  }}
                >
                  {lastPageNumber}
                </PaginationLink>
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={!table.getCanNextPage()}
              >
                <PaginationNext
                  href={{
                    query: createQueryString(
                      'page',
                      (currentPage + 1).toString()
                    ),
                  }}
                />
              </Button>
            </PaginationItem>
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
