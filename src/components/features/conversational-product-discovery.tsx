"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleConversationalProductDiscovery } from '@/lib/actions';
import ProductCard from '@/components/shared/product-card';
import type { Product as ProductType } from '@/types';
import { Bot, Search, User } from 'lucide-react';

const FormSchema = z.object({
  description: z.string().min(10, { message: "Please describe what you're looking for in at least 10 characters." }),
});

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string | ProductType[];
};

export default function ConversationalProductDiscovery() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { description: '' },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: data.description }]);

    const result = await handleConversationalProductDiscovery({ description: data.description });

    if (result.success && result.data) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', content: result.data.products }]);
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to fetch product suggestions.",
      });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', content: "Sorry, I couldn't find products based on your description." }]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center"><Search className="mr-2 h-6 w-6 text-primary" />Conversational Product Discovery</CardTitle>
        <CardDescription>Describe what you're looking for, and our AI will suggest relevant products.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you looking for?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'a lightweight laptop for travel with a long battery life' or 'eco-friendly yoga mat'"
                      className="resize-none"
                      rows={3}
                      {...field}
                      aria-label="Product description input"
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
                  Searching...
                </>
              ) : (
                <> <Search className="mr-2 h-5 w-5" /> Find Products</>
              )}
            </Button>
          </form>
        </Form>

        {messages.length > 0 && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/30">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-lg shadow ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    {msg.type === 'user' && <div className="flex items-center gap-2 mb-1"><User className="h-5 w-5" /><span className="font-semibold">You</span></div>}
                    {msg.type === 'ai' && <div className="flex items-center gap-2 mb-1"><Bot className="h-5 w-5 text-accent" /><span className="font-semibold text-accent">SmartCart</span></div>}
                    
                    {typeof msg.content === 'string' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {(msg.content as ProductType[]).length > 0 ? (
                           (msg.content as ProductType[]).map((product, index) => (
                            <ProductCard key={`${msg.id}-product-${index}`} product={product} />
                          ))
                        ) : (
                          <p className="text-sm col-span-full">No products found matching your description.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
               {isLoading && messages[messages.length -1].type === 'user' && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-lg shadow bg-card">
                    <div className="flex items-center gap-2 mb-1"><Bot className="h-5 w-5 text-accent" /><span className="font-semibold text-accent">SmartCart</span></div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
