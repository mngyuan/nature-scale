'use server';

import {R_API_BASE_URL} from '@/lib/constants';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  // just foward all the params
  const searchParams = request.nextUrl.searchParams;
  const res = await fetch(
    `${R_API_BASE_URL}/plot-area-of-interest?${searchParams}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch area of interest plot');
  }

  return new NextResponse(await res.blob(), {
    status: res.status,
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
