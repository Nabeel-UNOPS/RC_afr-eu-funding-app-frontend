"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { EnhancedOpportunityCard } from '@/components/opportunities/enhanced-opportunity-card';
import type { Opportunity } from '@/lib/data';
import { getOpportunities, type EnhancedOpportunity } from '@/lib/enhanced-api';
import { Search as SearchIcon, X, Brain, Filter, Sparkles } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiErrorBoundary } from '@/components/ui/api-error-boundary';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedFundingType, setSelectedFundingType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedThematicPrio, setSelectedThematicPrio] = useState('');
  const [showAIEnhancedOnly, setShowAIEnhancedOnly] = useState(false);
  const [minRelevanceScore, setMinRelevanceScore] = useState([0]);
  const [useEnhancedView, setUseEnhancedView] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ops = await getOpportunities();
      setAllOpportunities(ops);
    } catch (error) {
      console.error("Failed to load opportunities:", error);
      setError("Failed to load funding opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Memoized dropdown options
  const { countries, fundingTypes, thematicPrios, statuses } = useMemo(() => {
    if (!allOpportunities.length) {
      return { countries: [], fundingTypes: [], thematicPrios: [], statuses: [] };
    }
    const uniqueCountries = [...new Set(allOpportunities.map(op => op.country))].sort();
    const uniqueFundingTypes = [...new Set(allOpportunities.map(op => op.fundingType))].sort();
    const uniqueThematicPrios = [...new Set(allOpportunities.map(op => op.thematicPrio))].sort();
    const uniqueStatuses = [...new Set(allOpportunities.map(op => op.status))].sort();
    return {
      countries: uniqueCountries,
      fundingTypes: uniqueFundingTypes,
      thematicPrios: uniqueThematicPrios,
      statuses: uniqueStatuses,
    };
  }, [allOpportunities]);

  const filteredOpportunities = useMemo(() => {
    let results = allOpportunities;

    // Text search - enhanced to include AI summary
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
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
    if (selectedCountry) {
      results = results.filter(op => op.country === selectedCountry);
    }

    // Funding type filter
    if (selectedFundingType) {
      results = results.filter(op => op.fundingType === selectedFundingType);
    }

    // Status filter
    if (selectedStatus) {
      results = results.filter(op => op.status === selectedStatus);
    }

    // Thematic priority filter
    if (selectedThematicPrio) {
      results = results.filter(op => op.thematicPrio === selectedThematicPrio);
    }

    // AI enhanced only filter
    if (showAIEnhancedOnly) {
      results = results.filter(op => op.ai_enhanced);
    }

    // Relevance score filter
    if (minRelevanceScore[0] > 0) {
      results = results.filter(op => 
        op.african_relevance_score && op.african_relevance_score >= minRelevanceScore[0]
      );
    }

    // Sort by AI relevance score if available, otherwise by title
    return results.sort((a, b) => {
      if (a.african_relevance_score && b.african_relevance_score) {
        return b.african_relevance_score - a.african_relevance_score;
      }
      return a.title.localeCompare(b.title);
    });
  }, [allOpportunities, searchTerm, selectedCountry, selectedFundingType, selectedStatus, selectedThematicPrio, showAIEnhancedOnly, minRelevanceScore]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedFundingType('');
    setSelectedStatus('');
    setSelectedThematicPrio('');
    setShowAIEnhancedOnly(false);
    setMinRelevanceScore([0]);
  };

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value === "all" ? "" : value);
  };

  // Calculate AI stats for display
  const aiEnhancedCount = allOpportunities.filter(op => op.ai_enhanced).length;
  const avgRelevanceScore = allOpportunities
    .filter(op => op.african_relevance_score)
    .reduce((sum, op) => sum + (op.african_relevance_score || 0), 0) / 
    Math.max(allOpportunities.filter(op => op.african_relevance_score).length, 1);

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
        
        {/* AI Stats */}
        <div className="hidden lg:flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <span>{aiEnhancedCount} AI Enhanced</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>Avg Relevance: {avgRelevanceScore.toFixed(0)}/100</span>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8">
        <ApiErrorBoundary fallback={
          <Card className="p-4">
            <p className="text-center text-muted-foreground">Failed to load opportunities. Please try again later.</p>
          </Card>
        }>
          {/* Enhanced Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Basic Filters */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <Input
                    placeholder="Search by keyword..."
                    className="xl:col-span-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                  
                  <Select value={selectedCountry} onValueChange={handleSelectChange(setSelectedCountry)} disabled={isLoading || countries.length === 0}>
                    <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedFundingType} onValueChange={handleSelectChange(setSelectedFundingType)} disabled={isLoading || fundingTypes.length === 0}>
                    <SelectTrigger><SelectValue placeholder="All Funding Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Funding Types</SelectItem>
                      {fundingTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={handleSelectChange(setSelectedStatus)} disabled={isLoading || statuses.length === 0}>
                    <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* AI-Enhanced Filters */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="flex items-center space-x-2 text-lg font-medium">
                    <Brain className="h-5 w-5" />
                    <span>AI-Enhanced Filters</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ai-enhanced-only"
                        checked={showAIEnhancedOnly}
                        onCheckedChange={setShowAIEnhancedOnly}
                      />
                      <Label htmlFor="ai-enhanced-only">AI Enhanced Only</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enhanced-view"
                        checked={useEnhancedView}
                        onCheckedChange={setUseEnhancedView}
                      />
                      <Label htmlFor="enhanced-view">Enhanced View</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Min. Relevance Score: {minRelevanceScore[0]}</Label>
                      <Slider
                        value={minRelevanceScore}
                        onValueChange={setMinRelevanceScore}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `${filteredOpportunities.length} opportunities found`}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                      <X className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                    <Button onClick={loadData} disabled={isLoading}>
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <p className="text-destructive">{error}</p>
                <Button onClick={loadData} className="mt-2">Try Again</Button>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <OpportunitySkeleton key={i} />
              ))}
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="space-y-2">
                <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No opportunities found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or reset all filters.
                </p>
                <Button onClick={handleReset} className="mt-4">
                  Reset Filters
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
        </ApiErrorBoundary>
      </main>
    </div>
  );
}
