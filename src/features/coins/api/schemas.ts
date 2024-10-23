import { z } from 'zod';

import {
  DEFAULT_CURRENCY,
  DEFAULT_PER_PAGE_OPTION,
} from '@/features/coins/constants';
import {
  handleCurrencyAmountDisplay,
  handlePriceChangeDisplay,
  nameToSlug,
} from '@/features/coins/utils/formatting';

export function parseCoingeckoResponse<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
) {
  const coingeckoErrorResponse = z.object({ error: z.string() });
  const coingeckoResponse = z.union([z.any(), coingeckoErrorResponse]);

  const parsedResponse = coingeckoResponse.parse(data);

  const isErrorResponse = 'error' in parsedResponse;

  const response = {
    ...(isErrorResponse
      ? { error: parsedResponse.error }
      : { data: parsedResponse }),
    status: isErrorResponse ? 'error' : 'success',
  };

  const errorResponse = z.object({
    error: z.string(),
    status: z.literal('error'),
  });

  const successResponseSchema = z.object({
    data: schema,
    status: z.literal('success'),
  });

  return z
    .discriminatedUnion('status', [errorResponse, successResponseSchema])
    .parse(response);
}

export const coinsList = z.array(
  z
    .object({
      id: z.string(),
      name: z.string(),
      symbol: z.string(),
    })
    .transform((props) => ({ ...props, slug: nameToSlug(props.name) }))
);

export const priceChangePercentage = z.number().nullish();

export const currencyAmount = z.number().nullable();

export const coinWithMarketData = z
  .object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string(),
    current_price: currencyAmount,
    market_cap: currencyAmount,
    market_cap_rank: currencyAmount,
    total_volume: currencyAmount,
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
      image,
      symbol,
      ...data
    }) => {
      return {
        rank: market_cap_rank,
        symbol: symbol.toUpperCase(),
        raw: {
          currentPrice: current_price,
          marketCap: market_cap,
          totalVolume: total_volume,
          priceChange1h: price_change_percentage_1h_in_currency,
          priceChange24h: price_change_percentage_24h_in_currency,
          priceChange7d: price_change_percentage_7d_in_currency,
        },
        display: {
          currentPrice: handleCurrencyAmountDisplay(current_price),
          marketCap: handleCurrencyAmountDisplay(market_cap),
          totalVolume: handleCurrencyAmountDisplay(total_volume),
          priceChange1h: handlePriceChangeDisplay(
            price_change_percentage_1h_in_currency
          ),
          priceChange24h: handlePriceChangeDisplay(
            price_change_percentage_24h_in_currency
          ),
          priceChange7d: handlePriceChangeDisplay(
            price_change_percentage_7d_in_currency
          ),
        },
        imageUrl: image === 'missing_large.png' ? '' : image,
        ...data,
        slug: nameToSlug(data.name),
      };
    }
  );

export const coinsWithMarketData = z.array(coinWithMarketData);

export const getCoinsWithMarketDataParams = z.object({
  currency: z
    .string()
    .nullish()
    .transform((val) => val ?? DEFAULT_CURRENCY),
  page: z
    .string()
    .nullish()
    .transform((val) => (val ? parseInt(val) : 1)),
  perPage: z
    .string()
    .nullish()
    .transform((val) => (val ? parseInt(val) : DEFAULT_PER_PAGE_OPTION)),
});

const marketDataCurrencyMap = z.record(z.string(), z.number());

export const coinDetails = z
  .object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    market_data: z.object({
      current_price: marketDataCurrencyMap,
      price_change_percentage_24h_in_currency: marketDataCurrencyMap,
    }),
    image: z.object({
      thumb: z.string(),
      small: z.string(),
      large: z.string(),
    }),
    market_cap_rank: z.number(),
  })
  .transform(({ image, symbol, market_cap_rank, market_data, ...props }) => {
    return {
      ...props,
      symbol: symbol.toUpperCase(),
      imageUrl: image.thumb,
      rank: market_cap_rank,
      marketData: {
        raw: {
          currentPrice: market_data.current_price[DEFAULT_CURRENCY],
          priceChange24h:
            market_data.price_change_percentage_24h_in_currency[
              DEFAULT_CURRENCY
            ],
        },
        display: {
          currentPrice: handleCurrencyAmountDisplay(
            market_data.current_price[DEFAULT_CURRENCY]
          ),
          priceChange24h: handlePriceChangeDisplay(
            market_data.price_change_percentage_24h_in_currency[
              DEFAULT_CURRENCY
            ]
          ),
        },
      },
    };
  });
