'use server';

/**
 * @fileOverview AI-powered smart pricing assistant for sellers.
 *
 * - suggestCompetitivePrice - A function that suggests competitive prices for a product.
 * - SuggestCompetitivePriceInput - The input type for the suggestCompetitivePrice function.
 * - SuggestCompetitivePriceOutput - The return type for the suggestCompetitivePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCompetitivePriceInputSchema = z.object({
  productDetails: z
    .string()
    .describe('Detailed description of the product, including features, brand, and specifications.'),
  currentPrice: z
    .number()
    .describe('The current selling price of the product.'),
  marketTrends: z
    .string()
    .optional()
    .describe('Optional: Information about current market trends for similar products.'),
  competitorPrices: z
    .string()
    .optional()
    .describe('Optional: Prices of the same or similar products from competitors.'),
});
export type SuggestCompetitivePriceInput = z.infer<
  typeof SuggestCompetitivePriceInputSchema
>;

const SuggestCompetitivePriceOutputSchema = z.object({
  suggestedPrice: z
    .number()
    .describe('The AI-suggested competitive price for the product.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested price, considering market trends and competitor prices.'),
});
export type SuggestCompetitivePriceOutput = z.infer<
  typeof SuggestCompetitivePriceOutputSchema
>;

export async function suggestCompetitivePrice(
  input: SuggestCompetitivePriceInput
): Promise<SuggestCompetitivePriceOutput> {
  return suggestCompetitivePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCompetitivePricePrompt',
  input: {schema: SuggestCompetitivePriceInputSchema},
  output: {schema: SuggestCompetitivePriceOutputSchema},
  prompt: `You are an AI assistant that suggests competitive prices for products to help sellers maximize sales.

  Based on the following information, suggest a competitive price for the product and explain your reasoning.

  Product Details: {{{productDetails}}}
  Current Price: {{{currentPrice}}}
  Market Trends: {{{marketTrends}}}
  Competitor Prices: {{{competitorPrices}}}

  Consider all factors and provide a suggested price that is both competitive and maximizes profit for the seller.

  Format your output as a JSON object that matches the SuggestCompetitivePriceOutputSchema schema with "suggestedPrice" and "reasoning" fields.`,
});

const suggestCompetitivePriceFlow = ai.defineFlow(
  {
    name: 'suggestCompetitivePriceFlow',
    inputSchema: SuggestCompetitivePriceInputSchema,
    outputSchema: SuggestCompetitivePriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
