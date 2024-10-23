import { Row } from '@tanstack/react-table';
import { CoinWithMarketData } from '@/features/coins/api/types';
import { sortRawMarketData } from './column-sorting';

const columnToSort = 'currentPrice' as const;

const createMockCoinWithMarketDataRow = (
  price: number | null | undefined,
  columnId: keyof CoinWithMarketData['raw'] = columnToSort
) => {
  const mock = {
    original: {
      raw: {
        [columnId]: price,
      },
    },
  };

  return mock as Row<CoinWithMarketData>;
};

describe('sortRawMarketData', () => {
  test('returns 0 if values are equal', () => {
    [null, 2, undefined].forEach((value) => {
      const result = sortRawMarketData(
        createMockCoinWithMarketDataRow(value, columnToSort),
        createMockCoinWithMarketDataRow(value, columnToSort),
        columnToSort
      );

      expect(result).toBe(0);
    });
  });

  test.each([null, undefined]);

  test.each([null, undefined])(
    'returns 1 if rowA has a % value',
    (rowAValue) => {
      const result = sortRawMarketData(
        createMockCoinWithMarketDataRow(rowAValue, columnToSort),
        createMockCoinWithMarketDataRow(2, columnToSort),
        columnToSort
      );

      expect(result).toBe(1);
    }
  );

  test.each([null, undefined])(
    'returns -1 if rowB has a % value',
    (rowBValue) => {
      const result = sortRawMarketData(
        createMockCoinWithMarketDataRow(2, columnToSort),
        createMockCoinWithMarketDataRow(rowBValue, columnToSort),
        columnToSort
      );

      expect(result).toBe(-1);
    }
  );

  test('returns a positive number if rowA has a larger number than row B', () => {
    const result = sortRawMarketData(
      createMockCoinWithMarketDataRow(2, columnToSort),
      createMockCoinWithMarketDataRow(1, columnToSort),
      columnToSort
    );

    expect(result).toBeGreaterThan(0);
  });

  test('returns a negative number if rowA has a smaller number than row B', () => {
    const result = sortRawMarketData(
      createMockCoinWithMarketDataRow(1, columnToSort),
      createMockCoinWithMarketDataRow(2, columnToSort),
      columnToSort
    );

    expect(result).toBeLessThan(0);
  });
});
