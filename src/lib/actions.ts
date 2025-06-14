"use server";

import { conversationalProductDiscovery, type ConversationalProductDiscoveryInput, type ConversationalProductDiscoveryOutput } from '@/ai/flows/conversational-product-discovery';
import { smartCartOptimizer, type SmartCartOptimizerInput, type SmartCartOptimizerOutput } from '@/ai/flows/smart-cart-optimizer';
import { generateListing, type GenerateListingInput, type GenerateListingOutput } from '@/ai/flows/auto-generated-listings';
import { suggestCompetitivePrice, type SuggestCompetitivePriceInput, type SuggestCompetitivePriceOutput } from '@/ai/flows/smart-pricing-assistant';
import { aiChatbot, type AiChatbotInput, type AiChatbotOutput } from '@/ai/flows/ai-chatbot';

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function handleConversationalProductDiscovery(input: ConversationalProductDiscoveryInput): Promise<ActionResult<ConversationalProductDiscoveryOutput>> {
  try {
    const result = await conversationalProductDiscovery(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in conversational product discovery:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}

export async function handleSmartCartOptimizer(input: SmartCartOptimizerInput): Promise<ActionResult<SmartCartOptimizerOutput>> {
  try {
    const result = await smartCartOptimizer(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in smart cart optimizer:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}

export async function handleGenerateListing(input: GenerateListingInput): Promise<ActionResult<GenerateListingOutput>> {
  try {
    const result = await generateListing(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in generating listing:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}

export async function handleSuggestCompetitivePrice(input: SuggestCompetitivePriceInput): Promise<ActionResult<SuggestCompetitivePriceOutput>> {
  try {
    const result = await suggestCompetitivePrice(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in suggesting competitive price:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}

export async function handleAiChatbot(input: AiChatbotInput): Promise<ActionResult<AiChatbotOutput>> {
  try {
    const result = await aiChatbot(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in AI chatbot:", error);
    return { success: false, error: (error as Error).message || "An unexpected error occurred." };
  }
}
