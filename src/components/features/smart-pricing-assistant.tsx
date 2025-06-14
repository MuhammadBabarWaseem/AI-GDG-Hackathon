"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleSuggestCompetitivePrice } from '@/lib/actions';
import type { SuggestCompetitivePriceOutput } from '@/ai/flows/smart-pricing-assistant';
import { DollarSign, TrendingUp, Lightbulb } from 'lucide-react';

const FormSchema = z.object({
  productDetails: z.string().min(10, { message: "Product details must be at least 10 characters." }),
  currentPrice: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Current price must be a positive number." })
  ),
  marketTrends: z.string().optional(),
  competitorPrices: z.string().optional(),
});

export default function SmartPricingAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState<(SuggestCompetitivePriceOutput & { currentPrice: number }) | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { productDetails: '', currentPrice: '', marketTrends: '', competitorPrices: '' },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    setPricingResult(null);
    // data.currentPrice will be a number due to Zod transform/preprocess
    const numericCurrentPrice = typeof data.currentPrice === 'string' ? parseFloat(data.currentPrice) : data.currentPrice;

    const result = await handleSuggestCompetitivePrice({
        ...data,
        currentPrice: numericCurrentPrice,
    });

    if (result.success && result.data) {
      setPricingResult({ ...result.data, currentPrice: numericCurrentPrice });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to suggest price.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Smart Pricing Assistant</CardTitle>
        <CardDescription>Get AI-powered competitive pricing suggestions based on product details, current trends, and competitor data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'High-performance gaming mouse, 16000 DPI, RGB lighting, 10 programmable buttons...'"
                      className="resize-none"
                      rows={3}
                      {...field}
                      aria-label="Product details"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} aria-label="Current price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketTrends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Trends (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Demand for ergonomic accessories is increasing.' or 'Competitors are offering seasonal discounts.'"
                      className="resize-none"
                      rows={2}
                      {...field}
                      aria-label="Market trends"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="competitorPrices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor Prices (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'SimilarMouseX: $55, MouseProY: $45.50' or 'Average market price for similar items: $50'"
                      className="resize-none"
                      rows={2}
                      {...field}
                      aria-label="Competitor prices"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <> <TrendingUp className="mr-2 h-5 w-5" /> Suggest Price </>
              )}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {pricingResult && (
          <Card className="mt-8 bg-accent/10">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent" />Pricing Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold text-foreground">${pricingResult.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-accent">Suggested Price</p>
                  <p className="text-2xl font-bold text-accent">${pricingResult.suggestedPrice.toFixed(2)}</p>
                </div>
              </div>
               {pricingResult.currentPrice !== pricingResult.suggestedPrice && (
                <div className={`text-center p-2 rounded-md ${pricingResult.suggestedPrice < pricingResult.currentPrice ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {pricingResult.suggestedPrice < pricingResult.currentPrice
                    ? `Potential increase in competitiveness by reducing price.`
                    : `Potential for increased margin. Carefully consider market position.`}
                </div>
              )}
              <div>
                <h3 className="font-semibold font-headline mt-2">Reasoning:</h3>
                <p className="text-sm text-foreground whitespace-pre-line">{pricingResult.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
