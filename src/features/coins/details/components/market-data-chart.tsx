import { useParams } from 'next/navigation';
import { useChartDataQuery } from '../api/get-chart-data';

interface MarketDataChartProps {
  days: number;
  currency: string;
}

export function MarketDataChart({ days, currency }: MarketDataChartProps) {
  const { id } = useParams();
  const { data, isLoading, isError } = useChartDataQuery(id as string, {
    days,
    currency,
  });

  if (isError) {
    return (
      <div>We encountered an issue while trying to load the chart data.</div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}
