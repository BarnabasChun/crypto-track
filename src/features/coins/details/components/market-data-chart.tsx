import { useParams } from 'next/navigation';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { area as d3Area, line as d3Line } from 'd3-shape';
import { ChartDataPoint, useChartDataQuery } from '../api/get-chart-data';
import { contextualDateFormat } from '../utils/formatting';

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

  const xAccessor = (d: ChartDataPoint) => d.timestamp;
  const yAccessor = (d: ChartDataPoint) => d[metric];

  const xAxisStartPosition = marginLeft;
  const xAxisEndPosition = width - marginRight;

  const xScale = scaleTime(
    extent(data, xAccessor) as ReturnType<typeof xAccessor>[],
    [xAxisStartPosition, xAxisEndPosition]
  );

  const xAxisTicks = xScale.ticks().map((value) => ({
    value: contextualDateFormat(value),
    xOffset: xScale(value),
  }));

  const yScale = scaleLinear(
    extent(data, yAccessor) as ReturnType<typeof yAccessor>[],
    [height - marginBottom, marginTop]
  );

  const xAccessorScaled = (d: ChartDataPoint) => xScale(xAccessor(d));
  const yAccessorScaled = (d: ChartDataPoint) => yScale(yAccessor(d));

  const areaGenerator = d3Area<ChartDataPoint>()
    .x(xAccessorScaled)
    .y0(yScale(0))
    .y1(yAccessorScaled);

  const area = areaGenerator(data)!;

  const lineGenerator = d3Line<ChartDataPoint>()
    .x(xAccessorScaled)
    .y(yAccessorScaled);

  const line = lineGenerator(data)!;

  const firstMetricValue = data[0][metric];
  // TODO: handle !data.length
  const lastMetricValue = data.at(-1)![metric];
  const metricTrend =
    Math.sign(lastMetricValue - firstMetricValue) === 1
      ? 'positive'
      : 'negative';

  return (
    <svg
      width={width}
      height={height}
      // TODO: remove border after dev complete... for spacial reference
      className="border border-black"
    >
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

      <g>
        {xAxisTicks.map(({ value, xOffset }) => (
          <g key={`${value}-${xOffset}`} transform={`translate(${xOffset}, 0)`}>
            <text
              key={value}
              style={{
                fontSize: '10px',
                textAnchor: 'middle',
                transform: 'translateY(15px)',
              }}
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
