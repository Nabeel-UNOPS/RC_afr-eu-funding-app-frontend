"use client";

import { NotificationSystem } from '@/components/notifications/notification-system';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const response = await fetch('https://us-central1-unops-cameron.cloudfunctions.net/run_intelligent_ingestion?endpoint=opportunities');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.opportunities) {
            setOpportunities(data.opportunities);
          }
        }
      } catch (error) {
        console.error('Error loading opportunities:', error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <SidebarTrigger className="md:hidden"/>
        <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
          Notifications
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8 w-full">
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading notifications...</p>
          </div>
        ) : (
          <div className="w-full max-w-none">
            <NotificationSystem opportunities={opportunities} />
          </div>
        )}
      </main>
    </div>
  );
}
