import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notifications } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <SidebarTrigger className="md:hidden"/>
        <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
          Notifications
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Updates on opportunities and deadlines based on your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notif) => {
                const Icon = notif.title.includes('Deadline') ? AlertTriangle : Bell;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                      !notif.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn('mt-1 h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center', !notif.read ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground')}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-grow">
                      <p className="font-semibold">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{notif.date}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
