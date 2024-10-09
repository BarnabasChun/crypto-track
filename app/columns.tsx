'use client';

import { Button } from '@/components/ui/button';
import { CoinWithMarketData } from '@/lib/services/coingecko/schemas';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PriceChangePercentageCell from './price-change-percentage-cell';
import { DataTableColumnHeader } from './data-table-column-header';
import { isNull, isUndefined } from '@/lib/type-predicates';

const sortRawMarketData = (
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

const columnHelper = createColumnHelper<CoinWithMarketData>();
export const columns = [
  columnHelper.display({
    id: 'star',
    cell: () => (
      <Button variant="ghost" size="sm">
        <Star />
        <span className="sr-only">Add to favorites</span>
      </Button>
    ),
  }),
  columnHelper.accessor('rank', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header} textAlignment="left">
        #
      </DataTableColumnHeader>
    ),
    cell: ({ renderValue }) => renderValue(),
    meta: {
      size: 52, // size of column when sorted (i.e. sort icon is rendered). fixed size prevents layout shift.
    },
  }),
  columnHelper.accessor('name', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header} textAlignment="left">
        Name
      </DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <Link
        href={`/coins/${row.original.id}`}
        className="flex items-center gap-2 font-semibold"
      >
        {row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt=""
            width={48}
            height={48}
            className="w-6 h-6"
          />
        ) : (
          <div className="w-6 h-6 mr-2 bg-gray-200"> </div>
        )}
        {row.original.name}{' '}
        <span className="text-muted-foreground">{row.original.symbol}</span>
      </Link>
    ),
  }),
  columnHelper.accessor('display.currentPrice', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>Price</DataTableColumnHeader>
    ),
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'currentPrice'),
  }),
  columnHelper.accessor('raw.priceChange1h', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>1h</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <PriceChangePercentageCell
        priceChangePercentageAmount={row.original.raw.priceChange1h}
        priceChangePercentageDisplay={row.original.display.priceChange1h}
      />
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'priceChange1h'),
  }),
  columnHelper.accessor('raw.priceChange24h', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>24h</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <PriceChangePercentageCell
        priceChangePercentageAmount={row.original.raw.priceChange24h}
        priceChangePercentageDisplay={row.original.display.priceChange24h}
      />
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'priceChange24h'),
  }),
  columnHelper.accessor('raw.priceChange7d', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>7d</DataTableColumnHeader>
    ),
    cell: ({ row }) => (
      <PriceChangePercentageCell
        priceChangePercentageAmount={row.original.raw.priceChange7d}
        priceChangePercentageDisplay={row.original.display.priceChange7d}
      />
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'priceChange7d'),
  }),
  columnHelper.accessor('display.totalVolume', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>24h Volume</DataTableColumnHeader>
    ),
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'totalVolume'),
  }),
  columnHelper.accessor('display.marketCap', {
    header: ({ header }) => (
      <DataTableColumnHeader header={header}>Market Cap</DataTableColumnHeader>
    ),
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
    sortDescFirst: true,
    sortingFn: (rowA, rowB) => sortRawMarketData(rowA, rowB, 'marketCap'),
  }),
];
