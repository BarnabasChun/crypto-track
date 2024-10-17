import { z } from 'zod';

export const coinsList = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
  })
);
