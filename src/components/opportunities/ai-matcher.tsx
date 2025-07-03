"use client";

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { opportunityMatching, OpportunityMatchingOutput } from '@/ai/flows/opportunity-matching';
import type { Opportunity } from '@/lib/data';
import { userProfile } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type AiMatcherProps = {
  opportunity: Opportunity;
};

// Server action to be called from the client component
async function getAiRecommendation(opportunity: Opportunity): Promise<OpportunityMatchingOutput | { error: string }> {
  "use server";
  try {
    const result = await opportunityMatching({
      userProfile: JSON.stringify(userProfile),
      searchHistory: "humanitarian, West Africa, peacebuilding, NDICI",
      newOpportunityDetails: `${opportunity.title}: ${opportunity.summary}`,
    });
    return result;
  } catch (error) {
    console.error("AI Matching Error:", error);
    return { error: "Failed to get AI recommendation." };
  }
}


export function AiMatcher({ opportunity }: AiMatcherProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OpportunityMatchingOutput | null>(null);
  const { toast } = useToast();

  const handleMatch = async () => {
    setLoading(true);
    setResult(null);
    const response = await getAiRecommendation(opportunity);
    if ('error' in response) {
      toast({
        variant: "destructive",
        title: "AI Matching Failed",
        description: response.error,
      });
    } else {
      setResult(response);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Opportunity Matching
        </CardTitle>
        <CardDescription>
          Get an AI-powered relevance score for this opportunity based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!loading && !result && (
            <Button onClick={handleMatch} className="w-full" disabled={loading}>
                <Wand2 className="mr-2 h-4 w-4" />
                Analyze Relevance
            </Button>
        )}
        
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">Relevance Score</span>
                <span className="font-bold text-primary">{Math.round(result.relevanceScore * 100)}%</span>
              </div>
              <Progress value={result.relevanceScore * 100} />
            </div>
            <div>
              <p className="text-sm font-medium">Recommendation Reason:</p>
              <p className="text-sm text-muted-foreground">{result.recommendationReason}</p>
            </div>
             <Button onClick={handleMatch} variant="secondary" className="w-full" disabled={loading}>
                <Wand2 className="mr-2 h-4 w-4" />
                Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
