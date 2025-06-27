'use server';

import {R_API_BASE_URL} from '@/lib/constants';

export async function getBoundaryNames({
  country,
  regions,
  districts,
}: {
  country: string;
  regions?: string[];
  districts?: string[];
}): Promise<string[]> {
  const params = new URLSearchParams([
    ...Object.entries({
      country,
    }),

    ...(regions
      ? regions.includes('Any')
        ? []
        : regions.map((region) => ['region', region])
      : []),

    ...(districts
      ? districts.includes('Any')
        ? []
        : districts.map((district) => ['district', district])
      : []),
  ]);

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
