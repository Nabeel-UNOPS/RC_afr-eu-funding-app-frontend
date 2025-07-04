"use client"

import { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSearch = () => {
    // In a real app, filtering logic would be more robust.
    const results = allOpportunities.filter(op => 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOpportunities(results);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredOpportunities(allOpportunities);
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
              <Select>
                <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent><SelectItem value="benin">Benin</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Funding Type" /></SelectTrigger>
                <SelectContent><SelectItem value="dev">Development</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Thematic Priority" /></SelectTrigger>
                <SelectContent><SelectItem value="econ">Economic Growth</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch} disabled={isLoading}><SearchIcon className="mr-2 h-4 w-4" /> Search</Button>
              <Button variant="outline" onClick={handleReset} disabled={isLoading}><X className="mr-2 h-4 w-4" /> Reset</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <>
              <OpportunitySkeleton />
              <OpportunitySkeleton />
              <OpportunitySkeleton />
            </>
          ) : (
            filteredOpportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
