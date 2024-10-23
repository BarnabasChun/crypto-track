import { z } from 'zod';
import { coinWithMarketData } from './schemas';

export type CoinWithMarketData = z.infer<typeof coinWithMarketData>;
