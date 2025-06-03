/* Constants file
 */

export const R_API_BASE_URL =
  process.env.NEXT_PUBLIC_R_API_BASE_URL ||
  process.env.R_API_BASE_URL ||
  'http://localhost:8000';

export const RESOURCE_TYPES: Record<string, {value: number; label: string}> = {
  'closed forest': {
    value: 1,
    label: 'Closed Forest',
  },
  'open forest': {
    value: 2,
    label: 'Open Forest',
  },
  shrubs: {
    value: 3,
    label: 'Shrubland',
  },
  grassland: {
    value: 4,
    label: 'Grassland',
  },
  wetland: {
    value: 5,
    label: 'Wetland',
  },
  bare: {
    value: 6,
    label: 'Bare Soil',
  },
  // snow: {value: 7, label: 'Snow/Ice'},
  agriculture: {value: 8, label: 'Agriculture'},
  // urban: {value: 9, label: 'Urban'},
  freshwater: {value: 10, label: 'Freshwater'},
  sea: {value: 11, label: 'Marine'},
} as const;
