'use server';

/**
 * @fileOverview AI-powered opportunity matching flow.
 *
 * - opportunityMatching - A function that recommends relevant funding opportunities.
 * - OpportunityMatchingInput - The input type for the opportunityMatching function.
 * - OpportunityMatchingOutput - The return type for the opportunityMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OpportunityMatchingInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile, including role, expertise, and interests.'),
  searchHistory: z
    .string()
    .describe('The user search history, including keywords and filters used.'),
  newOpportunityDetails: z
    .string()
    .describe('The details of the new funding opportunity.'),
});
export type OpportunityMatchingInput = z.infer<typeof OpportunityMatchingInputSchema>;

const OpportunityMatchingOutputSchema = z.object({
  relevanceScore: z
    .number()
    .describe('A score indicating the relevance of the opportunity (0-1).'),
  recommendationReason: z
    .string()
    .describe('Explanation of why the opportunity is recommended.'),
});
export type OpportunityMatchingOutput = z.infer<typeof OpportunityMatchingOutputSchema>;

export async function opportunityMatching(input: OpportunityMatchingInput): Promise<OpportunityMatchingOutput> {
  return opportunityMatchingFlow(input);
}

const opportunityMatchingPrompt = ai.definePrompt({
  name: 'opportunityMatchingPrompt',
  input: {schema: OpportunityMatchingInputSchema},
  output: {schema: OpportunityMatchingOutputSchema},
  prompt: `You are an AI assistant designed to match funding opportunities to users based on their profile, search history, and opportunity details.

  User Profile: {{{userProfile}}}
  Search History: {{{searchHistory}}}
  Opportunity Details: {{{newOpportunityDetails}}}

  Analyze the user profile, search history, and opportunity details to determine the relevance of the opportunity for the user. Provide a relevance score between 0 and 1, and explain the reasons for the recommendation.

  Relevance Score (0-1): 
  Recommendation Reason: `,
});

const opportunityMatchingFlow = ai.defineFlow(
  {
    name: 'opportunityMatchingFlow',
    inputSchema: OpportunityMatchingInputSchema,
    outputSchema: OpportunityMatchingOutputSchema,
  },
  async input => {
    const {output} = await opportunityMatchingPrompt(input);
    return output!;
  }
);
