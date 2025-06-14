
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
  pastConvo: z.string().optional().describe('Past conversation history (automatically managed). Each turn prefixed by "User: " or "AI: ".'),
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
  prompt: `You are ShopMate AI, a specialized assistant for an e-commerce platform. Your primary function is to help users with questions related to buying and selling online, using this platform's features (like product discovery, cart optimization, listing generation, pricing assistance), and general e-commerce inquiries. If a user asks about your capabilities (e.g., "What can you do?" or "What kind of questions can I ask?"), clearly summarize your functions based on these topics.

IMPORTANT: If the user's query is NOT related to e-commerce, this platform, its features, the provided product details, or the ongoing conversation history, you MUST politely decline to answer. State that you can only assist with relevant topics. For example, say: "I can only help with questions about e-commerce and ShopMate AI features. How can I assist you with that?" Do not attempt to answer off-topic questions (e.g., about unrelated history, science, personal advice, or random facts).

Use the following information to generate your response:
{{#if productDetails}}
Product Details:
{{{productDetails}}}
{{/if}}

{{#if pastConvo}}
Conversation History (User and AI turns):
{{{pastConvo}}}
{{/if}}

Current Buyer Query: {{{query}}}

Response:`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
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
