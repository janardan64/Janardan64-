'use server';
/**
 * @fileOverview An AI agent for categorizing spending entries.
 *
 * - aiExpenseCategorization - A function that handles the expense categorization process.
 * - AiExpenseCategorizationInput - The input type for the aiExpenseCategorization function.
 * - AiExpenseCategorizationOutput - The return type for the aiExpenseCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiExpenseCategorizationInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the spending entry, e.g., "Starbucks coffee", "Weekly grocery shop at Tesco".'),
});
export type AiExpenseCategorizationInput = z.infer<typeof AiExpenseCategorizationInputSchema>;

const AiExpenseCategorizationOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'A concise category for the expense. Examples: "Vegetables", "Petrol", "Personal Mobile", "Groceries", "Transport", "Utilities", "Food & Drinks", "Entertainment", "Shopping", "Healthcare", "Education", "Rent", "Salary", "Investment", "Savings", "Other".'
    ),
});
export type AiExpenseCategorizationOutput = z.infer<typeof AiExpenseCategorizationOutputSchema>;

export async function aiExpenseCategorization(
  input: AiExpenseCategorizationInput
): Promise<AiExpenseCategorizationOutput> {
  return aiExpenseCategorizationFlow(input);
}

const categorizeExpensePrompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: AiExpenseCategorizationInputSchema},
  output: {schema: AiExpenseCategorizationOutputSchema},
  prompt: `You are a precise expense categorization assistant. Based on the description, suggest a single, short, and highly relevant category. 

Be granular where appropriate. For example:
- "Bought tomatoes and onions" -> "Vegetables"
- "Filled up at Shell" -> "Petrol"
- "Airtel bill payment" -> "Personal Mobile"
- "Dinner at restaurant" -> "Food & Drinks"

If the description is vague, use broader categories like "Groceries", "Transport", or "Shopping". If truly unknown, use "Other".

Description: {{{description}}}`,
});

const aiExpenseCategorizationFlow = ai.defineFlow(
  {
    name: 'aiExpenseCategorizationFlow',
    inputSchema: AiExpenseCategorizationInputSchema,
    outputSchema: AiExpenseCategorizationOutputSchema,
  },
  async input => {
    const {output} = await categorizeExpensePrompt(input);
    return output!;
  }
);
