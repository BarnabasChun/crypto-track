import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getCoin } from '@/features/coins/details/api/get-coin-details';
import { PriceChangePercentage } from '@/features/coins/components/price-change-percentage';
import { ChartSection } from '@/features/coins/details/components/chart-section';

export default async function CoinDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [error, coinDetails] = await getCoin(params.id);

  if (error) {
    error.statusCode === 404 && notFound();

    return null;
  }

  const { name, symbol, imageUrl, rank, marketData } = coinDetails;

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

      <ChartSection />
    </div>
  );
}
