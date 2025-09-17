"use client";

import { useState, useEffect } from 'react';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ApiErrorBoundary } from '@/components/ui/api-error-boundary';
import { getOpportunities } from '@/lib/enhanced-api';
import type { Opportunity } from '@/lib/data';
import type { EnhancedOpportunity } from '@/lib/enhanced-api';
import { Activity, Bookmark } from 'lucide-react';

interface DashboardDataProps {
  fallbackOpportunities?: EnhancedOpportunity[];
}

export function DashboardData({ fallbackOpportunities = [] }: DashboardDataProps) {
  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>(fallbackOpportunities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const openOpportunities = opportunities.filter(op => op.status === 'Open');
  const upcomingOpportunities = opportunities.filter(op => op.status === 'Upcoming');
  const recentOpportunities = opportunities.slice(0, 6);

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

      {/* Recent Opportunities */}
      <div className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">Recent Opportunities</h2>
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
