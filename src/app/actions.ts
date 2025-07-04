'use server';

import { opportunityMatching, type OpportunityMatchingOutput } from "@/ai/flows/opportunity-matching";
import { userProfile, type Opportunity } from "@/lib/data";

export async function getAiRecommendation(opportunity: Opportunity): Promise<OpportunityMatchingOutput | { error: string }> {
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
