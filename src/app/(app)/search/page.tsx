"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { opportunities, type Opportunity } from '@/lib/data';
import { Search as SearchIcon, X } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(opportunities);

  // In a real app, filtering logic would be more robust.
  const handleSearch = () => {
    const results = opportunities.filter(op => 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOpportunities(results);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredOpportunities(opportunities);
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
              <Button onClick={handleSearch}><SearchIcon className="mr-2 h-4 w-4" /> Search</Button>
              <Button variant="outline" onClick={handleReset}><X className="mr-2 h-4 w-4" /> Reset</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOpportunities.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </main>
    </div>
  );
}
