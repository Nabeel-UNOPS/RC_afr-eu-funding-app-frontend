"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardData } from '@/components/dashboard/dashboard-data';
import { AIEnhancedDashboard } from '@/components/dashboard/ai-enhanced-dashboard';
import { RefreshCw } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading to prevent layout shift
    const timer = setTimeout(() => {
      setDataLoaded(true);
      setIsLoading(false);
    }, 300); // Reduced from 1000ms to 300ms for faster loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden"/>
        </div>
        
        {/* UNOPS Logo */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center px-4 py-2">
            <img 
              src="/UNOPS_logo.png" 
              alt="UNOPS Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {/* Refresh Data button */}
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" onClick={() => window.location.reload()}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh Data
            </Button>
          </div>
          
          {/* Last updated timestamp */}
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' })} EST
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8 min-h-[calc(100vh-4rem)]">
        {isLoading ? (
          <div className="space-y-6">
            {/* Loading skeleton to prevent layout shift */}
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-20 bg-muted"></CardHeader>
                  <CardContent className="h-16 bg-muted/50"></CardContent>
                </Card>
              ))}
            </div>
            <Card className="animate-pulse">
              <CardHeader className="h-16 bg-muted"></CardHeader>
              <CardContent className="h-32 bg-muted/50"></CardContent>
            </Card>
            <Card className="animate-pulse">
              <CardHeader className="h-16 bg-muted"></CardHeader>
              <CardContent className="h-64 bg-muted/50"></CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Traditional Dashboard Data */}
            <DashboardData />
            
            {/* AI-Enhanced Dashboard */}
            <AIEnhancedDashboard />
          </div>
        )}
      </main>
    </div>
  );
}
