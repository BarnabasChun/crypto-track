import { ChevronDown, ChevronUp } from 'lucide-react';

type PriceChangeDisplayDetails = {
  className: string;
  icon: React.ReactNode;
};

type PriceChangeCellProps = {
  priceChangeAmount?: number;
  priceChangeDisplay?: string;
};

export default function PriceChangeCell({
  priceChangeAmount,
  priceChangeDisplay,
}: PriceChangeCellProps) {
  if (!priceChangeAmount) {
    return null;
  }

  const getPriceChangeDisplayDetails = (): PriceChangeDisplayDetails => {
    if (priceChangeAmount === 0) {
      return {
        className: '',
        icon: null,
      };
    }

    if (priceChangeAmount > 0) {
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

  const { className, icon } = getPriceChangeDisplayDetails();

  return (
    <div className={`flex justify-end ${className}`}>
      {icon && icon}
      {priceChangeDisplay}
    </div>
  );
}
