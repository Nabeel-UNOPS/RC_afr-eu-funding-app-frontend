import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Opportunity } from '@/lib/data';
import { ArrowRight, Calendar, Euro, MapPin } from 'lucide-react';

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const statusVariant = {
    Open: 'default',
    Closed: 'destructive',
    Upcoming: 'secondary',
  }[opportunity.status] as 'default' | 'destructive' | 'secondary';

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer flex flex-col"
      onClick={() => {
        // Open opportunity details in a new tab with URL parameters
        const url = `/dashboard?opportunity=${encodeURIComponent(opportunity.id)}`;
        window.open(url, '_blank');
      }}
    >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="font-headline text-lg">{opportunity.title}</CardTitle>
            <Badge variant={statusVariant} className="whitespace-nowrap">{opportunity.status}</Badge>
          </div>
          <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            <span>{opportunity.country}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateText(opportunity.summary, 150)}
          </p>
          
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium">{opportunity.fundingAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Deadline</p>
                <p className="font-medium">{opportunity.deadline}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-primary">
          <div className="flex items-center gap-1 font-semibold">
              View Details <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
  );
}
