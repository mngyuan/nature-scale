'use server';

import {R_API_BASE_URL} from '@/lib/constants';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  // just foward all the params and body
  const searchParams = request.nextUrl.searchParams;
  const csvContent = await request.text();
  const res = await fetch(`${R_API_BASE_URL}/run-forecast?${searchParams}`, {
    method: 'POST',
    body: csvContent,
    headers: {
      'Content-Type': 'application/csv',
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch forecast graph: ${res.status} ${res.statusText}`,
    );
  }

  return new NextResponse(await res.blob(), {
    status: res.status,
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
