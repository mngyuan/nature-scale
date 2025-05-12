'use server';

import {R_API_BASE_URL} from '@/lib/constants';

export async function getBoundaryNames({
  country,
  region,
  district,
}: {
  country: string;
  region?: string;
  district?: string;
}): Promise<string[]> {
  const params = new URLSearchParams({
    country,
    ...(region && {region: region}),
    ...(district && {district: district}),
  });

  try {
    const response = await fetch(`${R_API_BASE_URL}/boundary-names?${params}`, {
      // TODO: add API_KEY, not just security through obscurity
      // headers: {
      //   Authorization: `Bearer ${process.env.R_API_KEY}`,
      //   Accept: 'application/json',
      // },
      // Use Next.js caching with tag-based revalidation
      next: {
        tags: ['boundaries'],
        revalidate: 3600, // 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`R API responded with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching boundary data:', error);
    throw new Error('Failed to load boundary data');
  }
}
