'use server';

/**
 * @fileOverview A smart cart optimizer AI agent.
 *
 * - smartCartOptimizer - A function that suggests better bundles or similar items for a shopping cart.
 * - SmartCartOptimizerInput - The input type for the smartCartOptimizer function.
 * - SmartCartOptimizerOutput - The return type for the smartCartOptimizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCartOptimizerInputSchema = z.object({
  cartItems: z
    .string()
    .describe('The items currently in the shopping cart, as a comma separated list.'),
  budget: z.number().optional().describe('The user specified budget for the cart.'),
});
export type SmartCartOptimizerInput = z.infer<typeof SmartCartOptimizerInputSchema>;

const SmartCartOptimizerOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      item: z.string().describe('The suggested item.'),
      reason: z.string().describe('The reason for the suggestion.'),
      price: z.number().optional().describe('The price of the suggested item.'),
    })
  ).describe('A list of suggested items to optimize the cart.'),
  summary: z.string().describe('A summary of the cart optimization suggestions.'),
});
export type SmartCartOptimizerOutput = z.infer<typeof SmartCartOptimizerOutputSchema>;

export async function smartCartOptimizer(input: SmartCartOptimizerInput): Promise<SmartCartOptimizerOutput> {
  return smartCartOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartCartOptimizerPrompt',
  input: {schema: SmartCartOptimizerInputSchema},
  output: {schema: SmartCartOptimizerOutputSchema},
  prompt: `You are a shopping assistant AI that helps users optimize their shopping carts.

You will receive a list of items in the cart and an optional budget.

Based on this information, you will suggest better bundles or similar items to help the user save money or find better deals.

Cart Items: {{{cartItems}}}
Budget: {{{budget}}}

Suggestions should include the item, the reason for the suggestion, and the price if available.

Output a summary of the cart optimization suggestions.
`,
});

const smartCartOptimizerFlow = ai.defineFlow(
  {
    name: 'smartCartOptimizerFlow',
    inputSchema: SmartCartOptimizerInputSchema,
    outputSchema: SmartCartOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
