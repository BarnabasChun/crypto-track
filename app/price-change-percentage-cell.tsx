import { PriceChangePercentage } from '@/lib/services/coingecko/schemas';
import { ChevronDown, ChevronUp } from 'lucide-react';

type PriceChangePercentageDisplayDetails = {
  className: string;
  icon: React.ReactNode;
};

type PriceChangeCellProps = {
  priceChangePercentageAmount: PriceChangePercentage;
  priceChangePercentageDisplay: string;
};

export default function PriceChangePercentageCell({
  priceChangePercentageAmount,
  priceChangePercentageDisplay,
}: PriceChangeCellProps) {
  const getPriceChangePercentageDisplayDetails =
    (): PriceChangePercentageDisplayDetails => {
      if (!priceChangePercentageAmount) {
        return {
          className: '',
          icon: null,
        };
      }

      if (priceChangePercentageAmount > 0) {
        return {
          className: 'text-green-600',
          icon: <ChevronUp />,
        };
      }

      return {
        className: 'text-red-600',
        icon: <ChevronDown />,
      };
    };

  const { className, icon } = getPriceChangePercentageDisplayDetails();

  return (
    <div className={`flex justify-end ${className}`}>
      {icon && icon}
      {priceChangePercentageDisplay ?? '-'}
    </div>
  );
}
