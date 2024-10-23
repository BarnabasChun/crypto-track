import { Badge } from '@/components/ui/badge';
import { getAllCoins, getCoin } from '@/features/coins/api/requests';
import { PriceChangePercentageCell } from '@/features/coins/components/data-table/price-change-percentage-cell';
import { PageProps } from '@/types';
import Image from 'next/image';

export default async function CoinDetailsPage(props: PageProps) {
  const params = await props.params;
  const allCoins = await getAllCoins();

  const coinsList = allCoins.status === 'success' ? allCoins.data : [];

  const coinId = coinsList.find((coin) => coin.slug === params.slug)!.id;

  const coinDetails = await getCoin(coinId);

  if (coinDetails.status === 'success') {
    const { name, symbol, imageUrl, rank, marketData } = coinDetails.data;
    return (
      <div className="container mx-auto p-4">
        <section>
          <div className="flex items-center gap-2">
            <Image src={imageUrl} alt="" width={25} height={25} />
            <h1 className="text-2xl font-bold">{name}</h1>{' '}
            <span className="text-muted-foreground">{symbol}</span>
            <Badge variant="secondary">#{rank}</Badge>
          </div>

          <div className="flex gap-1">
            <span className="font-bold">{marketData.display.currentPrice}</span>{' '}
            <PriceChangePercentageCell
              priceChangePercentageAmount={marketData.raw.priceChange24h}
              priceChangePercentageDisplay={marketData.display.priceChange24h}
            />
          </div>
        </section>
      </div>
    );
  }
}
