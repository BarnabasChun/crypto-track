import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getCoin } from '@/features/coins/details/api/get-coin-details';
import { PriceChangePercentage } from '@/features/coins/components/price-change-percentage';
import { ChartSection } from '@/features/coins/details/components/chart-section';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getChartDataQueryOptions } from '@/features/coins/details/api/get-chart-data';
import { DEFAULT_CHART_DATA_PARAMS } from '@/features/coins/details/constants';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const [error, coinDetails] = await getCoin(id);

  if (error?.statusCode === 404) {
    notFound();
  }

  return {
    title: `${coinDetails?.name} Price: ${coinDetails?.symbol} price, marketcap, and chart`,
  };
}

export default async function CoinDetailsPage(props: Props) {
  const params = await props.params;
  const [error, coinDetails] = await getCoin(params.id);

  if (error) {
    if (error.statusCode === 404) notFound();

    return null;
  }

  const { name, symbol, imageUrl, rank, marketData } = coinDetails;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    getChartDataQueryOptions(params.id, DEFAULT_CHART_DATA_PARAMS)
  );

  return (
    <div className="container mx-auto p-4">
      <section className="mb-2">
        <div className="flex items-center gap-2">
          <Image src={imageUrl} alt="" width={25} height={25} />
          <h1 className="text-2xl font-bold">{name}</h1>{' '}
          <span className="text-muted-foreground">{symbol}</span>
          {rank && <Badge variant="secondary">#{rank}</Badge>}
        </div>

        <div className="flex gap-1">
          <span className="font-bold">{marketData.display.currentPrice}</span>{' '}
          <PriceChangePercentage
            amount={marketData.raw.priceChange24h}
            display={marketData.display.priceChange24h}
          />
        </div>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ChartSection />
      </HydrationBoundary>
    </div>
  );
}
