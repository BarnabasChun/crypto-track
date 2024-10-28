'use client';

import { CHART_RANGE_OPTIONS } from '@/features/coins/constants';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChartCandlestickIcon, ChartLineIcon } from 'lucide-react';
import React, { useState } from 'react';

export function ChartSection() {
  const [chartView, setChartView] = useState('line');
  const [chartMetric, setChartMetric] = useState('price');
  const [timeRange, setTimeRange] = useState('1');

  return (
    <section>
      <div className="flex gap-2 flex-wrap">
        <ToggleGroup
          type="single"
          size="sm"
          className="border border-gray-200 rounded-sm p-1"
          value={chartView}
          onValueChange={setChartView}
        >
          <ToggleGroupItem value="line" aria-label="Toggle line chart">
            <ChartLineIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="candlestick"
            aria-label="Toggle candlestick chart"
          >
            <ChartCandlestickIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          size="sm"
          className="border border-gray-200 rounded-sm p-1 flex-grow sm:flex-grow-0"
          value={chartMetric}
          onValueChange={setChartMetric}
        >
          <ToggleGroupItem
            className="flex-grow"
            value="price"
            aria-label="Toggle viewing price chart"
          >
            Price
          </ToggleGroupItem>
          <ToggleGroupItem
            className="flex-grow"
            value="marketCap"
            aria-label="Toggle viewing market cap chart"
          >
            Market Cap
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          size="sm"
          className="border border-gray-200 rounded-sm p-1 flex-grow sm:flex-grow-0"
          value={timeRange}
          onValueChange={setTimeRange}
        >
          {CHART_RANGE_OPTIONS.map(({ value, label, ariaLabel }) => (
            <ToggleGroupItem
              className="flex-grow"
              key={label}
              value={`${value}`}
              aria-label={ariaLabel}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </section>
  );
}
