'use client';

import { Button } from '@/components/ui/button';
import { CoinWithMarketData } from '@/lib/services/coingecko/schemas';
import { createColumnHelper } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PriceChangeCell from './price-change-cell';

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
    header: '#',
    cell: ({ renderValue }) => renderValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/coins/${row.original.id}`}
        className="flex items-center gap-2 font-semibold"
      >
        <Image
          src={row.original.imageUrl}
          alt={`${row.original.name} logo`}
          width={48}
          height={48}
          className="w-6 h-6"
        />
        {row.original.name}{' '}
        <span className="text-muted-foreground">{row.original.symbol}</span>
      </Link>
    ),
  }),
  columnHelper.accessor('display.currentPrice', {
    header: () => <div className="text-right">Price</div>,
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
  }),
  columnHelper.accessor('raw.priceChange1h', {
    header: () => <div className="text-right">1h</div>,
    cell: ({ row }) => (
      <PriceChangeCell
        priceChangeAmount={row.original.raw.priceChange1h}
        priceChangeDisplay={row.original.display.priceChange1h}
      />
    ),
  }),
  columnHelper.accessor('raw.priceChange24h', {
    header: () => <div className="text-right">24h</div>,
    cell: ({ row }) => (
      <PriceChangeCell
        priceChangeAmount={row.original.raw.priceChange24h}
        priceChangeDisplay={row.original.display.priceChange24h}
      />
    ),
  }),
  columnHelper.accessor('raw.priceChange7d', {
    header: () => <div className="text-right">7d</div>,
    cell: ({ row }) => (
      <PriceChangeCell
        priceChangeAmount={row.original.raw.priceChange7d}
        priceChangeDisplay={row.original.display.priceChange7d}
      />
    ),
  }),
  columnHelper.accessor('display.totalVolume', {
    header: () => <div className="text-right">24h Volume</div>,
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
  }),
  columnHelper.accessor('display.marketCap', {
    header: () => <div className="text-right">Market Cap</div>,
    cell: ({ renderValue }) => (
      <div className="text-right">{renderValue()}</div>
    ),
  }),
];
