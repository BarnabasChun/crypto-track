import { ChevronDown, ChevronUp } from 'lucide-react';

interface PriceChangePercentageDisplayDetails {
  className: string;
  icon: React.ReactNode;
}

interface PriceChangeCellProps {
  priceChangePercentageAmount: number;
  priceChangePercentageDisplay: string;
}

export default function PriceChangePercentageCell({
  priceChangePercentageAmount,
  priceChangePercentageDisplay,
}: PriceChangeCellProps) {
  const getPriceChangePercentageDisplayDetails =
    (): PriceChangePercentageDisplayDetails => {
      if (priceChangePercentageAmount > 0) {
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
      {priceChangePercentageDisplay}
    </div>
  );
}
