"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { type Opportunity } from '@/lib/data';
import { getOpportunities } from '@/lib/api';
import { Search as SearchIcon, X } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';


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
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedFundingType, setSelectedFundingType] = useState('');
  const [selectedThematicPrio, setSelectedThematicPrio] = useState('');

  // Memoized dropdown options
  const { countries, fundingTypes, thematicPrios } = useMemo(() => {
    const ops = allOpportunities;
    const uniqueCountries = [...new Set(ops.map(op => op.country))].sort();
    const uniqueFundingTypes = [...new Set(ops.map(op => op.fundingType))].sort();
    const uniqueThematicPrios = [...new Set(ops.map(op => op.thematicPrio))].sort();
    return {
      countries: uniqueCountries,
      fundingTypes: uniqueFundingTypes,
      thematicPrios: uniqueThematicPrios,
    };
  }, [allOpportunities]);


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const ops = await getOpportunities();
      setAllOpportunities(ops);
      setFilteredOpportunities(ops);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let results = allOpportunities;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(op =>
        op.title.toLowerCase().includes(lowercasedTerm) ||
        op.summary.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (selectedCountry) {
      results = results.filter(op => op.country === selectedCountry);
    }

    if (selectedFundingType) {
      results = results.filter(op => op.fundingType === selectedFundingType);
    }

    if (selectedThematicPrio) {
      results = results.filter(op => op.thematicPrio === selectedThematicPrio);
    }

    setFilteredOpportunities(results);
  }, [searchTerm, selectedCountry, selectedFundingType, selectedThematicPrio, allOpportunities]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedFundingType('');
    setSelectedThematicPrio('');
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
            Search Opportunities
          </h1>
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Input
                placeholder="Search by keyword..."
                className="lg:col-span-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countries.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedFundingType} onValueChange={setSelectedFundingType}>
                <SelectTrigger><SelectValue placeholder="All Funding Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Funding Types</SelectItem>
                  {fundingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedThematicPrio} onValueChange={setSelectedThematicPrio}>
                <SelectTrigger><SelectValue placeholder="All Thematic Priorities" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Thematic Priorities</SelectItem>
                  {thematicPrios.map(prio => <SelectItem key={prio} value={prio}>{prio}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={isLoading}><X className="mr-2 h-4 w-4" /> Reset Filters</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <>
              <OpportunitySkeleton />
              <OpportunitySkeleton />
              <OpportunitySkeleton />
              <OpportunitySkeleton />
              <OpportunitySkeleton />
              <OpportunitySkeleton />
            </>
          ) : (
            filteredOpportunities.length > 0 ? (
              filteredOpportunities.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))
            ) : (
               <div className="col-span-full text-center text-muted-foreground py-10">
                <p>No opportunities match your current filters.</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
