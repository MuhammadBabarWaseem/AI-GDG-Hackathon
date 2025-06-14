"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleSmartCartOptimizer } from '@/lib/actions';
import type { SmartCartOptimizerOutput } from '@/ai/flows/smart-cart-optimizer';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ShoppingCart, ThumbsUp } from 'lucide-react';

const FormSchema = z.object({
  cartItems: z.string().min(3, { message: "Please list at least one item." }),
  budget: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive({ message: "Budget must be a positive number." }).optional()
  ),
});

export default function SmartCartOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<SmartCartOptimizerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { cartItems: '', budget: '' }, 
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    setOptimizationResult(null);
    
    const processedData = {
      ...data,
      budget: data.budget === '' || data.budget === undefined || data.budget === null ? undefined : Number(data.budget),
    };

    const result = await handleSmartCartOptimizer(processedData);

    if (result.success && result.data) {
      setOptimizationResult(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to optimize cart.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center"><ShoppingCart className="mr-2 h-6 w-6 text-primary" />Smart Cart Optimizer</CardTitle>
        <CardDescription>Get AI-powered suggestions for better bundles or similar items to optimize your shopping cart.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cartItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Cart Items</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Laptop, Mouse, Keyboard OR iPhone 15 Pro, AirPods Pro"
                      className="resize-none"
                      rows={3}
                      {...field}
                      aria-label="Current cart items"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter items separated by commas or on new lines.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional: Your Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} aria-label="Budget input" />
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
                  Optimizing...
                </>
              ) : (
                <> <Lightbulb className="mr-2 h-5 w-5" /> Optimize Cart </>
              )}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {optimizationResult && (
          <div className="mt-8 space-y-6">
            <Card className="bg-accent/10">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><ThumbsUp className="mr-2 h-5 w-5 text-accent" />Optimization Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{optimizationResult.summary}</p>
              </CardContent>
            </Card>
            
            <h3 className="text-lg font-semibold font-headline">Suggestions:</h3>
            {optimizationResult.suggestions.length > 0 ? (
              <ScrollArea className="h-[300px] w-full rounded-md">
                <div className="space-y-4 pr-4">
                {optimizationResult.suggestions.map((suggestion, index) => (
                  <Card key={index} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-md font-headline">{suggestion.item}</CardTitle>
                      {suggestion.price && (
                        <Badge variant="outline" className="w-fit">${suggestion.price.toFixed(2)}</Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No specific suggestions at this time, but your cart looks good!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
