import styles from './market-data.module.css';
import { useParams } from 'next/navigation';
import { scaleUtc, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { area as d3Area, line as d3Line } from 'd3-shape';
import { ChartDataPoint, useChartDataQuery } from '../api/get-chart-data';

interface MarketDataChartProps {
  days: number;
  currency: string;
}

type ChartDataPointWithDate = Omit<ChartDataPoint, 'timestamp'> & {
  date: Date;
};

export function MarketDataChart({ days, currency }: MarketDataChartProps) {
  const { id } = useParams();
  const { status, data } = useChartDataQuery(id as string, {
    days,
    currency,
  });

  if (status === 'error') {
    return (
      <div>We encountered an issue while trying to load the chart data.</div>
    );
  }

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 0;

  const dataWithDate: ChartDataPointWithDate[] = data.map(
    ({ timestamp, ...d }) => ({ date: new Date(timestamp), ...d })
  );

  const xAccessor = (d: ChartDataPointWithDate) => d.date;
  const yAccessor = (d: ChartDataPointWithDate) => d.price;

  const xScale = scaleUtc(
    extent(dataWithDate, xAccessor) as ReturnType<typeof xAccessor>[],
    [marginLeft, width - marginRight]
  );

  const yScale = scaleLinear(
    extent(dataWithDate, yAccessor) as ReturnType<typeof yAccessor>[],
    [height - marginBottom, marginTop]
  );

  const areaGenerator = d3Area<ChartDataPointWithDate>()
    .x((d) => xScale(xAccessor(d)))
    .y0(yScale(0))
    .y1((d) => yScale(yAccessor(d)));

  const area = areaGenerator(dataWithDate)!;

  const lineGenerator = d3Line<ChartDataPointWithDate>()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = lineGenerator(dataWithDate)!;

  const firstPrice = dataWithDate[0].price;
  const lastPrice = dataWithDate.at(-1)!.price;
  const priceTrend =
    Math.sign(lastPrice - firstPrice) > 1 ? 'positive' : 'negative';

  return (
    <svg width={width} height={height}>
      <path className={`${styles[`area--${priceTrend}`]}`} d={area} />
      <path
        className={`${styles[`line--${priceTrend}`]}`}
        fill="none"
        d={line}
        strokeWidth={2}
      />
    </svg>
  );
}
