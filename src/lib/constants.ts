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

export const CONTEXT_DIAGNOSTIC_ITEMS: Record<
  string,
  {
    prompt: string;
    recommendationPrompt: string;
    recommendations: string[];
  }
> = {
  1: {
    prompt:
      'Overall, engaging in [the initiative] will be advantageous for participants and outweighs the costs of adoption and implementation',
    recommendationPrompt:
      'How might the initiative provide greater benefits or less costs and associated risks?',
    recommendations: [
      'Introduce or increase direct payments (e.g., incentives or results-based payments tied to measurable outcomes)',
      'Facilitate access to microfinance or low-interest loans for participants',
      'Support income diversification linked to the initiative (e.g., ecotourism or sustainable value chains)',
      'Consider ways to reduce risks. For example, you can reduce risk for financial benefits by guaranteeing minimum payments or facilitating access to established markets',
      'Co-develop benefit sharing mechanisms to distribute benefits equitably and appropriately, especially when multiple benefits are available',
      'Publicly celebrate adopters at local events or through media',
      'Conduct focus groups to understand how adoption could pose reputational risks and work to minimize those risks',
      'Frame adoption as leadership',
    ],
  },
  2: {
    prompt:
      '[The initiative] addresses critical needs of potential participants.',
    recommendationPrompt:
      'What are the adopters needs and priorities and how can the initiative help address them?',
    recommendations: [
      'Conduct needs assessments to identify and prioritize outcomes or areas that communities value most (e.g., through participatory mapping)',
      'Continuously assess whether the initiative is addressing',
    ],
  },
  3: {
    prompt:
      'Key benefits of the [the initiative] are realized quickly for all participants.',
    recommendationPrompt:
      'How can the initiative be designed to allow the adopters to experience the benefits more quickly?',
    recommendations: [
      'Provide upfront support or "quick wins" like equipment or stipends',
      'Emphasize immediate co-benefits like reduced labor or social recognition',
    ],
  },
  4: {
    prompt:
      'The benefits of participating in the initiative are easily observable.',
    recommendationPrompt:
      'How can the visibility of the benefits of the initiative be improved?',
    recommendations: [
      'Showcase the environmental benefits through before/after photos or testimonials',
      'Use environmental markers/metrics where possible (e.g., tidal flood distance for mangrove conservation, aboveground biomass for rangelands)',
      'Use livelihood markers/metrics where possible (e.g., numbers of households reporting skipping meals, fish catch, price per livestock)',
      'Introduce companion conservation practices that have immediate, visible benefits (e.g., erosion control or mangrove planting)',
      'Time visible activities or benefits to local calendars, including market days or holidays',
    ],
  },
  5: {
    prompt:
      'Potential participants can easily see who in their community is participating in [the initiative].',
    recommendationPrompt:
      'How can the visibility of the initiative be improved?',
    recommendations: [
      'Offer signs, branded tools, or clothing (e.g., hats or shirts) for adopters',
      'Advertise communities or individuals who have adopted through social or traditional media',
      'Display photo boards or maps showing where participants are located, where appropriate',
    ],
  },
  6: {
    prompt:
      '[The initiative] is flexible and can be modified to suit the needs of the participant.',
    recommendationPrompt:
      'How can the initiative be designed to be easy to modify to fit local priorities and contexts?',
    recommendations: [
      'Increase the number of actions that can be conducted, adapted, or excluded for participants to engage with the initiative',
      'Train local facilitators in adaptive management to modify relevant activities as needed',
      'Pilot and demonstrate variations of the initiative in different contexts',
    ],
  },
  7: {
    prompt:
      'Engaging in [the initiative] generally requires very few and/or very easy modifications to the current practices of participants.',
    recommendationPrompt:
      'How can the initiative be designed to be easy to modify to fit local practices?',
    recommendations: [
      'Tailor interventions to existing livelihood calendars and workflows',
      'Provide inputs/tools that ease the shift in activities (e.g., improved cookstoves or agricultural inputs)',
      'Reduce the number or degree of modifications to current practices required by participants',
    ],
  },
  8: {
    prompt:
      '[The initiative] and/or required actions are easy for participants to trial and later disengage.',
    recommendationPrompt:
      'How can the initiative be designed so that it can be tested before it is adopted fully?',
    recommendations: [
      'Develop easy and low-risk mechanisms for potential adopters to trial the initiative and later disengage',
      'Create demonstration plots or test sites within communities',
      'Offer "starter kits" for individuals or communities to pilot projects',
    ],
  },
  9: {
    prompt: 'The [initiative] is simple to understand and use.',
    recommendationPrompt:
      'How can the initiative be made easier to understand, access and implement?',
    recommendations: [
      'Increase the simplicity with which the initiative is communicated. Use common metaphors from local languages',
      'Train peer mentors to give 1-minute "elevator pitches" describing the initiative and its benefits',
      'Create comic-style leaflets or video explainers of the initiative',
    ],
  },
  10: {
    prompt:
      'The participants are familiar with the initiative and its consequences.',
    recommendationPrompt:
      "How can the adopter's familiarity with the initiative and its consequences be increased?",
    recommendations: [
      "Look for opportunities to design and implement the initiative so that it engages with the adopter's existing knowledge and experiences",
    ],
  },
  11: {
    prompt:
      'Potential participants generally have sufficient financial and/or other resources (e.g., access to food) to adopt and implement the initiative.',
    recommendationPrompt:
      'How can the initiative be designed so that it works within the personnel, budgetary and operational constraints of the adopter?',
    recommendations: [
      'Bundle the initiative with basic services available to entire communities (not just adopters) such as healthcare outreach or school meals',
      'Work with government agencies or NGOs to provide aid, cash transfers, or livelihood starter kits (e.g., seeds or livestock) to communities',
      'Train and hire personnel that can help the adopters implement the initiative',
    ],
  },
  12: {
    prompt:
      'The potential participants are politically empowered to make decisions on what to adopt and how.',
    recommendationPrompt:
      'How can the participation and representation of the adopter population in decision making be improved?',
    recommendations: [
      'Support community tenure rights and autonomy over resource management decisions',
    ],
  },
  13: {
    prompt:
      'Comprehensive and reliable technical support (e.g. by NGOs, universities, governments and other organizations) is available to assist participants in adopting and implementing the initiative.',
    recommendationPrompt:
      'What types of support is needed to allow adopters to effectively engage in adopting and implementing the initiative?',
    recommendations: [
      'Increase the availability or visit frequency with technical support staff (extension support)',
      'Use mobile platforms (e.g., dedicated WhatsApp channel) to provide low-cost, real-time support',
      'Train peer mentors within communities',
      'Develop simple how-to guides in local languages',
    ],
  },
  14: {
    prompt: 'There are local champions to actively promote [the initiative].',
    recommendationPrompt:
      'How can local champions be supported and encouraged?',
    recommendations: [
      'Recruit individuals with local influence to champion the initiative (e.g., religious or political leaders).',
      'Identify and find compromise with groups or individuals who actively oppose the initiative',
      'Recognize local champions with awards or celebrations',
    ],
  },
  15: {
    prompt:
      'Potential participants have well-developed ways of sharing knowledge to facilitate the spread of information.',
    recommendationPrompt:
      'How might can the exchange of experiences and knowledge of initiatives amongst adopters and between adopters and other potential adopters be encouraged?',
    recommendations: [
      'Support the establishment of knowledge-sharing networks or meetings between potential adopters',
      'Establish "farmer field schools" or equivalent',
      'Establish other regular trainings where participants and other community members can communicate (e.g., cooking classes using plants or fish catch resulting from the initiative)',
      'Use mobile or web platforms such as WhatsApp to create discussion groups',
    ],
  },
  16: {
    prompt:
      'Potential participants are geographically well-connected, driving frequent social interaction.',
    recommendationPrompt:
      'How can the physical barriers for adopters to communicate amongst themselves and with potential adopters be reduced?',
    recommendations: [
      'Support learning exchanges where individuals are brought to meetings in communities of other potential adopters they might not otherwise interact with',
      'Organize "exposure visits" where potential adopters can visit demonstration sites or successful communities',
      'Create regional WhatsApp groups or newsletters featuring updates across locations',
      'Facilitate the creation of other reasons and means of transport across the project areas, e.g., football/soccer tournaments between communities or schools',
    ],
  },
  17: {
    prompt:
      'The [initiative] is strongly supported by both regional, national and international policies.',
    recommendationPrompt:
      'How can the implementation of national policies that support adopters to engage with the conservation initiative be encouraged?',
    recommendations: [
      'Highlight connections to national and global initiatives where possible, e.g., 30 by 30',
      'Seek formal recognition (e.g., awards or certifications) from national or global programs aligned with the initiative',
      'Invite government representatives or donors to see and promote the initiative on their social media or traditional media channels.',
    ],
  },
} as const;

export const COUNTRY_BY_ISO3166 = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AD: 'Andorra',
  AO: 'Angola',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BR: 'Brazil',
  BN: 'Brunei',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CO: 'Colombia',
  KM: 'Comoros',
  CI: 'Cote d Ivoire',
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czechia',
  CD: 'Democratic Republic of the Congo',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GA: 'Gabon',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GR: 'Greece',
  GD: 'Grenada',
  GT: 'Guatemala',
  GN: 'Guinea',
  GW: 'Guinea Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HN: 'Honduras',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran',
  IQ: 'Iraq',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Laos',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MR: 'Mauritania',
  MU: 'Mauritius',
  MX: 'Mexico',
  FM: 'Micronesia',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  KP: 'North Korea',
  MK: 'North Macedonia',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PL: 'Poland',
  PT: 'Portugal',
  QA: 'Qatar',
  CG: 'Republic of the Congo',
  RO: 'Romania',
  RU: 'Russia',
  RW: 'Rwanda',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  KR: 'South Korea',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syria',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VA: 'Vatican City',
  VE: 'Venezuela',
  VN: 'Vietnam',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
} as const;
