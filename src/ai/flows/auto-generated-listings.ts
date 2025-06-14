'use server';

/**
 * @fileOverview An AI agent for generating product listings.
 *
 * - generateListing - A function that handles the product listing generation process.
 * - GenerateListingInput - The input type for the generateListing function.
 * - GenerateListingOutput - The return type for the generateListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListingInputSchema = z.object({
  productDetails: z
    .string()
    .describe('The details of the product to generate a listing for.'),
  productPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateListingInput = z.infer<typeof GenerateListingInputSchema>;

const GenerateListingOutputSchema = z.object({
  title: z.string().describe('The generated title for the product listing.'),
  description: z.string().describe('The generated description for the product listing.'),
  tags: z.array(z.string()).describe('The generated tags for the product listing.'),
});
export type GenerateListingOutput = z.infer<typeof GenerateListingOutputSchema>;

export async function generateListing(
  input: GenerateListingInput
): Promise<GenerateListingOutput> {
  return generateListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListingPrompt',
  input: {schema: GenerateListingInputSchema},
  output: {schema: GenerateListingOutputSchema},
  prompt: `You are an expert in creating compelling product listings.

  Based on the provided product details and photo (if available), generate a title, description, and tags for the product listing.

  Product Details: {{{productDetails}}}
  {{#if productPhotoDataUri}}
  Product Photo: {{media url=productPhotoDataUri}}
  {{/if}}
  `,
});

const generateListingFlow = ai.defineFlow(
  {
    name: 'generateListingFlow',
    inputSchema: GenerateListingInputSchema,
    outputSchema: GenerateListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
