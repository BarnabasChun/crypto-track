import { z } from 'zod';

export const priceChangePercentage = z.number().nullish();
