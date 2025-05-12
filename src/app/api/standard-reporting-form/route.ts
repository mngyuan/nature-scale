'use server';

import {R_API_BASE_URL} from '@/lib/constants';
import {NextRequest} from 'next/server';

export async function GET(request: NextRequest) {
  // just foward all the params
  const searchParams = request.nextUrl.searchParams;
  const res = await fetch(
    `${R_API_BASE_URL}/standard-reporting-form?${searchParams}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch standard reporting form data');
  }

  return new Response(await res.text(), {
    status: res.status,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="standard-reporting-form.csv"`,
    },
  });
}
