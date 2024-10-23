import { transformToSingleDigitPercent } from '@/utils/formatting';
import { formatCurrency } from '@coingecko/cryptoformat';
import { z } from 'zod';
import {
  currencyAmount,
  priceChangePercentage,
} from '@/features/coins/api/schemas';

export const handlePriceChangeDisplay = (
  priceChange: z.infer<typeof priceChangePercentage>
) => (priceChange ? transformToSingleDigitPercent(priceChange) : '-');

export const handleCurrencyAmountDisplay = (
  amount: z.infer<typeof currencyAmount>
) => (amount ? formatCurrency(amount, 'usd', 'en') : '-');
