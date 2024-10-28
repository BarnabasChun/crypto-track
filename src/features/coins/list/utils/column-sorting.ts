import { Row } from '@tanstack/react-table';

import { isNull, isUndefined } from '@/utils/type-predicates';
import { type CoinWithMarketData } from '../api/get-coins-market-data';

export const sortRawMarketData = (
  rowA: Row<CoinWithMarketData>,
  rowB: Row<CoinWithMarketData>,
  columnId: keyof CoinWithMarketData['raw']
) => {
  const a = rowA.original.raw[columnId];
  const b = rowB.original.raw[columnId];

  if (a === b) return 0;

  if (isNull(a) || isUndefined(a)) {
    return 1;
  }

  if (isNull(b) || isUndefined(b)) {
    return -1;
  }

  return a - b;
};
