import { notFound } from 'next/navigation';
import { getOpportunityById, getOpportunities } from '@/lib/enhanced-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Euro, MapPin, Building, User, Mail, Globe } from 'lucide-react';
import { AiMatcher } from '@/components/opportunities/ai-matcher';
import { SidebarTrigger } from '@/components/ui/sidebar';

export async function generateStaticParams() {
  const opportunities = await getOpportunities();
  return opportunities.map((opportunity) => ({
    id: opportunity.id,
  }));
}

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const opportunity = await getOpportunityById(params.id);

  if (!opportunity) {
    notFound();
  }

  const statusVariant = {
    Open: 'default',
    Closed: 'destructive',
    Upcoming: 'secondary',
  }[opportunity.status] as 'default' | 'destructive' | 'secondary';

  return (
    <div className="flex flex-1 flex-col bg-background">
       <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
        <SidebarTrigger className="md:hidden" />
        <h1 className="truncate font-headline text-xl font-semibold text-foreground">
          {opportunity.title}
        </h1>
      </header>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="font-headline text-2xl">{opportunity.title}</CardTitle>
                  <Badge variant={statusVariant}>{opportunity.status}</Badge>
                </div>
                <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.country} / {opportunity.subRegion}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                    <TabsTrigger value="application">Application</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 rounded-md border p-4">
                    <TabsContent value="overview">
                      <h3 className="font-semibold">Summary</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.summary}</p>
                       <h3 className="mt-4 font-semibold">MIP Priority Areas</h3>
                      <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                        {opportunity.mipPrios?.map(p => <li key={p}>{p}</li>) || <li>Development priorities</li>}
                      </ul>
                    </TabsContent>
                    <TabsContent value="eligibility">
                      <h3 className="font-semibold">Requirements</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.eligibility}</p>
                    </TabsContent>
                    <TabsContent value="application">
                     <h3 className="font-semibold">Process</h3>
                      <p className="text-sm text-muted-foreground">{opportunity.applicationProcess}</p>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-headline">Contacts</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {opportunity.contacts?.map(c => (
                  <div key={c.name} className="flex items-start gap-4">
                    {c.type.includes('UNOPS') ? <Building className="h-5 w-5 text-primary"/> : <Globe className="h-5 w-5 text-primary"/>}
                    <div>
                      <p className="font-semibold">{c.name} <Badge variant="outline" className="ml-2">{c.type}</Badge></p>
                      <p className="text-sm text-muted-foreground">{c.details}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="font-headline">Key Information</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-2"><Euro className="h-4 w-4 text-muted-foreground"/><strong>Amount:</strong> {opportunity.fundingAmount}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/><strong>Deadline:</strong> {opportunity.deadline}</div>
                <div className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground"/><strong>Instrument:</strong> {opportunity.fundingInstrument}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="font-headline">Source & Documents</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Source Website Link */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Official Source</h4>
                  <a 
                    href={opportunity.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="default" className="w-full justify-start gap-2">
                      <Globe className="h-4 w-4" />
                      Visit Official Website
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground">
                    Get the latest information directly from the source
                  </p>
                </div>

                {/* Documents */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Documents</h4>
                  {opportunity.documents?.map(doc => (
                    <a key={doc.name} href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="h-4 w-4" /> {doc.name}
                      </Button>
                    </a>
                  )) || (
                    <div className="text-center text-muted-foreground py-2">
                      <p className="text-sm">No additional documents available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <AiMatcher opportunity={opportunity} />
          </div>
        </div>
      </main>
    </div>
  );
}
