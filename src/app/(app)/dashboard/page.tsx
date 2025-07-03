import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { opportunities, userProfile } from '@/lib/data';
import { Activity, ArrowRight, Bookmark, Search as SearchIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const recentOpportunities = opportunities.slice(0, 2);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden"/>
           <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
              Welcome, {userProfile.name.split(' ')[0]}!
            </h1>
        </div>
        <div className="relative flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Quick Search..."
            className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8">
        {/* At-a-Glance Statistics */}
        <section>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Active Opportunities"
              value={opportunities.filter(op => op.status === 'Open').length.toString()}
              icon={Activity}
              description="Funds currently open for application"
            />
            <StatsCard
              title="Total Available Funding"
              value="~€48M"
              icon={Activity}
              description="Across all open opportunities"
            />
            <StatsCard
              title="Upcoming Deadlines"
              value="2"
              icon={Activity}
              description="In the next 90 days"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* What's New Section */}
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-semibold tracking-tight">
                What&apos;s New
              </h2>
              <Link href="/search">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>

          {/* Saved Searches Section */}
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Bookmark className="h-5 w-5" /> Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">Humanitarian</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">West Africa</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">Governance</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">NDICI 2021-2024</Badge>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
