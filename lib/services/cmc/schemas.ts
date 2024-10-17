import { z } from 'zod';

import { DEFAULT_PER_PAGE_OPTION } from '@/lib/constants';
import { transformToSingleDigitPercent } from '@/lib/formatting';
import { formatCurrency } from '@coingecko/cryptoformat';
import { ResponseStatus } from '@/lib/types';

const status = z
  .object({
    error_code: z.number(),
    error_message: z.string().nullable(),
  })
  .passthrough();

export const cmcResponse = z.object({
  status,
  data: z.undefined().or(z.any()),
});

const errorResponse = cmcResponse.extend({
  response_status: z.literal(ResponseStatus.error),
  data: z.undefined(),
});

const successResponse = cmcResponse.extend({
  response_status: z.literal(ResponseStatus.success),
});

const coinQuote = z.object({
  price: z.number(),
  market_cap: z.number(),
  volume_24h: z.number(),
  percent_change_1h: z.number(),
  percent_change_24h: z.number(),
  percent_change_7d: z.number(),
});

const handleCurrencyAmountDisplay = (currencyAmount: number) =>
  formatCurrency(currencyAmount, 'usd', 'en');

export const coinListing = z
  .object({
    id: z.number(),
    name: z.string(),
    symbol: z.string(),
    slug: z.string(),
    cmc_rank: z.number(),
    quote: z.record(z.string(), coinQuote),
  })
  .transform(({ cmc_rank, quote, ...data }) => {
    const {
      price,
      market_cap,
      volume_24h,
      percent_change_1h,
      percent_change_24h,
      percent_change_7d,
    } = quote['USD'];

    return {
      rank: cmc_rank,
      raw: {
        currentPrice: price,
        marketCap: market_cap,
        totalVolume: volume_24h,
        priceChange1h: percent_change_1h,
        priceChange24h: percent_change_24h,
        priceChange7d: percent_change_7d,
      },
      display: {
        currentPrice: handleCurrencyAmountDisplay(price),
        marketCap: handleCurrencyAmountDisplay(market_cap),
        totalVolume: handleCurrencyAmountDisplay(volume_24h),
        priceChange1h: transformToSingleDigitPercent(percent_change_1h),
        priceChange24h: transformToSingleDigitPercent(percent_change_24h),
        priceChange7d: transformToSingleDigitPercent(percent_change_7d),
      },
      ...data,
    };
  });

const coinListingsSuccessResponse = successResponse.extend({
  status: status.extend({ total_count: z.number() }),
  data: z.array(coinListing),
});

export const coinListingsResponse = z.discriminatedUnion('response_status', [
  errorResponse,
  coinListingsSuccessResponse,
]);

export const getCoinsListingParams = z.object({
  currency: z
    .string()
    .nullish()
    .transform((val) => val ?? 'USD'),
  page: z
    .string()
    .nullish()
    .transform((val) => (val ? parseInt(val) : 1)),
  perPage: z
    .string()
    .nullish()
    .transform((val) => (val ? parseInt(val) : DEFAULT_PER_PAGE_OPTION)),
});
