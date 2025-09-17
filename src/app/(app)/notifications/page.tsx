import { NotificationSystem } from '@/components/notifications/notification-system';
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
        <NotificationSystem />
      </main>
    </div>
  );
}
