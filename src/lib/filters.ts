/**
 * Comprehensive filtering system for EU funding opportunities
 * Designed specifically for Africa team colleagues to find relevant funding opportunities
 */

export interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  fundingAmount: string;
  deadline: string;
  startDate: string;
  programme: string;
  callId: string;
  callTitle: string;
  status: 'Open' | 'Forthcoming' | 'Closed';
  geographical_focus: string;
  category: string;
  source_website: string;
  source_url: string;
  scraped_at: string;
  api_source: boolean;
  funding_type: 'Development' | 'Humanitarian' | 'Tender';
  thematic_priority: string;
  country: string;
  subRegion: string;
  fundingInstrument: string;
  eligibility: string;
  applicationProcess: string;
  type_code: string;
  framework_programme: string;
  cross_cutting_priorities: string[];
  programme_period: string;
  keywords: string[];
  tags: string[];
  thematic_priorities: string[];
}

export interface FilterOptions {
  countries: string[];
  thematicPriorities: string[];
  fundingCycles: string[];
  subregions: string[];
  fundingTypes: string[];
  status: string[];
  programmePeriods: string[];
  budgetRange: {
    min: number;
    max: number;
  };
}

export interface SearchFilters {
  query?: string;
  countries?: string[];
  thematicPriorities?: string[];
  fundingCycles?: string[];
  subregions?: string[];
  fundingTypes?: string[];
  status?: string[];
  programmePeriods?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

// African Countries and Subregions
export const AFRICAN_COUNTRIES = [
  // West Africa
  { name: 'Benin', code: 'BJ', subregion: 'West Africa' },
  { name: 'Burkina Faso', code: 'BF', subregion: 'West Africa' },
  { name: 'Cape Verde', code: 'CV', subregion: 'West Africa' },
  { name: 'Côte d\'Ivoire', code: 'CI', subregion: 'West Africa' },
  { name: 'Gambia', code: 'GM', subregion: 'West Africa' },
  { name: 'Ghana', code: 'GH', subregion: 'West Africa' },
  { name: 'Guinea', code: 'GN', subregion: 'West Africa' },
  { name: 'Guinea-Bissau', code: 'GW', subregion: 'West Africa' },
  { name: 'Liberia', code: 'LR', subregion: 'West Africa' },
  { name: 'Mali', code: 'ML', subregion: 'West Africa' },
  { name: 'Mauritania', code: 'MR', subregion: 'West Africa' },
  { name: 'Niger', code: 'NE', subregion: 'West Africa' },
  { name: 'Nigeria', code: 'NG', subregion: 'West Africa' },
  { name: 'Senegal', code: 'SN', subregion: 'West Africa' },
  { name: 'Sierra Leone', code: 'SL', subregion: 'West Africa' },
  { name: 'Togo', code: 'TG', subregion: 'West Africa' },
  
  // East Africa
  { name: 'Burundi', code: 'BI', subregion: 'East Africa' },
  { name: 'Comoros', code: 'KM', subregion: 'East Africa' },
  { name: 'Djibouti', code: 'DJ', subregion: 'East Africa' },
  { name: 'Eritrea', code: 'ER', subregion: 'East Africa' },
  { name: 'Ethiopia', code: 'ET', subregion: 'East Africa' },
  { name: 'Kenya', code: 'KE', subregion: 'East Africa' },
  { name: 'Madagascar', code: 'MG', subregion: 'East Africa' },
  { name: 'Malawi', code: 'MW', subregion: 'East Africa' },
  { name: 'Mauritius', code: 'MU', subregion: 'East Africa' },
  { name: 'Mozambique', code: 'MZ', subregion: 'East Africa' },
  { name: 'Rwanda', code: 'RW', subregion: 'East Africa' },
  { name: 'Seychelles', code: 'SC', subregion: 'East Africa' },
  { name: 'Somalia', code: 'SO', subregion: 'East Africa' },
  { name: 'South Sudan', code: 'SS', subregion: 'East Africa' },
  { name: 'Sudan', code: 'SD', subregion: 'East Africa' },
  { name: 'Tanzania', code: 'TZ', subregion: 'East Africa' },
  { name: 'Uganda', code: 'UG', subregion: 'East Africa' },
  { name: 'Zambia', code: 'ZM', subregion: 'East Africa' },
  { name: 'Zimbabwe', code: 'ZW', subregion: 'East Africa' },
  
  // Central Africa
  { name: 'Angola', code: 'AO', subregion: 'Central Africa' },
  { name: 'Cameroon', code: 'CM', subregion: 'Central Africa' },
  { name: 'Central African Republic', code: 'CF', subregion: 'Central Africa' },
  { name: 'Chad', code: 'TD', subregion: 'Central Africa' },
  { name: 'Democratic Republic of Congo', code: 'CD', subregion: 'Central Africa' },
  { name: 'Equatorial Guinea', code: 'GQ', subregion: 'Central Africa' },
  { name: 'Gabon', code: 'GA', subregion: 'Central Africa' },
  { name: 'Republic of Congo', code: 'CG', subregion: 'Central Africa' },
  { name: 'São Tomé and Príncipe', code: 'ST', subregion: 'Central Africa' },
  
  // Southern Africa
  { name: 'Botswana', code: 'BW', subregion: 'Southern Africa' },
  { name: 'Eswatini', code: 'SZ', subregion: 'Southern Africa' },
  { name: 'Lesotho', code: 'LS', subregion: 'Southern Africa' },
  { name: 'Namibia', code: 'NA', subregion: 'Southern Africa' },
  { name: 'South Africa', code: 'ZA', subregion: 'Southern Africa' },
  
  // North Africa
  { name: 'Algeria', code: 'DZ', subregion: 'North Africa' },
  { name: 'Egypt', code: 'EG', subregion: 'North Africa' },
  { name: 'Libya', code: 'LY', subregion: 'North Africa' },
  { name: 'Morocco', code: 'MA', subregion: 'North Africa' },
  { name: 'Tunisia', code: 'TN', subregion: 'North Africa' },
] as const;

export const SUBREGIONS = [
  'West Africa',
  'East Africa', 
  'Central Africa',
  'Southern Africa',
  'North Africa'
] as const;

// Thematic Priorities (based on EU development priorities)
export const THEMATIC_PRIORITIES = [
  'Sustainable Economic Growth',
  'Human Development',
  'Peace and Security',
  'Climate Change and Environment',
  'Migration and Mobility',
  'Digital Transformation',
  'Gender Equality',
  'Youth and Education',
  'Health and Nutrition',
  'Agriculture and Food Security',
  'Infrastructure and Energy',
  'Governance and Human Rights',
  'Trade and Investment',
  'Innovation and Technology',
  'Urban Development',
  'Rural Development',
  'Disaster Risk Reduction',
  'Humanitarian Aid',
  'Conflict Prevention',
  'Democracy and Civil Society'
] as const;

// Funding Cycles
export const FUNDING_CYCLES = [
  '2021-2024',
  '2021-2027',
  '2024-2027',
  '2025-2028',
  '2026-2029'
] as const;

// Programme Periods
export const PROGRAMME_PERIODS = [
  '2021-2027',
  '2024-2030',
  '2025-2031'
] as const;

// Funding Types
export const FUNDING_TYPES = [
  'Development',
  'Humanitarian',
  'Tender',
  'Grant',
  'Call for Proposals',
  'Action Grant',
  'Project Grant'
] as const;

// Status Options
export const STATUS_OPTIONS = [
  'Open',
  'Forthcoming',
  'Closed'
] as const;

// Budget Ranges (in EUR)
export const BUDGET_RANGES = [
  { label: 'Under €100,000', min: 0, max: 100000 },
  { label: '€100,000 - €500,000', min: 100000, max: 500000 },
  { label: '€500,000 - €1M', min: 500000, max: 1000000 },
  { label: '€1M - €5M', min: 1000000, max: 5000000 },
  { label: '€5M - €10M', min: 5000000, max: 10000000 },
  { label: 'Over €10M', min: 10000000, max: Infinity }
] as const;

// Filter Functions
export function filterOpportunities(
  opportunities: FundingOpportunity[],
  filters: SearchFilters
): FundingOpportunity[] {
  return opportunities.filter(opportunity => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchText = [
        opportunity.title,
        opportunity.description,
        opportunity.programme,
        opportunity.thematic_priority,
        ...opportunity.keywords,
        ...opportunity.tags
      ].join(' ').toLowerCase();
      
      if (!searchText.includes(query)) {
        return false;
      }
    }

    // Country filter
    if (filters.countries && filters.countries.length > 0) {
      const opportunityCountries = opportunity.geographical_focus.toLowerCase();
      const hasMatchingCountry = filters.countries.some(country => 
        opportunityCountries.includes(country.toLowerCase())
      );
      if (!hasMatchingCountry) {
        return false;
      }
    }

    // Thematic priority filter
    if (filters.thematicPriorities && filters.thematicPriorities.length > 0) {
      const opportunityThemes = [
        opportunity.thematic_priority,
        ...opportunity.thematic_priorities
      ].map(t => t.toLowerCase());
      
      const hasMatchingTheme = filters.thematicPriorities.some(theme =>
        opportunityThemes.some(oppTheme => oppTheme.includes(theme.toLowerCase()))
      );
      if (!hasMatchingTheme) {
        return false;
      }
    }

    // Subregion filter
    if (filters.subregions && filters.subregions.length > 0) {
      const opportunitySubregion = opportunity.subRegion.toLowerCase();
      const hasMatchingSubregion = filters.subregions.some(subregion =>
        opportunitySubregion.includes(subregion.toLowerCase())
      );
      if (!hasMatchingSubregion) {
        return false;
      }
    }

    // Funding type filter
    if (filters.fundingTypes && filters.fundingTypes.length > 0) {
      const hasMatchingType = filters.fundingTypes.includes(opportunity.funding_type);
      if (!hasMatchingType) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      const hasMatchingStatus = filters.status.includes(opportunity.status);
      if (!hasMatchingStatus) {
        return false;
      }
    }

    // Programme period filter
    if (filters.programmePeriods && filters.programmePeriods.length > 0) {
      const hasMatchingPeriod = filters.programmePeriods.some(period =>
        opportunity.programme_period?.includes(period)
      );
      if (!hasMatchingPeriod) {
        return false;
      }
    }

    // Budget range filter
    if (filters.budgetRange) {
      const budgetAmount = extractBudgetAmount(opportunity.fundingAmount);
      if (budgetAmount !== null) {
        if (budgetAmount < filters.budgetRange.min || budgetAmount > filters.budgetRange.max) {
          return false;
        }
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const opportunityDate = new Date(opportunity.deadline);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (opportunityDate < startDate || opportunityDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

// Helper function to extract budget amount from string
function extractBudgetAmount(budgetString: string): number | null {
  if (!budgetString || budgetString === 'Contact for details') {
    return null;
  }
  
  // Extract number from strings like "€1,000,000" or "€1M"
  const match = budgetString.match(/€?([\d,.\s]+)/);
  if (match) {
    const amount = parseFloat(match[1].replace(/[,\s]/g, ''));
    if (budgetString.includes('M')) {
      return amount * 1000000;
    } else if (budgetString.includes('K')) {
      return amount * 1000;
    }
    return amount;
  }
  
  return null;
}

// Get filter options from opportunities
export function getFilterOptions(opportunities: FundingOpportunity[]): FilterOptions {
  const countries = new Set<string>();
  const thematicPriorities = new Set<string>();
  const fundingCycles = new Set<string>();
  const subregions = new Set<string>();
  const fundingTypes = new Set<string>();
  const status = new Set<string>();
  const programmePeriods = new Set<string>();
  
  opportunities.forEach(opportunity => {
    // Extract countries from geographical focus
    AFRICAN_COUNTRIES.forEach(country => {
      if (opportunity.geographical_focus.toLowerCase().includes(country.name.toLowerCase())) {
        countries.add(country.name);
      }
    });
    
    // Extract thematic priorities
    opportunity.thematic_priorities.forEach(theme => {
      thematicPriorities.add(theme);
    });
    
    // Extract funding cycles (from programme period)
    if (opportunity.programme_period) {
      fundingCycles.add(opportunity.programme_period);
    }
    
    // Extract subregions
    if (opportunity.subRegion) {
      subregions.add(opportunity.subRegion);
    }
    
    // Extract funding types
    fundingTypes.add(opportunity.funding_type);
    
    // Extract status
    status.add(opportunity.status);
    
    // Extract programme periods
    if (opportunity.programme_period) {
      programmePeriods.add(opportunity.programme_period);
    }
  });
  
  return {
    countries: Array.from(countries).sort(),
    thematicPriorities: Array.from(thematicPriorities).sort(),
    fundingCycles: Array.from(fundingCycles).sort(),
    subregions: Array.from(subregions).sort(),
    fundingTypes: Array.from(fundingTypes).sort(),
    status: Array.from(status).sort(),
    programmePeriods: Array.from(programmePeriods).sort(),
    budgetRange: {
      min: 0,
      max: Infinity
    }
  };
}

// Sort opportunities by relevance for Africa
export function sortByAfricanRelevance(opportunities: FundingOpportunity[]): FundingOpportunity[] {
  return opportunities.sort((a, b) => {
    const scoreA = calculateAfricanRelevanceScore(a);
    const scoreB = calculateAfricanRelevanceScore(b);
    return scoreB - scoreA;
  });
}

function calculateAfricanRelevanceScore(opportunity: FundingOpportunity): number {
  let score = 0;
  
  // Check geographical focus
  const geoFocus = opportunity.geographical_focus.toLowerCase();
  if (geoFocus.includes('africa') || geoFocus.includes('african')) {
    score += 5;
  }
  
  // Check keywords and tags
  const allText = [
    opportunity.title,
    opportunity.description,
    ...opportunity.keywords,
    ...opportunity.tags
  ].join(' ').toLowerCase();
  
  const africanKeywords = [
    'africa', 'african', 'sahel', 'east africa', 'west africa', 'southern africa',
    'sub-saharan', 'madagascar', 'ethiopia', 'kenya', 'nigeria', 'ghana', 'senegal',
    'mali', 'burkina faso', 'niger', 'chad', 'sudan', 'south africa', 'tanzania',
    'uganda', 'rwanda', 'burundi', 'democratic republic of congo', 'cameroon',
    'ivory coast', 'benin', 'togo', 'liberia', 'sierra leone', 'guinea', 'gambia',
    'mauritania', 'morocco', 'algeria', 'tunisia', 'libya', 'egypt', 'somalia',
    'djibouti', 'eritrea', 'central african republic', 'gabon', 'equatorial guinea',
    'sao tome and principe', 'cape verde', 'comoros', 'mauritius', 'seychelles'
  ];
  
  africanKeywords.forEach(keyword => {
    if (allText.includes(keyword)) {
      score += 1;
    }
  });
  
  // Check thematic priorities
  const developmentThemes = [
    'sustainable', 'development', 'economic growth', 'human development',
    'peace', 'security', 'climate', 'environment', 'migration', 'digital',
    'gender', 'youth', 'education', 'health', 'nutrition', 'agriculture',
    'food security', 'infrastructure', 'energy', 'governance', 'human rights',
    'trade', 'investment', 'innovation', 'technology', 'urban', 'rural',
    'disaster', 'humanitarian', 'conflict', 'democracy', 'civil society'
  ];
  
  developmentThemes.forEach(theme => {
    if (allText.includes(theme)) {
      score += 0.5;
    }
  });
  
  return score;
}
