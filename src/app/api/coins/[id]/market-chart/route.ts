import { type NextRequest } from 'next/server';

import {
  _getChartData,
  getChartDataParams,
} from '@/features/coins/details/api/get-chart-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestParams = await params;
  const searchParams = request.nextUrl.searchParams;

  const parsedParams = getChartDataParams.safeParse({
    currency: searchParams.get('currency'),
    days: searchParams.get('days'),
  });

  if (!parsedParams.success) {
    return Response.json({ error: parsedParams.error }, { status: 400 });
  }

  const [error, data] = await _getChartData(
    requestParams.id,
    parsedParams.data
  );

  if (data) {
    return Response.json(data);
  }

  return Response.json(
    { message: error.message, statusCode: error.statusCode },
    { status: error.statusCode }
  );
}
