import {
  PAGINATION_ITEM_TYPES,
  UsePaginationItem,
} from '@/lib/hooks/usePagination/usePagination';
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { DEFAULT_PER_PAGE_OPTION } from '@/lib/constants';

export type DataTablePaginationItem = {
  item: UsePaginationItem;
  currentPage: number;
  rowsPerPage: number;
  createPageQueryString(pageNumber: number | null): string;
  resetSorting(): void;
};

export default function DataTablePaginationItem({
  item,
  currentPage,
  createPageQueryString,
  rowsPerPage,
  resetSorting,
}: DataTablePaginationItem) {
  const { next, previous, leftEllipsis, rightEllipsis, page } =
    PAGINATION_ITEM_TYPES;

  if (item.type === leftEllipsis || item.type === rightEllipsis) {
    return (
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  const pageQuery = {
    query: createPageQueryString(item.pageNumber),
  };

  const firstPageHref = {
    pathname: '/',
    ...(rowsPerPage !== DEFAULT_PER_PAGE_OPTION && {
      query: { per_page: rowsPerPage },
    }),
  };

  if (item.type === previous || item.type === next) {
    return (
      <PaginationItem>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={item.disabled}
          onClick={resetSorting}
        >
          {item.type === previous ? (
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

  if (item.type === page) {
    return (
      <PaginationItem>
        <Button
          variant="ghost"
          disabled={currentPage === item.pageNumber}
          onClick={resetSorting}
        >
          <PaginationLink
            isActive={item.isActive}
            href={item.pageNumber === 1 ? firstPageHref : pageQuery}
          >
            {item.pageNumber}
          </PaginationLink>
        </Button>
      </PaginationItem>
    );
  }

  return null;
}
