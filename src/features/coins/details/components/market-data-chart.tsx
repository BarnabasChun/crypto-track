import { useParams } from 'next/navigation';
import { scaleUtc, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { area as d3Area, line as d3Line } from 'd3-shape';
import {
  ChartDataPointWithDate,
  useChartDataQuery,
} from '../api/get-chart-data';

interface MarketDataChartProps {
  days: number;
  currency: string;
  metric: 'price' | 'marketCap';
}

export function MarketDataChart({
  days,
  currency,
  metric,
}: MarketDataChartProps) {
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

  const xAccessor = (d: ChartDataPointWithDate) => d.date;
  const yAccessor = (d: ChartDataPointWithDate) => d[metric];

  const xScale = scaleUtc(
    extent(data, xAccessor) as ReturnType<typeof xAccessor>[],
    [marginLeft, width - marginRight]
  );

  const yScale = scaleLinear(
    extent(data, yAccessor) as ReturnType<typeof yAccessor>[],
    [height - marginBottom, marginTop]
  );

  const areaGenerator = d3Area<ChartDataPointWithDate>()
    .x((d) => xScale(xAccessor(d)))
    .y0(yScale(0))
    .y1((d) => yScale(yAccessor(d)));

  const area = areaGenerator(data)!;

  const lineGenerator = d3Line<ChartDataPointWithDate>()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = lineGenerator(data)!;

  const firstMetricValue = data[0][metric];
  // TODO: handle !data.length
  const lastMetricValue = data.at(-1)![metric];
  const metricTrend =
    Math.sign(lastMetricValue - firstMetricValue) === 1
      ? 'positive'
      : 'negative';

  return (
    <svg width={width} height={height}>
      <path
        className={`${metricTrend === 'positive' ? 'fill-green-200' : 'fill-red-200'}`}
        d={area}
      />
      <path
        className={`${metricTrend === 'positive' ? 'stroke-green-600' : 'stroke-red-600'}`}
        fill="none"
        d={line}
        strokeWidth={2}
      />
    </svg>
  );
}
