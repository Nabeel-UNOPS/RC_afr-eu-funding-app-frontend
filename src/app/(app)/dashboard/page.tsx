"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardData } from '@/components/dashboard/dashboard-data';
import { AIEnhancedDashboard } from '@/components/dashboard/ai-enhanced-dashboard';
import { userProfile } from '@/lib/data';
import { BarChart3, RefreshCw } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <div className="flex items-center gap-2">
           <SidebarTrigger className="md:hidden"/>
           <h1 className="font-headline text-lg font-semibold text-foreground md:text-xl">
              Welcome, {userProfile.name.split(' ')[0]}!
            </h1>
        </div>
        
        {/* UNOPS Logo */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <img 
              src="/UNOPS_logo.png" 
              alt="UNOPS Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {/* Refresh and Collect Data buttons */}
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" onClick={() => window.location.reload()}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" onClick={() => window.location.reload()}>
              <BarChart3 className="h-3 w-3 mr-1" />
              Collect Data
            </Button>
          </div>
          
          {/* Last updated timestamp */}
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-8">
        {/* Unified Dashboard Content */}
        <div className="space-y-6">
          {/* Traditional Dashboard Data */}
          <DashboardData />
          
          {/* AI-Enhanced Dashboard */}
          <AIEnhancedDashboard />
        </div>

      </main>
    </div>
  );
}
