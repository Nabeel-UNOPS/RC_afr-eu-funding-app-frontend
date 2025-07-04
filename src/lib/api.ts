import { opportunities, type Opportunity } from './data';

// In a real application, these functions would fetch data from live APIs
// or a database that is populated by automated data feeds.

/**
 * Fetches all funding opportunities.
 * @returns A promise that resolves to an array of opportunities.
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  // Simulate network delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(opportunities);
}

/**
 * Fetches a single funding opportunity by its ID.
 * @param id The ID of the opportunity to fetch.
 * @returns A promise that resolves to the opportunity or undefined if not found.
 */
export async function getOpportunityById(id: string): Promise<Opportunity | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const opportunity = opportunities.find(op => op.id === id);
  return Promise.resolve(opportunity);
}
