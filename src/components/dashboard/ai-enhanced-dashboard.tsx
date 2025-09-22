/**
 * AI-Enhanced Dashboard Data Component
 * 
 * Displays real-time statistics and insights from the intelligent ingestion system
 */

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Database, Globe, Zap, RefreshCw, TrendingUp, Activity } from 'lucide-react';
import { api, type AIStats, type CollectionStatus, type EnhancedOpportunity, getOpportunities } from '@/lib/enhanced-api';
import { OpportunityCard } from '@/components/dashboard/opportunity-card';

export function AIEnhancedDashboard() {
  const [aiStats, setAiStats] = useState<AIStats | null>(null);
  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 opportunities per page

  useEffect(() => {
    loadAIStats();
    loadOpportunities();
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  const loadOpportunities = async () => {
    try {
      const ops = await getOpportunities();
      console.log('Loaded opportunities for dashboard:', ops.length);
      if (ops && ops.length > 0) {
        setOpportunities(ops); // Show all opportunities - pagination will be handled by UI
      } else {
        console.warn('No opportunities loaded');
      }
    } catch (err) {
      console.error('Error loading opportunities:', err);
      setError('Failed to load opportunities');
    }
  };

  const loadAIStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      const stats = await api.getAIStats();
      setAiStats(stats);
    } catch (err) {
      setError('Failed to load AI statistics');
      console.error('Error loading AI stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDataCollection = async () => {
    try {
      setIsCollecting(true);
      const result = await api.triggerDataCollection();
      
      if (result.success) {
        // Refresh stats and opportunities after a delay
        setTimeout(() => {
          loadAIStats();
          loadOpportunities();
          setIsCollecting(false);
        }, 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(`Collection failed: ${err.message}`);
      setIsCollecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 animate-pulse" />
          <span>Loading AI Dashboard...</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-muted"></CardHeader>
              <CardContent className="h-16 bg-muted/50"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const enhancementRate = aiStats 
    ? Math.round((aiStats.ai_enhanced_count / Math.max(aiStats.total_opportunities, 1)) * 100)
    : 0;

  // Calculate pagination
  const totalPages = Math.ceil(opportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOpportunities = opportunities.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}


      {/* Top Funding Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Funding Themes</CardTitle>
          <CardDescription>
            Most common themes identified by AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {aiStats?.top_themes?.length > 0 ? (
              aiStats.top_themes.slice(0, 10).map((theme, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{theme}</span>
                  <Badge variant="secondary">
                    Rank #{index + 1}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No theme data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
