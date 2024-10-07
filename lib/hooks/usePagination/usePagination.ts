type UsePaginationProps = {
  totalPageCount?: number;
  currentPage?: number;
  siblingCount?: number;
};

export const PAGINATION_ITEM_TYPES = {
  previous: 'previous',
  next: 'next',
  page: 'page',
  ellipsis: 'ellipsis',
} as const;

type UsePaginationItemType =
  (typeof PAGINATION_ITEM_TYPES)[keyof typeof PAGINATION_ITEM_TYPES];

type UsePaginationItem = {
  isActive: boolean;
  pageNumber: number | null;
  type: UsePaginationItemType;
  disabled: boolean;
};

type UsePaginationResult = {
  items: UsePaginationItem[];
};

export default function usePagination(
  props: UsePaginationProps = {}
): UsePaginationResult {
  const { totalPageCount = 1, currentPage = 1, siblingCount = 1 } = props;
  const { next, page, previous, ellipsis } = PAGINATION_ITEM_TYPES;

  const getItems = () => {
    // # of pages on side of current + (5 = current + 1st page + last page + ellipsis * 2)
    const maxDisplayedPaginationItems = siblingCount * 2 + 5;
    const firstPageNumber = 1;
    const lastPageNumber = totalPageCount;

    if (totalPageCount <= maxDisplayedPaginationItems) {
      const range = Array.from({ length: totalPageCount }, (_, i) => i + 1);
      return [previous, ...range, next];
    }

    const leftSiblingPageNumber = Math.max(
      currentPage - siblingCount,
      firstPageNumber
    );
    const rightSiblingPageNumber = Math.min(
      currentPage + siblingCount,
      lastPageNumber
    );

    const showLeftEllipsis = leftSiblingPageNumber > 2;
    const showRightEllipsis = rightSiblingPageNumber < totalPageCount - 2;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = Array.from(
        { length: maxDisplayedPaginationItems - 2 },
        (_, i) => i + 1
      );
      return [previous, ...leftRange, ellipsis, lastPageNumber, next];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = Array.from(
        { length: maxDisplayedPaginationItems - 2 },
        (_, i) => rightSiblingPageNumber - i
      ).reverse();
      return [previous, firstPageNumber, ellipsis, ...rightRange, next];
    }

    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingPageNumber - leftSiblingPageNumber + 1 },
        (_, i) => leftSiblingPageNumber + i
      );

      return [
        previous,
        firstPageNumber,
        ellipsis,
        ...middleRange,
        ellipsis,
        lastPageNumber,
        next,
      ];
    }

    return [];
  };

  const getPageNumber = (type: UsePaginationItemType) => {
    switch (type) {
      case next:
        return currentPage + 1;
      case previous:
        return currentPage - 1;
      default:
        return null;
    }
  };

  const items = getItems().map((item) => {
    if (typeof item === 'number') {
      return {
        pageNumber: item,
        isActive: currentPage === item,
        type: page,
        disabled: false,
      };
    }

    const pageNumber = getPageNumber(item);

    return {
      type: item,
      pageNumber,
      isActive: currentPage === pageNumber,
      disabled:
        item === previous ? currentPage === 1 : currentPage === totalPageCount,
    };
  });

  return {
    items,
  };
}
