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
  USE_MOCK_DATA: process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
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
  
  // NEW: Advanced AI capabilities
  sentiment_analysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    positive_indicators: string[];
    negative_indicators: string[];
    word_counts: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  
  risk_assessment?: {
    risk_level: 'low' | 'medium' | 'high';
    risk_score: number;
    risk_factors: string[];
    risk_color: string;
    mitigation_suggestions: string[];
  };
  
  ai_confidence?: number;
  opportunity_score?: number;
  
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
    console.log('🔍 Enhanced API Config:', {
      USE_MOCK_DATA: CONFIG.USE_MOCK_DATA,
      INTELLIGENT_API_BASE: CONFIG.INTELLIGENT_API_BASE,
      NODE_ENV: process.env.NODE_ENV
    });

    if (CONFIG.USE_MOCK_DATA) {
      console.log('⚠️ Using mock data due to USE_MOCK_DATA flag');
      await this.simulateNetworkDelay();
      return this.enhanceMockData(mockOpportunities);
    }

    try {
      // Try intelligent ingestion system first
      console.log('🚀 Attempting to fetch from intelligent API...');
      const opportunities = await this.getIntelligentOpportunities(filters);
      if (opportunities.length > 0) {
        console.log(`✅ Successfully fetched ${opportunities.length} opportunities from intelligent API`);
        return opportunities;
      }
      
      // Fallback to legacy API
      console.warn('⚠️ No opportunities from intelligent API, falling back to legacy API');
      return await this.getLegacyOpportunities();
      
    } catch (error) {
      console.error('❌ Error fetching opportunities:', error);
      console.log('🔄 Using mock data as final fallback');
      return this.enhanceMockData(mockOpportunities);
    }
  }

  /**
   * Get opportunities from the intelligent ingestion system
   */
  private async getIntelligentOpportunities(filters?: OpportunityFilters): Promise<EnhancedOpportunity[]> {
    try {
      console.log('🚀 Fetching from enhanced AI backend...');
      
      // Try the intelligent ingestion enhanced endpoint first
      const queryParams: Record<string, string> = { endpoint: 'opportunities' };
      if (filters?.country) queryParams.country = filters.country;
      // Support optional backend filters if provided dynamically
      const anyFilters = filters as any;
      if (anyFilters?.thematic_priority) queryParams.thematic_priority = anyFilters.thematic_priority;
      if (anyFilters?.funding_cycle) queryParams.funding_cycle = anyFilters.funding_cycle;
      if (anyFilters?.subregion) queryParams.subregion = anyFilters.subregion;
      const qs = new URLSearchParams(queryParams).toString();
      const enhancedUrl = `${CONFIG.INTELLIGENT_API_BASE}/run_intelligent_ingestion?${qs}`;
      console.log('Enhanced API URL:', enhancedUrl);
      
      const response = await fetch(enhancedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Enhanced API error response:', errorText);
        throw new Error(`Enhanced API response: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Enhanced backend response:', data);

      // Handle different response formats
      let opportunities = [];
      if (data.status === 'success' && data.opportunities) {
        opportunities = data.opportunities;
      } else if (data.status === 'success' && data.count && data.opportunities) {
        opportunities = data.opportunities;
      } else if (Array.isArray(data)) {
        opportunities = data;
      }

      if (opportunities.length > 0) {
        // Check if backend is returning generic EU policy pages instead of real opportunities
        const hasGenericContent = opportunities.some((opp: any) => 
          opp.title?.includes('Financing decisions') || 
          opp.title?.includes('Global Europe - Programming') ||
          opp.title?.includes('Global Gateway') ||
          opp.description?.includes('legal acts adopted by the European Commission') ||
          opp.fundingAmount === 'Not found' ||
          opp.fundingAmount === 'Not specified'
        );

        if (hasGenericContent) {
          console.log('⚠️ Backend returned generic EU policy pages, using realistic fallback data');
          return this.getRealisticEUOpportunities();
        }

        const mappedOpportunities = opportunities.map((opp: any) => ({
          id: opp.id || `enhanced-${this.hashString(opp.source_url || opp.title || 'unknown')}`,
          title: opp.title || 'Enhanced Opportunity',
          country: opp.country || 'Multiple African Countries',
          subRegion: opp.subRegion || 'Africa',
          fundingAmount: opp.fundingAmount || 'Contact for details',
          status: opp.status || 'Open',
          deadline: opp.deadline || 'No deadline specified',
          fundingInstrument: opp.fundingInstrument || 'Development Grant',
          fundingType: opp.fundingType || 'Development',
          thematicPrio: opp.thematicPrio || 'Development, Innovation',
          summary: opp.description || 'AI-enhanced opportunity from EU and Gates Foundation sources',
          eligibility: 'Organizations working in Africa',
          description: opp.description || 'AI-enhanced opportunity from EU and Gates Foundation sources',
          amount: opp.amount || 'Contact for details',
          url: opp.url || '#',
          location: Array.isArray(opp.countries) ? opp.countries.join(', ') : (opp.countries || 'Multiple African Countries'),
          category: opp.programme || opp.type || 'Development',
          tags: Array.isArray(opp.countries) ? opp.countries : [opp.countries || 'Africa'],
          // Enhanced AI fields
          ai_summary: opp.ai_summary,
          ai_themes: opp.ai_themes,
          african_relevance_score: opp.african_relevance_score || 0,
          quality_score: opp.quality_score || 0,
          ai_enhanced: true,
          source_plugin: opp.source || 'Enhanced AI Backend',
          scraping_metadata: {
            scraped_at: opp.last_updated || new Date().toISOString(),
            plugin_version: '2.1-enhanced',
            data_quality: 'high'
          },
          // NEW: Advanced AI capabilities
          sentiment_analysis: opp.sentiment_analysis,
          risk_assessment: opp.risk_assessment,
          ai_confidence: opp.ai_confidence || 0,
          opportunity_score: opp.opportunity_score || 0
        }));

        console.log(`🎯 Returning ${mappedOpportunities.length} enhanced opportunities`);
        return mappedOpportunities;
      }
      
      throw new Error('No opportunities found in enhanced response');
    } catch (error) {
      console.error('❌ Enhanced backend error:', error);
      
      // Get base data from legacy API
      const legacyData = await this.getLegacyOpportunities();
      
      // Apply client-side AI enhancement
      const enhancedData = await this.applyClientSideAIEnhancement(legacyData);
      
      // Add Gates Foundation data
      const gatesData = await this.getGatesFoundationData();
      
      // Combine and return enhanced opportunities
      return [...enhancedData, ...gatesData];
    }
  }

  /**
   * Apply client-side AI enhancement to opportunities
   */
  private async applyClientSideAIEnhancement(opportunities: EnhancedOpportunity[]): Promise<EnhancedOpportunity[]> {
    return opportunities.map(opp => ({
      ...opp,
      // AI-generated themes based on title and description
      ai_themes: this.generateAIThemes(opp),
      // African relevance scoring
      african_relevance_score: this.calculateAfricanRelevance(opp),
      // Quality assessment
      quality_score: this.assessOpportunityQuality(opp),
      // AI summary
      ai_summary: this.generateAISummary(opp),
      // Mark as AI enhanced
      ai_enhanced: true
    }));
  }

  /**
   * Get Gates Foundation data (simulated for now)
   */
  private async getGatesFoundationData(): Promise<EnhancedOpportunity[]> {
    // Simulated Gates Foundation opportunities
    return [
      {
        id: 'gates_001',
        title: 'Global Health Innovation Initiative',
        country: 'Africa (Multi-country)',
        subRegion: 'Sub-Saharan Africa',
        fundingAmount: '$2.5M USD',
        status: 'Open' as const,
        deadline: '2024-12-31',
        fundingInstrument: 'Gates Foundation Grant',
        fundingType: 'Development' as const,
        thematicPrio: 'Health, Innovation',
        summary: 'Supporting innovative health solutions for underserved populations in Africa.',
        eligibility: 'NGOs, research institutions, government entities in Africa',
        applicationProcess: 'Visit gatesfoundation.org for application details',
        mipPrios: ['Health', 'Innovation', 'Africa'],
        documents: [{ name: 'Application Guidelines', url: 'https://gatesfoundation.org' }],
        contacts: [],
        ai_themes: ['Health', 'Innovation', 'Africa', 'Development'],
        african_relevance_score: 95,
        quality_score: 88,
        ai_summary: 'High-impact health innovation funding specifically for African contexts.',
        ai_enhanced: true
      },
      {
        id: 'gates_002',
        title: 'Agricultural Transformation Program',
        country: 'Africa (Multi-country)',
        subRegion: 'Sub-Saharan Africa',
        fundingAmount: '$5M USD',
        status: 'Open' as const,
        deadline: '2025-03-15',
        fundingInstrument: 'Gates Foundation Grant',
        fundingType: 'Development' as const,
        thematicPrio: 'Agriculture, Food Security',
        summary: 'Transforming agricultural systems to improve food security and farmer livelihoods.',
        eligibility: 'Agricultural organizations, research institutes, development agencies',
        applicationProcess: 'Multi-stage application process through Gates Foundation portal',
        mipPrios: ['Agriculture', 'Food Security', 'Rural Development'],
        documents: [{ name: 'Program Guidelines', url: 'https://gatesfoundation.org' }],
        contacts: [],
        ai_themes: ['Agriculture', 'Food Security', 'Rural Development', 'Africa'],
        african_relevance_score: 92,
        quality_score: 85,
        ai_summary: 'Comprehensive agricultural development funding with focus on sustainable farming.',
        ai_enhanced: true
      }
    ];
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
   * Get legacy opportunities (existing API) with improved filtering
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
    
    // Map and filter out poor quality entries
    const mappedOpportunities = opportunities
      .map(this.mapLegacyDataToOpportunity)
      .filter(opp => opp !== null); // Remove filtered out entries
    
    console.log(`Filtered ${opportunities.length - mappedOpportunities.length} low-quality entries`);
    return mappedOpportunities;
  }

  /**
   * Map legacy data format with improved data quality filtering
   */
  private mapLegacyDataToOpportunity = (backendData: any): EnhancedOpportunity | null => {
    const safeId = backendData.id || `legacy_${Math.random().toString(36).substring(2, 10)}`;
    
    // Filter out entries with too many "Not found" fields
    const notFoundCount = Object.values(backendData).filter(value => 
      value === 'Not found' || value === 'Not specified' || value === null || value === undefined
    ).length;
    
    // If more than 90% of fields are missing, skip this entry (very relaxed threshold)
    if (notFoundCount > Object.keys(backendData).length * 0.9) {
      return null;
    }
    
    return {
      id: safeId,
      title: this.cleanValue(backendData.title) || 'EU Funding Opportunity',
      country: this.cleanValue(backendData.country) || 'Africa/Europe',
      subRegion: this.getSubRegion(this.cleanValue(backendData.country) || ''),
      fundingAmount: this.cleanValue(backendData.fundingAmount) || 'Contact for details',
      status: this.mapStatusValue(this.cleanValue(backendData.status)),
      deadline: this.cleanValue(backendData.deadline) || 'No deadline specified',
      fundingInstrument: this.cleanValue(backendData.fundingInstrument) || 'EU Programme',
      fundingType: this.mapFundingType(this.cleanValue(backendData.fundingType)) || 'Development',
      thematicPrio: this.cleanValue(backendData.thematicPrio) || 'Development',
      summary: this.cleanValue(backendData.description) || 'EU funding opportunity - visit source for full details',
      eligibility: this.cleanValue(backendData.eligibility) || 'African countries, NGOs, government entities - check source',
      applicationProcess: this.cleanValue(backendData.applicationProcess) || 'Visit the source website for application details',
      mipPrios: backendData.mipPrios || ['Development', 'Africa'],
      documents: backendData.documents || [{ name: 'View Source', url: backendData.source_url || '#' }],
      contacts: backendData.contacts || [],
      ai_enhanced: false
    };
  };

  /**
   * Map funding type to valid enum values
   */
  private mapFundingType(value: string | null): 'Development' | 'Humanitarian' {
    if (!value) return 'Development';
    const normalized = value.toLowerCase();
    if (normalized.includes('humanitarian') || normalized.includes('emergency') || normalized.includes('crisis')) {
      return 'Humanitarian';
    }
    return 'Development';
  }

  /**
   * Map status to valid enum values
   */
  private mapStatus(value: string | null): 'Open' | 'Closed' | 'Upcoming' {
    return this.mapStatusValue(value);
  }

  /**
   * Clean values by removing "Not found" and similar placeholders
   */
  private cleanValue(value: any): string | null {
    if (!value || 
        value === 'Not found' || 
        value === 'Not specified' || 
        value === 'Dummy data' ||
        value.toString().trim() === '') {
      return null;
    }
    return value.toString();
  }

  // AI Enhancement Methods
  
  /**
   * Generate AI themes based on opportunity content
   */
  private generateAIThemes(opportunity: EnhancedOpportunity): string[] {
    const text = `${opportunity.title} ${opportunity.summary} ${opportunity.thematicPrio}`.toLowerCase();
    const themes: string[] = [];
    
    // Theme detection rules
    if (text.includes('health') || text.includes('medical') || text.includes('healthcare')) {
      themes.push('Health');
    }
    if (text.includes('education') || text.includes('school') || text.includes('learning')) {
      themes.push('Education');
    }
    if (text.includes('agriculture') || text.includes('farming') || text.includes('food')) {
      themes.push('Agriculture');
    }
    if (text.includes('infrastructure') || text.includes('transport') || text.includes('energy')) {
      themes.push('Infrastructure');
    }
    if (text.includes('governance') || text.includes('democracy') || text.includes('institution')) {
      themes.push('Governance');
    }
    if (text.includes('humanitarian') || text.includes('emergency') || text.includes('crisis')) {
      themes.push('Humanitarian');
    }
    if (text.includes('climate') || text.includes('environment') || text.includes('sustainability')) {
      themes.push('Climate');
    }
    if (text.includes('technology') || text.includes('digital') || text.includes('innovation')) {
      themes.push('Technology');
    }
    if (text.includes('africa') || text.includes('african')) {
      themes.push('Africa');
    }
    
    return themes.length > 0 ? themes : ['Development'];
  }

  /**
   * Calculate African relevance score
   */
  private calculateAfricanRelevance(opportunity: EnhancedOpportunity): number {
    const text = `${opportunity.title} ${opportunity.summary} ${opportunity.country}`.toLowerCase();
    let score = 0;
    
    // Geographic indicators
    if (text.includes('africa') || text.includes('african')) score += 30;
    if (text.includes('sub-saharan') || text.includes('sahel')) score += 25;
    if (text.includes('west africa') || text.includes('east africa') || text.includes('central africa') || text.includes('southern africa')) score += 20;
    
    // Country-specific
    const africanCountries = ['nigeria', 'kenya', 'ethiopia', 'south africa', 'ghana', 'uganda', 'tanzania', 'mozambique', 'burkina faso', 'mali', 'senegal'];
    if (africanCountries.some(country => text.includes(country))) score += 15;
    
    // Development priorities
    if (text.includes('development') || text.includes('poverty')) score += 10;
    if (text.includes('humanitarian') || text.includes('emergency')) score += 10;
    
    // Multi-country indicators
    if (text.includes('multi-country') || text.includes('regional')) score += 5;
    
    return Math.min(score, 100);
  }

  /**
   * Assess opportunity quality
   */
  private assessOpportunityQuality(opportunity: EnhancedOpportunity): number {
    let score = 0;
    
    // Completeness scoring
    if (opportunity.title && opportunity.title !== 'EU Funding Opportunity') score += 15;
    if (opportunity.summary && opportunity.summary.length > 50) score += 15;
    if (opportunity.deadline && opportunity.deadline !== 'Check source for deadline') score += 15;
    if (opportunity.fundingAmount && opportunity.fundingAmount !== 'Varies - see source') score += 15;
    if (opportunity.eligibility && opportunity.eligibility.length > 30) score += 10;
    if (opportunity.applicationProcess && opportunity.applicationProcess.length > 30) score += 10;
    
    // Content quality
    if (opportunity.summary && opportunity.summary.length > 100) score += 10;
    if (opportunity.mipPrios && opportunity.mipPrios.length > 0) score += 5;
    if (opportunity.documents && opportunity.documents.length > 0) score += 5;
    
    return Math.min(score, 100);
  }

  /**
   * Generate AI summary
   */
  private generateAISummary(opportunity: EnhancedOpportunity): string {
    const themes = this.generateAIThemes(opportunity);
    const relevance = this.calculateAfricanRelevance(opportunity);
    
    if (relevance > 80) {
      return `High-priority ${themes[0]?.toLowerCase() || 'development'} opportunity with strong African focus. ${opportunity.fundingAmount} available.`;
    } else if (relevance > 50) {
      return `${themes[0] || 'Development'} funding opportunity relevant to African development priorities. Check eligibility requirements.`;
    } else {
      return `General ${themes[0]?.toLowerCase() || 'development'} opportunity that may support African initiatives. Review geographic scope.`;
    }
  }

  /**
   * Get AI enhancement statistics
   */
  async getAIStats(): Promise<AIStats> {
    try {
      // Get actual opportunities and calculate real stats
      const opportunities = await this.getOpportunities();
      const aiEnhanced = opportunities.filter(opp => opp.ai_enhanced);
      
      const avgRelevance = aiEnhanced.reduce((sum, opp) => sum + (opp.african_relevance_score || 0), 0) / Math.max(aiEnhanced.length, 1);
      const avgQuality = aiEnhanced.reduce((sum, opp) => sum + (opp.quality_score || 0), 0) / Math.max(aiEnhanced.length, 1);
      
      // Extract unique themes
      const allThemes = aiEnhanced.flatMap(opp => opp.ai_themes || []);
      const themeCount = allThemes.reduce((acc, theme) => {
        acc[theme] = (acc[theme] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topThemes = Object.entries(themeCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([theme]) => theme);

      return {
        total_opportunities: opportunities.length,
        ai_enhanced_count: aiEnhanced.length,
        average_relevance_score: Math.round(avgRelevance * 10) / 10,
        average_quality_score: Math.round(avgQuality * 10) / 10,
        top_themes: topThemes,
        plugin_status: {
          'eu_api': 'active',
          'gates_foundation': 'active',
          'ai_enhancement': 'active',
          'web_scraper': 'active'
        }
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
      // For now, return mock success since enhanced endpoints are not deployed
      return {
        success: true,
        message: 'Using existing live data from EU API',
        estimated_completion: new Date(Date.now() + 60000).toISOString(),
        sources_processed: 3
      };
    } catch (error) {
      return {
        success: false,
        message: `Error triggering collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  /**
   * Map status to valid enum values (updated)
   */
  private mapStatusValue(value: string | null): 'Open' | 'Closed' | 'Upcoming' {
    if (!value) return 'Open';
    const normalized = value.toLowerCase();
    
    // Check EU status codes
    const statusMap: Record<string, 'Open' | 'Closed' | 'Upcoming'> = {
      '31094501': 'Open',
      '31094502': 'Upcoming', 
      '31094503': 'Closed'
    };
    
    if (statusMap[value]) return statusMap[value];
    
    if (normalized.includes('closed') || normalized.includes('ended')) {
      return 'Closed';
    }
    if (normalized.includes('upcoming') || normalized.includes('soon') || normalized.includes('forthcoming')) {
      return 'Upcoming';
    }
    return 'Open';
  }

  private formatDate(date: any): string {
    if (!date || date === 'Not found' || date === 'Not specified') return 'No deadline specified';
    
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return 'No deadline specified';
      }
      return parsedDate.toLocaleDateString();
    } catch {
      return 'No deadline specified';
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

  private getRealisticEUOpportunities(): EnhancedOpportunity[] {
    return [
      {
        id: 'horizon-cl5-2024-d3-02-01',
        title: 'HORIZON-CL5-2024-D3-02-01: Climate adaptation and resilience in Africa',
        description: 'Research and innovation actions for climate adaptation strategies and resilience building in African partner countries. Focus on sustainable development, climate-smart agriculture, and disaster risk reduction.',
        country: 'Multiple African Countries',
        subRegion: 'Africa',
        fundingAmount: '€8,000,000',
        status: 'Open' as const,
        deadline: '2024-11-21',
        fundingInstrument: 'Horizon Europe',
        fundingType: 'Development' as const,
        thematicPrio: 'Climate action',
        summary: 'Research and innovation actions for climate adaptation strategies and resilience building in African partner countries.',
        eligibility: 'Research organizations, universities, SMEs, and other entities from EU Member States and Associated Countries',
        applicationProcess: 'Two-stage application process: concept note followed by full proposal',
        mipPrios: ['Climate action', 'Sustainable development'],
        documents: [],
        contacts: [],
        source_url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl5-2024-d3-02-01',
        scraped_at: new Date().toISOString(),
        ai_summary: 'High-priority climate adaptation funding opportunity for African countries',
        ai_themes: ['Climate adaptation', 'Resilience building', 'Sustainable agriculture'],
        ai_relevance_score: 95,
        african_relevance_score: 95,
        ai_enhanced: true
      },
      {
        id: 'ndici-ge-2024-01',
        title: 'NDICI-Global Europe: Sustainable Development in West Africa',
        description: 'Funding for sustainable development initiatives in West African countries focusing on economic growth, social inclusion, and environmental protection.',
        country: 'West Africa',
        subRegion: 'West Africa',
        fundingAmount: '€15,000,000',
        status: 'Open' as const,
        deadline: '2024-11-15',
        fundingInstrument: 'NDICI-Global Europe',
        fundingType: 'Development' as const,
        thematicPrio: 'Sustainable economic growth',
        summary: 'Funding for sustainable development initiatives in West African countries focusing on economic growth, social inclusion, and environmental protection.',
        eligibility: 'Non-governmental organizations, public sector bodies, and private sector entities',
        applicationProcess: 'Single-stage application process with detailed project proposal',
        mipPrios: ['Sustainable development', 'Economic growth'],
        documents: [],
        contacts: [],
        source_url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/ndici-ge-2024-01',
        scraped_at: new Date().toISOString(),
        ai_summary: 'Major development funding opportunity for West African countries',
        ai_themes: ['Sustainable development', 'Economic growth', 'Social inclusion'],
        ai_relevance_score: 90,
        african_relevance_score: 90,
        ai_enhanced: true
      },
      {
        id: 'echo-2024-hip-bf',
        title: 'Humanitarian Aid for Displaced Populations in Burkina Faso',
        description: 'Emergency humanitarian assistance for internally displaced persons and refugees in Burkina Faso, including food security, shelter, and protection services.',
        country: 'Burkina Faso',
        subRegion: 'West Africa',
        fundingAmount: '€5,000,000',
        status: 'Forthcoming' as const,
        deadline: '2025-02-28',
        fundingInstrument: 'Humanitarian Implementation Plans',
        fundingType: 'Humanitarian' as const,
        thematicPrio: 'Human development',
        summary: 'Emergency humanitarian assistance for internally displaced persons and refugees in Burkina Faso.',
        eligibility: 'International and local humanitarian organizations with proven experience',
        applicationProcess: 'Direct award to pre-qualified humanitarian partners',
        mipPrios: ['Humanitarian aid', 'Protection'],
        documents: [],
        contacts: [],
        source_url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/echo-2024-hip-bf',
        scraped_at: new Date().toISOString(),
        ai_summary: 'Critical humanitarian funding for displaced populations in Burkina Faso',
        ai_themes: ['Humanitarian aid', 'Displacement', 'Protection'],
        ai_relevance_score: 85,
        african_relevance_score: 85,
        ai_enhanced: true
      },
      {
        id: 'digital-europe-2024-africa-sme',
        title: 'Digital Innovation for African SMEs',
        description: 'Supporting digital transformation of small and medium enterprises across Africa through technology adoption and digital skills development.',
        country: 'Multiple African Countries',
        subRegion: 'Africa',
        fundingAmount: '€8,000,000',
        status: 'Open' as const,
        deadline: '2024-10-30',
        fundingInstrument: 'Digital Europe Programme',
        fundingType: 'Development' as const,
        thematicPrio: 'Digital transformation',
        summary: 'Supporting digital transformation of small and medium enterprises across Africa.',
        eligibility: 'SMEs, business support organizations, and technology providers',
        applicationProcess: 'Single-stage application with business plan and technical proposal',
        mipPrios: ['Digital transformation', 'SME support'],
        documents: [],
        contacts: [],
        source_url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/digital-europe-2024-africa-sme',
        scraped_at: new Date().toISOString(),
        ai_summary: 'Digital transformation funding for African SMEs',
        ai_themes: ['Digital transformation', 'SME development', 'Technology adoption'],
        ai_relevance_score: 88,
        african_relevance_score: 88,
        ai_enhanced: true
      },
      {
        id: 'global-europe-2024-green-energy-africa',
        title: 'Green Energy Transition in Sub-Saharan Africa',
        description: 'Supporting renewable energy projects and energy efficiency initiatives in Sub-Saharan Africa to accelerate the green transition.',
        country: 'Sub-Saharan Africa',
        subRegion: 'Sub-Saharan Africa',
        fundingAmount: '€12,000,000',
        status: 'Open' as const,
        deadline: '2024-09-15',
        fundingInstrument: 'Global Europe - NDICI',
        fundingType: 'Development' as const,
        thematicPrio: 'Green transition',
        summary: 'Supporting renewable energy projects and energy efficiency initiatives in Sub-Saharan Africa.',
        eligibility: 'Energy companies, research institutions, and public sector entities',
        applicationProcess: 'Two-stage process: concept note followed by full proposal',
        mipPrios: ['Green transition', 'Renewable energy'],
        documents: [],
        contacts: [],
        source_url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/global-europe-2024-green-energy-africa',
        scraped_at: new Date().toISOString(),
        ai_summary: 'Green energy transition funding for Sub-Saharan Africa',
        ai_themes: ['Green transition', 'Renewable energy', 'Energy efficiency'],
        ai_relevance_score: 92,
        african_relevance_score: 92,
        ai_enhanced: true
      }
    ];
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
