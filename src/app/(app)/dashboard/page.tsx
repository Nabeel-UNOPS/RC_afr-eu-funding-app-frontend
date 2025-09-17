"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardData } from '@/components/dashboard/dashboard-data';
import { AIEnhancedDashboard } from '@/components/dashboard/ai-enhanced-dashboard';
import { userProfile } from '@/lib/data';
import { Search as SearchIcon, Brain, BarChart3 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
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
        {/* Unified Dashboard with AI Insights */}
        <div className="space-y-6">
          {/* Traditional Dashboard Data */}
          <DashboardData />
          
          {/* AI-Enhanced Dashboard */}
          <AIEnhancedDashboard />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Navigation Section */}
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-semibold tracking-tight">
                Quick Actions
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/search">
                <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-6">
                    <SearchIcon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Search Opportunities</h3>
                      <p className="text-sm text-muted-foreground">Find funding that matches your needs</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/notifications">
                <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">!</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">View Notifications</h3>
                      <p className="text-sm text-muted-foreground">Stay updated on new opportunities</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Saved Searches Section */}
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs">★</span>
                  </div>
                  Saved Searches
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
