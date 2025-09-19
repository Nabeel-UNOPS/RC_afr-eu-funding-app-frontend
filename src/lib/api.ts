import { opportunities as mockOpportunities, type Opportunity } from './data';

// Configuration for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-unops-cameron.cloudfunctions.net/run_intelligent_ingestion';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Maps backend data structure to frontend Opportunity type
 */
function mapBackendDataToOpportunity(backendData: any): Opportunity {
  // Generate a safe ID: use backendData.id if available, else hash the source_url
  let safeId = backendData.id;
  if (!safeId && backendData.source_url) {
    // Simple hash function for source_url
    safeId = 'id_' + Math.abs(hashString(backendData.source_url)).toString();
  }
  if (!safeId) {
    safeId = Math.random().toString(36).substring(2, 10);
  }
  return {
    id: safeId,
    title: backendData.title || 'Untitled Opportunity',
    country: backendData.country || 'Not specified',
    subRegion: getSubRegion(backendData.country || ''),
    fundingAmount: backendData.fundingAmount || 'Not specified',
    status: backendData.status || 'Open',
    deadline: backendData.deadline || 'Not specified',
    fundingInstrument: backendData.fundingInstrument || 'Not specified',
    fundingType: backendData.fundingType || 'Development',
    thematicPrio: backendData.thematicPrio || 'Not specified',
    summary: backendData.description || 'No description available',
    eligibility: backendData.eligibility || 'No eligibility information available',
    applicationProcess: backendData.applicationProcess || 'Please check the source website for application procedures',
    mipPrios: backendData.mipPrios || [],
    documents: backendData.documents || [{ name: 'View Source', url: backendData.source_url || '#' }],
    contacts: backendData.contacts || []
  };
}

/**
 * Simple hash function for strings (djb2)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash;
}

/**
 * Maps country to sub-region (simplified mapping)
 */
function getSubRegion(country: string): string {
  const countryLower = country.toLowerCase();
  
  // West Africa
  if (['benin', 'burkina faso', 'cape verde', 'cote d\'ivoire', 'gambia', 'ghana', 'guinea', 'guinea-bissau', 'liberia', 'mali', 'mauritania', 'niger', 'nigeria', 'senegal', 'sierra leone', 'togo'].includes(countryLower)) {
    return 'West Africa';
  }
  
  // East Africa
  if (['burundi', 'comoros', 'djibouti', 'eritrea', 'ethiopia', 'kenya', 'madagascar', 'malawi', 'mauritius', 'mozambique', 'rwanda', 'seychelles', 'somalia', 'south sudan', 'sudan', 'tanzania', 'uganda', 'zambia', 'zimbabwe'].includes(countryLower)) {
    return 'East Africa';
  }
  
  // Southern Africa
  if (['angola', 'botswana', 'eswatini', 'lesotho', 'namibia', 'south africa', 'swaziland'].includes(countryLower)) {
    return 'Southern Africa';
  }
  
  // Central Africa
  if (['cameroon', 'central african republic', 'chad', 'democratic republic of congo', 'equatorial guinea', 'gabon', 'republic of congo', 'sao tome and principe'].includes(countryLower)) {
    return 'Central Africa';
  }
  
  // North Africa
  if (['algeria', 'egypt', 'libya', 'morocco', 'tunisia'].includes(countryLower)) {
    return 'North Africa';
  }
  
  return 'Africa'; // Default fallback
}

/**
 * Fetches all funding opportunities from the backend API.
 * @returns A promise that resolves to an array of opportunities.
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  // Use mock data if flag is set (useful for development/testing)
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return Promise.resolve(mockOpportunities);
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'get_opportunities' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the new backend response format
    if (data.status === 'success' && data.opportunities) {
      return data.opportunities.map(mapBackendDataToOpportunity);
    } else if (Array.isArray(data)) {
      return data.map(mapBackendDataToOpportunity);
    } else {
      // Fallback for single object responses
      return [mapBackendDataToOpportunity(data)];
    }
  } catch (error) {
    console.error('Error fetching opportunities from backend:', error);
    console.log('Falling back to mock data...');
    // Fallback to mock data if API fails
    return mockOpportunities;
  }
}

/**
 * Fetches a single funding opportunity by its ID.
 * @param id The ID of the opportunity to fetch.
 * @returns A promise that resolves to the opportunity or undefined if not found.
 */
export async function getOpportunityById(id: string): Promise<Opportunity | undefined> {
  try {
    // First, get all opportunities and find the one with matching ID
    const opportunities = await getOpportunities();
    return opportunities.find(op => op.id === id);
  } catch (error) {
    console.error('Error fetching opportunity by ID:', error);
    return undefined;
  }
}
