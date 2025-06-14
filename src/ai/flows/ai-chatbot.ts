'use server';

/**
 * @fileOverview AI-powered chatbot for automatically responding to buyer queries.
 *
 * - aiChatbot - A function that handles the chatbot functionality.
 * - AiChatbotInput - The input type for the aiChatbot function.
 * - AiChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotInputSchema = z.object({
  query: z.string().describe('The buyer query.'),
  productDetails: z.string().optional().describe('Details about the product the buyer is asking about.'),
  pastConvo: z.string().optional().describe('Past conversation history'),
});
export type AiChatbotInput = z.infer<typeof AiChatbotInputSchema>;

const AiChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the buyer query.'),
});
export type AiChatbotOutput = z.infer<typeof AiChatbotOutputSchema>;

export async function aiChatbot(input: AiChatbotInput): Promise<AiChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AiChatbotInputSchema},
  output: {schema: AiChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot assisting sellers in responding to buyer queries.

  You should provide informative and helpful responses based on the buyer's query and the available product details.

  The Past Conversation History is: {{{pastConvo}}}

  Buyer Query: {{{query}}}
  Product Details: {{{productDetails}}}

  Response: `,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AiChatbotInputSchema,
    outputSchema: AiChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
