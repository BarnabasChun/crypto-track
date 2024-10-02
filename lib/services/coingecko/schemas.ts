import { z } from 'zod';

import { transformToSingleDigitPercent } from '@/lib/formatting';

export const coinsList = z.array(z.object({}));

const priceChangePercentage = z.optional(
  z.number().transform(transformToSingleDigitPercent)
);

export const coinsWithMarketData = z.array(
  z
    .object({
      id: z.string(),
      symbol: z.string(),
      name: z.string(),
      image: z.string(),
      current_price: z.number(),
      market_cap: z.number(),
      market_cap_rank: z.number(),
      total_volume: z.number(),
      // only included if `price_change_percentage` is passed with the values `1h,24h,7d`
      price_change_percentage_1h_in_currency: priceChangePercentage,
      price_change_percentage_24h_in_currency: priceChangePercentage,
      price_change_percentage_7d_in_currency: priceChangePercentage,
    })
    .transform(
      ({
        current_price,
        market_cap,
        market_cap_rank,
        total_volume,
        price_change_percentage_1h_in_currency,
        price_change_percentage_24h_in_currency,
        price_change_percentage_7d_in_currency,
        ...data
      }) => {
        return {
          rank: market_cap_rank,
          currentPrice: current_price,
          marketCap: market_cap,
          totalVolume: total_volume,
          priceChange1h: price_change_percentage_1h_in_currency,
          priceChange24h: price_change_percentage_24h_in_currency,
          priceChange7d: price_change_percentage_7d_in_currency,
          ...data,
        };
      }
    )
);

export const getCoinsWithMarketDataParams = z.object({
  currency: z
    .string()
    .nullable()
    .transform((val) => val ?? 'usd'),
  page: z
    .string()
    .nullable()
    .transform((val) => (val ? parseInt(val) : 1)),
  perPage: z
    .string()
    .nullable()
    .transform((val) => (val ? parseInt(val) : 100)),
});

export type GetCoinsWithMarketDataParams = z.output<
  typeof getCoinsWithMarketDataParams
>;
