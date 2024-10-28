import { formatCurrency } from '@coingecko/cryptoformat';
import { z } from 'zod';
import { transformToSingleDigitPercent } from '@/utils/formatting';
import { currencyAmount } from '../api/get-coins-market-data';
import { priceChangePercentage } from '@/features/coins/utils/schemas';

export const handlePriceChangeDisplay = (
  priceChange: z.infer<typeof priceChangePercentage>
) => (priceChange ? transformToSingleDigitPercent(priceChange) : '-');

export const handleCurrencyAmountDisplay = (
  amount: z.infer<typeof currencyAmount>
) => (amount ? formatCurrency(amount, 'usd', 'en') : '-');
