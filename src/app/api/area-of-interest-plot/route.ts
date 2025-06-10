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
    throw new Error(
      `Failed to fetch area of interest plot: R API responded with ${res.status} ${res.statusText}`,
    );
  }

  const json = await res.json();
  return new NextResponse(JSON.stringify(json), {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const res = await fetch(`${R_API_BASE_URL}/plot-area-of-interest`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch area of interest plot: R API responded with ${res.status} ${res.statusText}`,
    );
  }

  return new NextResponse(await res.blob(), {
    status: res.status,
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
