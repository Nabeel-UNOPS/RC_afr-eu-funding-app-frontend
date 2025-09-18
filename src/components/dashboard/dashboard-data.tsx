"use client";

import { useState, useEffect } from 'react';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ApiErrorBoundary } from '@/components/ui/api-error-boundary';
import { getOpportunities } from '@/lib/enhanced-api';
import type { Opportunity } from '@/lib/data';
import type { EnhancedOpportunity } from '@/lib/enhanced-api';
import { Activity, Bookmark, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface DashboardDataProps {
  fallbackOpportunities?: EnhancedOpportunity[];
}

interface FilterState {
  country: string;
  thematicPriority: string;
  fundingCycle: string;
  subregion: string;
  fundingType: string;
}

export function DashboardData({ fallbackOpportunities = [] }: DashboardDataProps) {
  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>(fallbackOpportunities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    country: 'all',
    thematicPriority: 'all',
    fundingCycle: 'all',
    subregion: 'all',
    fundingType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

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
    if (filters.country !== 'all' && !opportunity.country?.toLowerCase().includes(filters.country.toLowerCase())) {
      return false;
    }
    if (filters.thematicPriority !== 'all' && !opportunity.thematic_priority?.toLowerCase().includes(filters.thematicPriority.toLowerCase())) {
      return false;
    }
    if (filters.fundingCycle !== 'all' && !opportunity.programme?.toLowerCase().includes(filters.fundingCycle.toLowerCase())) {
      return false;
    }
    if (filters.subregion !== 'all' && !opportunity.subRegion?.toLowerCase().includes(filters.subregion.toLowerCase())) {
      return false;
    }
    if (filters.fundingType !== 'all' && !opportunity.funding_type?.toLowerCase().includes(filters.fundingType.toLowerCase())) {
      return false;
    }
    return true;
  });

  const openOpportunities = filteredOpportunities.filter(op => op.status === 'Open');
  const upcomingOpportunities = filteredOpportunities.filter(op => op.status === 'Upcoming');
  const recentOpportunities = filteredOpportunities.slice(0, 6);

  // Get unique values for filter options
  const countries = [...new Set(opportunities.map(op => op.country).filter(Boolean))];
  const thematicPriorities = [...new Set(opportunities.map(op => op.thematic_priority).filter(Boolean))];
  const programmes = [...new Set(opportunities.map(op => op.programme).filter(Boolean))];
  const subregions = [...new Set(opportunities.map(op => op.subRegion).filter(Boolean))];
  const fundingTypes = [...new Set(opportunities.map(op => op.funding_type).filter(Boolean))];

  const clearFilters = () => {
    setFilters({
      country: 'all',
      thematicPriority: 'all',
      fundingCycle: 'all',
      subregion: 'all',
      fundingType: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all').length;

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Open Opportunities" 
          value={openOpportunities.length.toString()} 
          description="Currently accepting applications"
          icon={Activity}
        />
        <StatsCard 
          title="Upcoming" 
          value={upcomingOpportunities.length.toString()} 
          description="Opening soon"
          icon={Bookmark}
        />
        <StatsCard 
          title="Total Available" 
          value={opportunities.length.toString()} 
          description="All funding opportunities"
          icon={Activity}
        />
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} active</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

              {/* Funding Cycle Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Funding Cycle</label>
                <Select
                  value={filters.fundingCycle}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, fundingCycle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Cycles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cycles</SelectItem>
                    {programmes.map(programme => (
                      <SelectItem key={programme} value={programme}>{programme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subregion Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subregion</label>
                <Select
                  value={filters.subregion}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, subregion: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Subregions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subregions</SelectItem>
                    {subregions.map(subregion => (
                      <SelectItem key={subregion} value={subregion}>{subregion}</SelectItem>
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
        )}
      </Card>

      {/* Recent Opportunities */}
      <div className="space-y-4">
        {recentOpportunities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recentOpportunities.map(opportunity => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No recent opportunities available.</p>
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
      </div>
    </>
  );
}
