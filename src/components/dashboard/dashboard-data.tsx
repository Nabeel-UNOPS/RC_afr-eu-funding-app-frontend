"use client";

import { useState, useEffect } from 'react';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ApiErrorBoundary } from '@/components/ui/api-error-boundary';
import { getOpportunities } from '@/lib/enhanced-api';
import type { Opportunity } from '@/lib/data';
import type { EnhancedOpportunity } from '@/lib/enhanced-api';
import { Activity, Bookmark, Filter, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface DashboardDataProps {
  fallbackOpportunities?: EnhancedOpportunity[];
}

interface FilterState {
  country: string;
  thematicPriority: string;
  donor: string;
  subregion: string;
  fundingType: string;
  status: string;
  search: string;
}

export function DashboardData({ fallbackOpportunities = [] }: DashboardDataProps) {
  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>(fallbackOpportunities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    country: 'all',
    thematicPriority: 'all',
    donor: 'all',
    subregion: 'all',
    fundingType: 'all',
    status: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ops = await getOpportunities();
      setOpportunities(ops);
    } catch (error) {
      console.error("Failed to load opportunities:", error);
      setError("Failed to load funding opportunities");
      // Keep fallback data if available
      if (fallbackOpportunities.length === 0) {
        setOpportunities([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only load if we don't have fallback data or want to refresh
    if (fallbackOpportunities.length === 0) {
      loadData();
    }
  }, [fallbackOpportunities.length]);

  if (error && opportunities.length === 0) {
    return (
      <div className="col-span-full">
        <ApiErrorBoundary 
          error={error} 
          onRetry={loadData}
          showRetry={true}
        />
      </div>
    );
  }

  // Filter opportunities based on current filters
  const filteredOpportunities = opportunities.filter(opportunity => {
    // Search filter - check title, description, themes
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const searchMatch = 
        opportunity.title?.toLowerCase().includes(searchTerm) ||
        opportunity.summary?.toLowerCase().includes(searchTerm) ||
        opportunity.thematicPrio?.toLowerCase().includes(searchTerm) ||
        opportunity.country?.toLowerCase().includes(searchTerm) ||
        opportunity.fundingInstrument?.toLowerCase().includes(searchTerm);
      if (!searchMatch) return false;
    }
    
    // Country filter - check both country and subRegion
    if (filters.country !== 'all') {
      const countryMatch = opportunity.country?.toLowerCase().includes(filters.country.toLowerCase()) ||
                          opportunity.subRegion?.toLowerCase().includes(filters.country.toLowerCase());
      if (!countryMatch) return false;
    }
    
    // Thematic priority filter - check thematicPrio field
    if (filters.thematicPriority !== 'all') {
      const themeMatch = opportunity.thematicPrio?.toLowerCase().includes(filters.thematicPriority.toLowerCase()) ||
                        opportunity.thematic_priority?.toLowerCase().includes(filters.thematicPriority.toLowerCase());
      if (!themeMatch) return false;
    }
    
    // Donor filter - check fundingInstrument field
    if (filters.donor !== 'all') {
      const donorMatch = opportunity.fundingInstrument?.toLowerCase().includes(filters.donor.toLowerCase()) ||
                        opportunity.programme?.toLowerCase().includes(filters.donor.toLowerCase());
      if (!donorMatch) return false;
    }
    
    // Subregion filter
    if (filters.subregion !== 'all') {
      const subregionMatch = opportunity.subRegion?.toLowerCase().includes(filters.subregion.toLowerCase());
      if (!subregionMatch) return false;
    }
    
    // Funding type filter
    if (filters.fundingType !== 'all') {
      const typeMatch = opportunity.fundingType?.toLowerCase().includes(filters.fundingType.toLowerCase()) ||
                       opportunity.funding_type?.toLowerCase().includes(filters.fundingType.toLowerCase());
      if (!typeMatch) return false;
    }
    
    // Status filter
    if (filters.status !== 'all') {
      const opportunityStatus = opportunity.status?.toLowerCase();
      const filterStatus = filters.status.toLowerCase();
      
      // Handle both "upcoming" and "forthcoming" as the same status
      if (filterStatus === 'upcoming') {
        const statusMatch = opportunityStatus === 'upcoming' || opportunityStatus === 'forthcoming';
        if (!statusMatch) return false;
      } else {
        const statusMatch = opportunityStatus === filterStatus;
        if (!statusMatch) return false;
      }
    }
    
    return true;
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 9;
  const totalPages = Math.ceil(filteredOpportunities.length / opportunitiesPerPage);
  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const openOpportunities = opportunities.filter(op => op.status === 'Open');
  const upcomingOpportunities = opportunities.filter(op => op.status === 'Upcoming' || op.status === 'Forthcoming');

  // Get unique values for filter options with better data extraction
  const countries = [...new Set([
    ...opportunities.map(op => op.country).filter(Boolean),
    ...opportunities.map(op => op.subRegion).filter(Boolean)
  ])].sort();
  
  const thematicPriorities = [...new Set([
    ...opportunities.map(op => op.thematicPrio).filter(Boolean),
    ...opportunities.map(op => op.thematic_priority).filter(Boolean)
  ])].sort();
  
  const donors = [...new Set([
    ...opportunities.map(op => op.fundingInstrument).filter(Boolean),
    ...opportunities.map(op => op.programme).filter(Boolean)
  ])].sort();
  
  const subregions = [...new Set(opportunities.map(op => op.subRegion).filter(Boolean))].sort();
  
  const fundingTypes = [...new Set([
    ...opportunities.map(op => op.fundingType).filter(Boolean),
    ...opportunities.map(op => op.funding_type).filter(Boolean)
  ])].sort();

  const clearFilters = () => {
    setFilters({
      country: 'all',
      thematicPriority: 'all',
      donor: 'all',
      subregion: 'all',
      fundingType: 'all',
      status: 'all',
      search: ''
    });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length;

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Currently Open" 
          value={openOpportunities.length.toLocaleString()} 
          description="Deadline not passed • Accepting applications"
          icon={Activity}
          className="border-green-200 bg-green-50"
        />
        <StatsCard 
          title="Forthcoming" 
          value={upcomingOpportunities.length.toLocaleString()} 
          description="Opening soon • Not yet accepting applications"
          icon={Bookmark}
          className="border-blue-200 bg-blue-50"
        />
        <StatsCard 
          title="All Opportunities" 
          value={opportunities.length.toLocaleString()} 
          description="All opportunities • Including closed ones"
          icon={Activity}
          className="border-purple-200 bg-purple-50"
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities by title, description, theme, country..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end mb-4">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters ({activeFiltersCount})
              </Button>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open (Accepting Applications)</SelectItem>
                    <SelectItem value="upcoming">Forthcoming (Opening Soon)</SelectItem>
                    <SelectItem value="closed">Closed (Deadline Passed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={filters.country}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Thematic Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Thematic Priority</label>
                <Select
                  value={filters.thematicPriority}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, thematicPriority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {thematicPriorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Donor Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Donor</label>
                <Select
                  value={filters.donor}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, donor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Donors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Donors</SelectItem>
                    {donors.map(donor => (
                      <SelectItem key={donor} value={donor}>{donor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Funding Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Funding Type</label>
                <Select
                  value={filters.fundingType}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, fundingType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {fundingTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Funding Opportunities with Pagination */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Funding Opportunities</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredOpportunities.length > 0 ? (
                <>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredOpportunities.length)} of {filteredOpportunities.length} opportunities
                  {totalPages > 1 && (
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
                </>
              ) : (
                "No opportunities found"
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentOpportunities.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentOpportunities.map(opportunity => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border rounded text-center"
                      />
                      <span className="text-sm text-muted-foreground">of {totalPages}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No opportunities match your current filters.</p>
              {error && (
                <button 
                  onClick={loadData}
                  className="mt-2 text-primary underline hover:no-underline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Try again'}
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
