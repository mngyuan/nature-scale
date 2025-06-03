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
  number,
  {title: string; description: string; recommendations: string[]}
> = {
  1: {
    title: 'Financial Costs/Benefits',
    description:
      'Engaging in [the initiative] has meaningful net financial benefits for participants.',
    recommendations: [
      'Introduce or increase direct payments (e.g., incentives or results-based payments tied to measurable outcomes)',
      'Facilitate access to microfinance or low-interest loans for participants',
      'Support income diversification linked to the initiative (e.g., ecotourism or sustainable value chains)',
      'Consider ways to reduce risks associated to financial benefits, by guaranteeing minimum payments or facilitating access to established markets',
    ],
  },
  2: {
    title: 'Economic Wellbeing Prior to Adoption',
    description:
      'Potential participants generally have surplus financial and/or other livelihood resources (e.g., access to food).',
    recommendations: [
      'Bundle the initiative with basic services available to entire communities (not just adopters) such as healthcare outreach or school meals',
      'Work with government agencies or NGOs to provide aid, cash transfers, or livelihood starter kits (e.g., seeds or livestock) to communities',
    ],
  },
  3: {
    title: 'Environmental Benefit',
    description:
      'Engaging in [the initiative] has meaningful benefits to local environmental conditions of participants.',
    recommendations: [
      'Introduce companion conservation practices that have immediate, visible benefits (e.g., erosion control or mangrove planting)',
    ],
  },
  4: {
    title: 'Alignment with Current Practices',
    description:
      'Engaging in [the initiative] generally requires very few and/or very easy modifications to the current practices of participants.',
    recommendations: [
      'Tailor interventions to existing livelihood calendars and workflows',
      'Provide inputs/tools that ease the shift in activities (e.g., improved cookstoves or agricultural inputs)',
      'Reduce the number or degree of modifications to current practices required by participants',
    ],
  },
  5: {
    title: 'Adaptability of Intervention',
    description:
      '[The initiative] includes many actions that can be conducted, adapted, or excluded to meet different contexts and suit the needs of the participant.',
    recommendations: [
      'Increase the number of actions that can be conducted, adapted, or excluded for participants to engage with the initiative',
      'Train local facilitators in adaptive management to modify relevant activities as needed',
      'Pilot variations of the initiative in different contexts',
    ],
  },
  6: {
    title: 'Support Systems',
    description:
      'Comprehensive and reliable technical support is available to assist participants in adopting and implementing the initiative.',
    recommendations: [
      'Increase the availability or visit frequency with technical support staff (extension support)',
      'Use mobile platforms (e.g., dedicated WhatsApp channel) to provide low-cost, real-time support',
      'Train peer mentors within communities',
      'Develop simple how-to guides in local languages',
    ],
  },
  7: {
    title: 'Trialability',
    description:
      '[The initiative] and/or required actions are easy and low-risk for participants to trial and later disengage.',
    recommendations: [
      'Develop easy and low-risk mechanisms for potential adopters to trial the initiative and later disengage',
      'Create demonstration plots or test sites within communities',
      'Offer "starter kits" for individuals or communities',
    ],
  },
  8: {
    title: 'Empowerment',
    description:
      'The potential participants are politically empowered to make decisions on what to adopt and how.',
    recommendations: [
      'Support community tenure rights and autonomy over resource management decisions',
    ],
  },
  9: {
    title: 'Overall Benefits vs Costs',
    description:
      'Overall, engaging in [the initiative] will be advantageous for participants and outweighs the costs of adoption and implementation',
    recommendations: [
      'Co-develop benefit sharing mechanisms to distribute benefits equitably and appropriately, especially when multiple benefits are available',
    ],
  },
  10: {
    title: 'Direct Need Alignment',
    description:
      '[The initiative] directly addresses critical needs of potential participants.',
    recommendations: [
      'Conduct needs assessments to identify and prioritize outcomes or areas that communities value most (e.g., through participatory mapping)',
    ],
  },
  11: {
    title: 'Timing of Benefits',
    description:
      'Key benefits of the [the initiative] are nearly immediate for all participants.',
    recommendations: [
      'Provide upfront support or "quick wins" like equipment or stipends',
      'Emphasize immediate co-benefits like reduced labor or social recognition',
      'Time visible activities or benefits to local calendars, including market days or holidays',
    ],
  },
  12: {
    title: 'Social Connectivity',
    description:
      'Potential participants have well-developed ways of sharing knowledge and strong social connections to facilitate the spread of information.',
    recommendations: [
      'Support the establishment of knowledge-sharing networks or meetings between potential adopters',
      'Establish "farmer field schools" or equivalent',
      'Establish other regular trainings where participants and other community members can communicate (e.g., cooking classes using plants or fish catch resulting from the initiative)',
      'Use mobile or web platforms such as WhatsApp to create discussion groups',
    ],
  },
  13: {
    title: 'Proximity',
    description:
      'Potential participants are geographically well-connected, driving frequent social interaction.',
    recommendations: [
      'Support learning exchanges where individuals are brought to meetings in communities of other potential adopters they might not otherwise interact with',
      'Organize "exposure visits" where potential adopters can visit demonstration sites or successful communities',
      'Create regional WhatsApp groups or newsletters featuring updates across locations',
      'Facilitate the creation of other reasons and means of transport across the project areas, e.g., football/soccer tournaments between communities or schools',
    ],
  },
  14: {
    title: 'Simplicity',
    description: 'The [initiative] is simple to understand and use.',
    recommendations: [
      'Increase the simplicity with which the initiative can be understood and communicated. Use common metaphors from local languages',
      'Train peer mentors to give 1-minute "elevator pitches" describing the initiative and its benefits',
      'Create comic-style leaflets or video explainers of the initiative',
    ],
  },
  15: {
    title: 'Community Visibility',
    description:
      'The benefits of participating in the initiative are highly visible and evident to others.',
    recommendations: [
      'Offer signs, branded tools, or clothing (e.g., hats or shirts) for adopters',
      'Advertise communities or individuals who have adopted through social or traditional media',
      'Display photo boards or maps showing where participants are located, where appropriate',
    ],
  },
  16: {
    title: 'Observable',
    description:
      'Potential participants can easily see who in their community is participating in [the initiative].',
    recommendations: [
      'Showcase the environmental benefits through before/after photos or testimonials',
      'Use environmental markers/metrics where possible (e.g., tidal flood distance for mangrove conservation, aboveground biomass for rangelands)',
      'Use livelihood markers/metrics where possible (e.g., numbers of households reporting skipping meals, fish catch, price per livestock)',
    ],
  },
  17: {
    title: 'Policy Support',
    description:
      'The [initiative] is strongly supported by both international and national policies.',
    recommendations: [
      'Highlight connections to national and global initiatives where possible, e.g., 30 by 30',
      'Seek formal recognition (e.g., awards or certifications) from national or global programs aligned with the initiative',
      'Invite government representatives or donors to see and promote the initiative on their social media or traditional media channels',
    ],
  },
  18: {
    title: 'Local Champions',
    description:
      'Influential local champions actively promote [the initiative].',
    recommendations: [
      'Recruit individuals with local influence to champion the initiative (e.g., religious or political leaders)',
      'Identify and find compromise with groups or individuals who actively oppose the initiative',
      'Recognize local champions with awards or celebrations',
    ],
  },
  19: {
    title: 'Reputational Benefits',
    description:
      'Engaging in [the initiative] has meaningful net social benefits (e.g. tenure, reputation, connections) for participants.',
    recommendations: [
      'Publicly celebrate adopters at local events or through media',
      'Conduct focus groups to understand how adoption could pose reputational risks and work to minimize those risks',
      'Frame adoption as leadership',
    ],
  },
} as const;
