/* Constants file
 */

export const R_API_BASE_URL =
  process.env.R_API_BASE_URL || 'http://localhost:8000';

export const RESOURCE_LABELS: Record<string, string> = {
  grassland: 'Grassland',
  'open-forest': 'Open Forest',
  'closed-forest': 'Closed Forest',
  mangrove: 'Mangrove',
  freshwater: 'Freshwater',
  marine: 'Marine',
  agriculture: 'Agriculture',
  wetland: 'Wetland',
  shrubland: 'Shrubland',
  other: 'Other',
};
