import { z } from 'zod';
import {
  coinListing,
  coinListingsResponse,
  getCoinsListingParams,
} from './schemas';

export type CoinListing = z.infer<typeof coinListing>;
export type CoinListingsResponse = z.infer<typeof coinListingsResponse>;
export type GetCoinsListingParams = z.output<typeof getCoinsListingParams>;
