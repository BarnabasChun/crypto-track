import { z } from 'zod';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { request } from '../../utils/request';

export const getChartDataParams = z.object({
  currency: z.string(),
  days: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number()),
});

const historicalChartData = z.array(z.tuple([z.number(), z.number()]));

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  marketCap: number;
}

const chartData = z
  .object({
    prices: historicalChartData,
    total_volumes: historicalChartData,
    market_caps: historicalChartData,
  })
  .transform(({ prices, total_volumes, market_caps }) => {
    const data: ChartDataPoint[] = [];

    for (let i = 0; i < prices.length; i++) {
      const [timestamp, price] = prices[i];
      const volume = total_volumes[i]?.[1] ?? null;
      const marketCap = market_caps[i]?.[1] ?? null;

      data.push({
        timestamp,
        price,
        volume,
        marketCap,
      });
    }

    return data;
  });

export async function _getChartData(
  id: string,
  params: z.output<typeof getChartDataParams>
) {
  return request(
    `/coins/${id}/market_chart?vs_currency=${params.currency}&days=${params.days}`,
    chartData
  );
}

export async function getChartData(
  id: string,
  params: z.output<typeof getChartDataParams>
) {
  const res = await fetch(
    `/api/coins/${id}/market-chart?currency=${params.currency}&days=${params.days}`
  );

  const data = await res.json();

  if (res.ok) {
    return data as Promise<z.infer<typeof chartData>>;
  }

  throw data;
}

export const getChartDataQueryOptions = (
  id: string,
  params: z.output<typeof getChartDataParams>
) =>
  queryOptions({
    queryKey: ['coins', id, params],
    queryFn: () => getChartData(id, params),
  });

export function useChartDataQuery(
  id: string,
  params: z.output<typeof getChartDataParams>
) {
  return useQuery({
    ...getChartDataQueryOptions(id, params),
  });
}
