import { scaleLinear, scaleTime } from 'd3-scale';
import { extent, min } from 'd3-array';
import { area as d3Area, line as d3Line } from 'd3-shape';
import { ChartDataPoint } from '../api/get-chart-data';
import { contextualDateFormat } from '../utils/formatting';
import { useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import useResizeObserver, { type ObservedSize } from 'use-resize-observer';

interface MarketDataChartProps {
  data: ChartDataPoint[];
  metric: 'price' | 'marketCap';
}

const MAX_CHART_WIDTH = 992;

export function MarketDataChart({ data, metric }: MarketDataChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(MAX_CHART_WIDTH);
  const appliedWidth = Math.min(width, MAX_CHART_WIDTH);

  const handleResize = (size: ObservedSize) => {
    if (size.width !== undefined) {
      setWidth(size.width);
    }
  };

  const onResize = useDebounceCallback(handleResize, 200);

  useResizeObserver({
    // @ts-expect-error https://github.com/ZeeCoder/use-resize-observer/issues/108#issuecomment-2443327691
    ref,
    onResize,
  });

  const height = 300;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 20;
  const marginLeft = 0;

  const xAccessor = (d: ChartDataPoint) => d.timestamp;
  const yAccessor = (d: ChartDataPoint) => d[metric];

  const xAxisStartPosition = marginLeft;
  const xAxisEndPosition = appliedWidth - marginRight;

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
    .y0(yScale(min(data, yAccessor) as number))
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
    <div ref={ref}>
      <svg
        width={appliedWidth}
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

        <g transform={`translate(0, ${height - marginBottom})`}>
          {xAxisTicks.map(({ value, xOffset }) => (
            <g
              key={`${value}-${xOffset}`}
              transform={`translate(${xOffset}, 0)`}
            >
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
    </div>
  );
}
