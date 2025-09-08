/**
 * Enhanced API Client for AFR-EU Funding Gateway
 * 
 * This client integrates with the new intelligent ingestion backend system
 * that includes AI-powered enhancement, EU API integration, and plugin architecture.
 */

import { opportunities as mockOpportunities, type Opportunity } from './data';

// Enhanced configuration for the new backend system
const CONFIG = {
  // Main intelligent ingestion endpoints
  INTELLIGENT_API_BASE: process.env.NEXT_PUBLIC_INTELLIGENT_API_URL || 'https://us-central1-unops-cameron.cloudfunctions.net',
  
  // Legacy API fallback
  LEGACY_API_BASE: process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-unops-cameron.cloudfunctions.net/api-function',
  
  // Feature flags
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  USE_AI_ENHANCED_DATA: process.env.NEXT_PUBLIC_USE_AI_ENHANCED === 'true',
  
  // Timeouts and retry settings
  REQUEST_TIMEOUT: 15000,
  MAX_RETRIES: 3
};

// Enhanced opportunity interface to support AI-enhanced data
export interface EnhancedOpportunity extends Opportunity {
  // AI Enhancement fields
  ai_summary?: string;
  ai_themes?: string[];
  african_relevance_score?: number;
  quality_score?: number;
  ai_enhanced?: boolean;
  
  // EU API specific fields
  call_id?: string;
  programme?: string;
  framework_programme?: string;
  status_code?: string;
  budget?: string;
  
  // Plugin system fields
  source_plugin?: string;
  scraping_metadata?: {
    scraped_at: string;
    plugin_version: string;
    data_quality: string;
  };
}

/**
 * Enhanced API client class with full backend integration
 */
class EnhancedFundingAPI {
  private baseUrl: string;
  private requestTimeout: number;

  constructor() {
    this.baseUrl = CONFIG.INTELLIGENT_API_BASE;
    this.requestTimeout = CONFIG.REQUEST_TIMEOUT;
  }

  /**
   * Get all funding opportunities with AI enhancement
   */
  async getOpportunities(filters?: OpportunityFilters): Promise<EnhancedOpportunity[]> {
    if (CONFIG.USE_MOCK_DATA) {
      await this.simulateNetworkDelay();
      return this.enhanceMockData(mockOpportunities);
    }

    try {
      // Try intelligent ingestion system first
      const opportunities = await this.getIntelligentOpportunities(filters);
      if (opportunities.length > 0) {
        return opportunities;
      }
      
      // Fallback to legacy API
      console.warn('Falling back to legacy API');
      return await this.getLegacyOpportunities();
      
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      console.log('Using mock data as final fallback');
      return this.enhanceMockData(mockOpportunities);
    }
  }

