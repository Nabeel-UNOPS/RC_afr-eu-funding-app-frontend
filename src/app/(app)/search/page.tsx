"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { EnhancedOpportunityCard } from '@/components/opportunities/enhanced-opportunity-card';
import { OpportunityFiltersComponent, type OpportunityFilters } from '@/components/opportunities/opportunity-filters';
import { getOpportunities, type EnhancedOpportunity } from '@/lib/enhanced-api';
import { Search as SearchIcon, RefreshCw } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiErrorBoundary } from '@/components/ui/api-error-boundary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function OpportunitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 mt-2 w-1/2" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-1/3" />
      </CardFooter>
    </Card>
  );
}

export default function SearchPage() {
  const [allOpportunities, setAllOpportunities] = useState<EnhancedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useEnhancedView, setUseEnhancedView] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<OpportunityFilters>({});

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading opportunities from enhanced API...");
      
      // Use the enhanced API function with proper error handling
      const opportunities = await getOpportunities();
      console.log("Loaded opportunities:", opportunities.length);
      
      // Always set opportunities, even if empty - the API should provide fallback data
      setAllOpportunities(opportunities);
      
    } catch (error) {
      console.error("Failed to load opportunities:", error);
      // Don't set error state - let the API handle fallbacks
      // The getOpportunities function should always return data (mock or real)
      setAllOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    let results = allOpportunities;

    // Text search
    if (filters.search) {
      const lowercasedTerm = filters.search.toLowerCase();
      results = results.filter(op =>
        op.title.toLowerCase().includes(lowercasedTerm) ||
        op.summary.toLowerCase().includes(lowercasedTerm) ||
        (op.ai_summary && op.ai_summary.toLowerCase().includes(lowercasedTerm)) ||
        (op.ai_themes && op.ai_themes.some(theme => theme.toLowerCase().includes(lowercasedTerm))) ||
        op.country.toLowerCase().includes(lowercasedTerm) ||
        op.fundingType.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Country filter
    if (filters.country) {
      results = results.filter(op => op.country === filters.country);
    }

    // Funding type filter
    if (filters.funding_type && filters.funding_type !== 'All') {
      results = results.filter(op => op.fundingType === filters.funding_type);
    }

    // Subregion filter
    if (filters.subregion) {
      results = results.filter(op => op.subRegion === filters.subregion);
    }

    // Thematic priority filter
    if (filters.thematic_priority) {
      results = results.filter(op => 
        op.thematicPrio.toLowerCase().includes(filters.thematic_priority!.toLowerCase())
      );
    }

    // Sort by AI relevance score if available, otherwise by title
    return results.sort((a, b) => {
      if (a.african_relevance_score && b.african_relevance_score) {
        return b.african_relevance_score - a.african_relevance_score;
      }
      return a.title.localeCompare(b.title);
    });
  }, [allOpportunities, filters]);

  const handleSearch = () => {
    loadData();
  };

  const handleClear = () => {
    setFilters({});
    loadData();
  };


  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
            Search Opportunities
          </h1>
          <Badge variant="secondary" className="hidden md:flex">
            {filteredOpportunities.length} results
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
          onClick={loadData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8">
        {/* Filter Component */}
        <OpportunityFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
          opportunities={allOpportunities}
        />

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <OpportunitySkeleton key={i} />
            ))}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <SearchIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No opportunities found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search criteria or reset all filters.
                </p>
              </div>
              <Button onClick={handleClear} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              useEnhancedView ? (
                <EnhancedOpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  showAIInsights={true}
                />
              ) : (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
