import { renderHook } from '@testing-library/react-hooks';

import usePagination, { PAGINATION_ITEM_TYPES } from './usePagination';

const { next, previous, ellipsis } = PAGINATION_ITEM_TYPES;

describe('usePagination', () => {
  it('it returns one page by default', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination());

    // prev, 1, next
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveProperty('pageNumber', 1);
  });

  it('has disabled previous & next buttons by default', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination());

    expect(items[0]).toMatchObject({ type: previous, disabled: true });
    expect(items[2]).toMatchObject({ type: next, disabled: true });
  });

  it('has a disabled previous button & an enabled next button when on the first page', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 3 }));

    expect(items[0]).toMatchObject({ type: previous, disabled: true });
    expect(items[4]).toMatchObject({ type: next, disabled: false });
  });

  it('has an enabled previous button & disabled next button when on the last page', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 3, currentPage: 3 }));

    expect(items[0]).toMatchObject({ type: previous, disabled: false });
    expect(items[4]).toMatchObject({ type: next, disabled: true });
  });

  it('has no ellipses when count <= 7', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 5 }));

    // prev, 1, 2, 3, 4, 5, next
    expect(items).toHaveLength(7);
    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('pageNumber', 2);
    expect(items[3]).toHaveProperty('pageNumber', 3);
    expect(items[4]).toHaveProperty('pageNumber', 4);
    expect(items[5]).toHaveProperty('pageNumber', 5);
  });

  it('has a right ellipsis by default when count >= 8', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 8 }));

    expect(items).toHaveLength(9);

    // prev, 1, 2, 3, 4, 5, ..., 8, next
    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('pageNumber', 2);
    expect(items[3]).toHaveProperty('pageNumber', 3);
    expect(items[4]).toHaveProperty('pageNumber', 4);
    expect(items[5]).toHaveProperty('pageNumber', 5);
    expect(items[6]).toHaveProperty('type', ellipsis);
    expect(items[7]).toHaveProperty('pageNumber', 8);
  });

  it('has a left ellipsis when the current page >= 5', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 8, currentPage: 5 }));

    // prev, 1, ..., 2, 3, 4, 5, 6, next
    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('type', ellipsis);
    expect(items[3]).toHaveProperty('pageNumber', 2);
    expect(items[4]).toHaveProperty('pageNumber', 3);
    expect(items[5]).toHaveProperty('pageNumber', 4);
    expect(items[6]).toHaveProperty('pageNumber', 5);
    expect(items[7]).toHaveProperty('pageNumber', 6);
  });

  it('has left & right ellipsis when count >= 9', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() => usePagination({ totalPageCount: 9, currentPage: 5 }));
    // prev, 1, ellipsis, 4, 5, 6, ellipsis, 7, next
    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('type', ellipsis);
    expect(items[3]).toHaveProperty('pageNumber', 4);
    expect(items[4]).toHaveProperty('pageNumber', 5);
    expect(items[5]).toHaveProperty('pageNumber', 6);
    expect(items[6]).toHaveProperty('type', ellipsis);
    expect(items[7]).toHaveProperty('pageNumber', 9);
  });

  it('can have a reduced siblingCount', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() =>
      usePagination({ totalPageCount: 7, currentPage: 4, siblingCount: 0 })
    );

    // prev, 1, ellipsis, 4, ellipsis, 7, next
    expect(items).toHaveLength(7);
    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('type', ellipsis);
    expect(items[3]).toMatchObject({
      pageNumber: 4,
      isActive: true,
      type: 'page',
    });
    expect(items[4]).toHaveProperty('type', ellipsis);
    expect(items[5]).toHaveProperty('pageNumber', 7);
  });

  it('can have an increased siblingCount', () => {
    const {
      result: {
        current: { items },
      },
    } = renderHook(() =>
      usePagination({ totalPageCount: 11, currentPage: 6, siblingCount: 2 })
    );
    expect(items).toHaveLength(11);

    expect(items[1]).toHaveProperty('pageNumber', 1);
    expect(items[2]).toHaveProperty('type', ellipsis);
    expect(items[3]).toHaveProperty('pageNumber', 4);
    expect(items[4]).toHaveProperty('pageNumber', 5);
    expect(items[5]).toHaveProperty('pageNumber', 6);
    expect(items[6]).toHaveProperty('pageNumber', 7);
    expect(items[7]).toHaveProperty('pageNumber', 8);
    expect(items[8]).toHaveProperty('type', ellipsis);
    expect(items[9]).toHaveProperty('pageNumber', 11);
  });
});