  /**
   * Get opportunities from the intelligent ingestion system
   */
  private async getIntelligentOpportunities(filters?: OpportunityFilters): Promise<EnhancedOpportunity[]> {
    const endpoints = [
      '/run_plugin_scrapers',  // Get fresh data from all plugins
      '/enhance_opportunities_ai',  // Get AI-enhanced opportunities
      '/get_automation_status'  // Check if we have recent data
    ];

    // First, check if we have recent data
    const statusResponse = await this.makeRequest('/get_automation_status');
    const hasRecentData = this.hasRecentData(statusResponse);

    if (!hasRecentData) {
      // Trigger fresh data collection
      console.log('Triggering fresh data collection...');
      await this.makeRequest('/run_plugin_scrapers', 'POST');
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Get AI-enhanced opportunities
    const enhancedData = await this.makeRequest('/enhance_opportunities_ai', 'POST');
    
    if (enhancedData && enhancedData.enhanced_opportunities) {
      return enhancedData.enhanced_opportunities.map(this.mapIntelligentDataToOpportunity);
    }

    // If no enhanced data, try plugin scrapers directly
    const pluginData = await this.makeRequest('/run_plugin_scrapers', 'POST');
    
    if (pluginData && pluginData.results) {
      return pluginData.results.map(this.mapIntelligentDataToOpportunity);
    }

    return [];
  }

  /**
   * Map intelligent backend data to frontend opportunity format
   */
  private mapIntelligentDataToOpportunity = (backendData: any): EnhancedOpportunity => {
    // Generate safe ID
    const safeId = backendData.id || 
                   backendData.call_id || 
                   `opp_${Math.abs(this.hashString(backendData.title || backendData.source_url || '')).toString()}`;

    return {
      id: safeId,
      title: backendData.title || 'Funding Opportunity',
      country: this.extractCountry(backendData),
      subRegion: this.getSubRegion(this.extractCountry(backendData)),
      fundingAmount: this.formatFundingAmount(backendData),
      status: this.mapStatus(backendData.status || backendData.status_code),
      deadline: this.formatDate(backendData.deadline || backendData.submission_deadline),
      fundingInstrument: backendData.funding_instrument || backendData.funding_type || 'EU Programme',
      fundingType: backendData.funding_type || 'Development Funding',
      thematicPrio: this.extractThemes(backendData),
      summary: backendData.ai_summary || backendData.description || 'No description available',
      eligibility: backendData.eligibility || 'Check source for eligibility requirements',
      applicationProcess: backendData.application_process || 'Please visit the source website for application details',
      mipPrios: backendData.ai_themes || [],
      documents: this.extractDocuments(backendData),
      contacts: backendData.contacts || [],
      
      // Enhanced AI fields
      ai_summary: backendData.ai_summary,
      ai_themes: backendData.ai_themes || backendData.themes,
      african_relevance_score: backendData.african_relevance_score,
      quality_score: backendData.quality_score,
      ai_enhanced: !!backendData.ai_enhanced,
      
      // EU API fields
      call_id: backendData.call_id || backendData.identifier,
      programme: backendData.programme || backendData.framework_programme,
      framework_programme: backendData.framework_programme,
      status_code: backendData.status_code,
      budget: backendData.budget,
      
      // Plugin metadata
      source_plugin: backendData.source_plugin || backendData.plugin_name,
      scraping_metadata: {
        scraped_at: backendData.scraped_at || new Date().toISOString(),
        plugin_version: backendData.plugin_version || '1.0.0',
        data_quality: this.assessDataQuality(backendData)
      }
    };
  };

  /**
   * Get legacy opportunities (existing API)
   */
  private async getLegacyOpportunities(): Promise<EnhancedOpportunity[]> {
    const response = await fetch(CONFIG.LEGACY_API_BASE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(this.requestTimeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const opportunities = Array.isArray(data) ? data : [data];
    
    return opportunities.map(this.mapLegacyDataToOpportunity);
  }

  /**
   * Map legacy data format
   */
  private mapLegacyDataToOpportunity = (backendData: any): EnhancedOpportunity => {
    const safeId = backendData.id || `legacy_${Math.random().toString(36).substring(2, 10)}`;
    
    return {
      id: safeId,
      title: backendData.title || 'Untitled Opportunity',
      country: backendData.country || 'Not specified',
      subRegion: this.getSubRegion(backendData.country || ''),
      fundingAmount: backendData.fundingAmount || 'Not specified',
      status: backendData.status || 'Open',
      deadline: backendData.deadline || 'Not specified',
      fundingInstrument: backendData.fundingInstrument || 'Not specified',
      fundingType: backendData.fundingType || 'Development',
      thematicPrio: backendData.thematicPrio || 'Not specified',
      summary: backendData.description || 'No description available',
      eligibility: backendData.eligibility || 'No eligibility information available',
      applicationProcess: backendData.applicationProcess || 'Please check the source website',
      mipPrios: backendData.mipPrios || [],
      documents: backendData.documents || [{ name: 'View Source', url: backendData.source_url || '#' }],
      contacts: backendData.contacts || [],
      ai_enhanced: false
    };
  };

  /**
   * Get AI enhancement statistics
   */
  async getAIStats(): Promise<AIStats> {
    try {
      const response = await this.makeRequest('/get_ai_enhancement_demo');
      return {
        total_opportunities: response.total_processed || 0,
        ai_enhanced_count: response.ai_enhanced_count || 0,
        average_relevance_score: response.average_african_relevance || 0,
        average_quality_score: response.average_quality_score || 0,
        top_themes: response.top_themes || [],
        plugin_status: response.plugin_status || {}
      };
    } catch (error) {
      console.error('Error fetching AI stats:', error);
      return this.getDefaultAIStats();
    }
  }

  /**
   * Trigger fresh data collection
   */
  async triggerDataCollection(): Promise<CollectionStatus> {
    try {
      const response = await this.makeRequest('/run_automation_pipeline', 'POST');
      return {
        success: response.success || false,
        message: response.message || 'Data collection initiated',
        estimated_completion: response.estimated_completion,
        sources_processed: response.sources_processed || 0
      };
    } catch (error) {
      return {
        success: false,
        message: `Error triggering collection: ${error.message}`,
        sources_processed: 0
      };
    }
  }

  // Helper methods
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(this.requestTimeout)
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private hasRecentData(statusResponse: any): boolean {
    if (!statusResponse || !statusResponse.last_run) return false;
    
    const lastRun = new Date(statusResponse.last_run);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return lastRun > oneHourAgo;
  }

  private extractCountry(data: any): string {
    return data.country || 
           data.target_countries?.[0] || 
           data.eligible_countries?.[0] || 
           data.geographical_focus || 
           'Multi-country';
  }

  private formatFundingAmount(data: any): string {
    if (data.budget) return data.budget;
    if (data.funding_amount) return data.funding_amount;
    if (data.total_budget) return `€${data.total_budget.toLocaleString()}`;
    return 'Amount not specified';
  }

  private mapStatus(status: any): string {
    if (!status) return 'Open';
    
    const statusMap = {
      '31094501': 'Open',
      '31094502': 'Forthcoming', 
      '31094503': 'Closed'
    };
    
    return statusMap[status] || status || 'Open';
  }

  private formatDate(date: any): string {
    if (!date) return 'No deadline specified';
    
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date.toString();
    }
  }

  private extractThemes(data: any): string {
    if (data.ai_themes?.length > 0) {
      return data.ai_themes.join(', ');
    }
    if (data.themes?.length > 0) {
      return data.themes.join(', ');
    }
    if (data.thematic_priority) {
      return data.thematic_priority;
    }
    return 'General Development';
  }

  private extractDocuments(data: any): Array<{name: string, url: string}> {
    if (data.documents?.length > 0) return data.documents;
    
    const docs = [];
    if (data.source_url) {
      docs.push({ name: 'View Source', url: data.source_url });
    }
    if (data.call_url) {
      docs.push({ name: 'Call Details', url: data.call_url });
    }
    
    return docs.length > 0 ? docs : [{ name: 'No documents available', url: '#' }];
  }

  private assessDataQuality(data: any): string {
    let score = 0;
    if (data.title) score += 1;
    if (data.description || data.ai_summary) score += 1;
    if (data.deadline) score += 1;
    if (data.budget || data.funding_amount) score += 1;
    if (data.ai_enhanced) score += 1;
    
    if (score >= 4) return 'High';
    if (score >= 2) return 'Medium';
    return 'Basic';
  }

  private getSubRegion(country: string): string {
    const countryLower = country.toLowerCase();
    
    // Enhanced region mapping
    const regions = {
      'West Africa': ['benin', 'burkina faso', 'cape verde', 'cote d\'ivoire', 'ivory coast', 'gambia', 'ghana', 'guinea', 'guinea-bissau', 'liberia', 'mali', 'mauritania', 'niger', 'nigeria', 'senegal', 'sierra leone', 'togo'],
      'East Africa': ['burundi', 'comoros', 'djibouti', 'eritrea', 'ethiopia', 'kenya', 'madagascar', 'malawi', 'mauritius', 'mozambique', 'rwanda', 'seychelles', 'somalia', 'south sudan', 'sudan', 'tanzania', 'uganda', 'zambia', 'zimbabwe'],
      'Southern Africa': ['angola', 'botswana', 'eswatini', 'lesotho', 'namibia', 'south africa', 'swaziland'],
      'Central Africa': ['cameroon', 'central african republic', 'chad', 'democratic republic of congo', 'drc', 'equatorial guinea', 'gabon', 'republic of congo', 'sao tome and principe'],
      'North Africa': ['algeria', 'egypt', 'libya', 'morocco', 'tunisia']
    };

    for (const [region, countries] of Object.entries(regions)) {
      if (countries.some(c => countryLower.includes(c))) {
        return region;
      }
    }
    
    return country.includes('EU') || country.includes('Europe') ? 'Europe' : 'Africa';
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash;
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private enhanceMockData(opportunities: Opportunity[]): EnhancedOpportunity[] {
    return opportunities.map(opp => ({
      ...opp,
      ai_enhanced: false,
      african_relevance_score: Math.floor(Math.random() * 40) + 60, // 60-100
      quality_score: Math.floor(Math.random() * 30) + 70 // 70-100
    }));
  }

  private getDefaultAIStats(): AIStats {
    return {
      total_opportunities: 0,
      ai_enhanced_count: 0,
      average_relevance_score: 0,
      average_quality_score: 0,
      top_themes: [],
      plugin_status: {}
    };
  }
}

// Type definitions
export interface OpportunityFilters {
  status?: string;
  funding_type?: string;
  country?: string;
  deadline_after?: string;
  deadline_before?: string;
  min_relevance_score?: number;
  ai_enhanced_only?: boolean;
}

export interface AIStats {
  total_opportunities: number;
  ai_enhanced_count: number;
  average_relevance_score: number;
  average_quality_score: number;
  top_themes: string[];
  plugin_status: Record<string, any>;
}

export interface CollectionStatus {
  success: boolean;
  message: string;
  estimated_completion?: string;
  sources_processed: number;
}

// Export singleton instance
export const api = new EnhancedFundingAPI();

// Legacy exports for backward compatibility
export async function getOpportunities(): Promise<EnhancedOpportunity[]> {
  return api.getOpportunities();
}

export async function getOpportunityById(id: string): Promise<EnhancedOpportunity | undefined> {
  const opportunities = await api.getOpportunities();
  return opportunities.find(op => op.id === id);
}
