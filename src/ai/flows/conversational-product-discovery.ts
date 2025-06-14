// src/ai/flows/conversational-product-discovery.ts
'use server';
/**
 * @fileOverview An AI agent for suggesting products based on natural language descriptions.
 *
 * - conversationalProductDiscovery - A function that handles the product discovery process.
 * - ConversationalProductDiscoveryInput - The input type for the conversationalProductDiscovery function.
 * - ConversationalProductDiscoveryOutput - The return type for the conversationalProductDiscovery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationalProductDiscoveryInputSchema = z.object({
  description: z.string().describe('The natural language description of the desired product.'),
});
export type ConversationalProductDiscoveryInput = z.infer<typeof ConversationalProductDiscoveryInputSchema>;

const ConversationalProductDiscoveryOutputSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe('The name of the product.'),
      description: z.string().describe('A description of the product.'),
      imageUrl: z.string().describe('A URL to an image of the product.'),
      price: z.number().describe('The price of the product.'),
    })
  ).describe('A list of suggested products.'),
});
export type ConversationalProductDiscoveryOutput = z.infer<typeof ConversationalProductDiscoveryOutputSchema>;

export async function conversationalProductDiscovery(input: ConversationalProductDiscoveryInput): Promise<ConversationalProductDiscoveryOutput> {
  return conversationalProductDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conversationalProductDiscoveryPrompt',
  input: {schema: ConversationalProductDiscoveryInputSchema},
  output: {schema: ConversationalProductDiscoveryOutputSchema},
  prompt: `You are a helpful shopping assistant. A user will describe what they are looking for, and you should return a list of relevant products. 

Description: {{{description}}}`,
});

const conversationalProductDiscoveryFlow = ai.defineFlow(
  {
    name: 'conversationalProductDiscoveryFlow',
    inputSchema: ConversationalProductDiscoveryInputSchema,
    outputSchema: ConversationalProductDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
