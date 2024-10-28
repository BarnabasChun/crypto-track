import { z } from 'zod';
import { request } from '../../utils/request';
import { DEFAULT_CURRENCY } from '../../constants';
import {
  handleCurrencyAmountDisplay,
  handlePriceChangeDisplay,
} from '../../list/utils/formatting';

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
    market_cap_rank: z.number().nullable(),
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

export async function getCoin(id: string) {
  return request(`/coins/${id}`, coinDetails);
}
