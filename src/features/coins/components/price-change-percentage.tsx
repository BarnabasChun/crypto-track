import { ChevronDown, ChevronUp } from 'lucide-react';
import { z } from 'zod';
import { priceChangePercentage } from '../utils/schemas';

interface PriceChangePercentageDisplayDetails {
  className: string;
  icon: React.ReactNode;
}

interface PriceChangePercentageProps {
  amount: z.infer<typeof priceChangePercentage>;
  display: string;
}

export function PriceChangePercentage({
  amount,
  display,
}: PriceChangePercentageProps) {
  const getPriceChangePercentageDisplayDetails =
    (): PriceChangePercentageDisplayDetails => {
      if (!amount) {
        return {
          className: '',
          icon: null,
        };
      }

      if (amount > 0) {
        return {
          className: 'text-green-700 dark:text-green-500',
          icon: <ChevronUp />,
        };
      }

      return {
        className: 'text-red-700 dark:text-red-500',
        icon: <ChevronDown />,
      };
    };

  const { className, icon } = getPriceChangePercentageDisplayDetails();

  return (
    <div className={`flex justify-end ${className}`}>
      {icon && icon}
      {display ?? '-'}
    </div>
  );
}
