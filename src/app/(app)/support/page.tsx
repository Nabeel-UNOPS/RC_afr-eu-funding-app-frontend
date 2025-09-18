import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supportContent } from '@/lib/data';
import { Mail, User } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';


export default function SupportPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
         <SidebarTrigger className="md:hidden"/>
        <h1 className="font-headline text-xl font-semibold text-foreground md:text-2xl">
          Support & Information Hub
        </h1>
      </header>
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {supportContent.faq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Glossary of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {supportContent.glossary.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.term}</AccordionTrigger>
                    <AccordionContent>{item.definition}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Source Status</CardTitle>
            <CardDescription>Status of plugin-based data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">EU Funding & Tenders API</span>
                  <p className="text-sm text-muted-foreground">Live integration - Current opportunities loaded</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Gates Foundation</span>
                  <p className="text-sm text-muted-foreground">Integrated via EU API</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">AI Enhancement</span>
                  <p className="text-sm text-muted-foreground">Real-time processing enabled</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="font-medium">Web Scraper</span>
                  <p className="text-sm text-muted-foreground">Automated data collection</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Internal Contacts</CardTitle>
            <CardDescription>UNOPS personnel involved in EU partnerships.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {supportContent.contacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 rounded-md border p-4">
                <Avatar>
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${contact.name.charAt(0)}`} data-ai-hint="person portrait" />
                  <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.details.split(', ')[0]}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4"/>
                    <span>{contact.details.split(', ')[1]}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
