
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleAiChatbot } from '@/lib/actions';
import type { ChatMessage } from '@/types';
import { Bot, MessageSquare, Send, User, Info, MessageCircle } from 'lucide-react';

const FormSchema = z.object({
  query: z.string().min(1, { message: "Query cannot be empty." }),
  productDetails: z.string().optional(),
  pastConvo: z.string().optional(), // This will be auto-populated and read-only
});

const formatMessagesToHistory = (messages: ChatMessage[]): string => {
  return messages
    .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}`)
    .join('\n');
};

export default function AiChatbot() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { query: '', productDetails: '', pastConvo: '' },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth'});
    }
  }, [messages]);

  useEffect(() => {
    // Auto-update the pastConvo form field when messages change
    const conversationHistory = formatMessagesToHistory(messages);
    form.setValue('pastConvo', conversationHistory);
  }, [messages, form]);

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    setIsLoading(true);
    const userMessageContent = data.query;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: userMessageContent,
      timestamp: new Date(),
    };
    
    // Use a callback for setMessages to ensure we're working with the latest state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // The 'pastConvo' for the AI should be the history *before* this new user message.
    // So, we format the messages array *before* adding the current userMessage to it for the AI call.
    // However, the form.getValues('pastConvo') will reflect history *including* the latest update from useEffect.
    // For the AI, let's send the history that was in the form field *before* this submit cycle's message update.
    // The form.setValue in useEffect updates 'pastConvo' *after* messages array is updated.
    // So, data.pastConvo from the form submission already has the history *up to the previous turn*.

    const result = await handleAiChatbot({ 
      query: userMessageContent,
      productDetails: data.productDetails, // This persists in the form field
      pastConvo: data.pastConvo // This is from the read-only, auto-updated form field
    });

    if (result.success && result.data) {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: result.data.response,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "AI failed to respond.",
      });
       const aiError: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, aiError]);
    }
    form.resetField("query"); // Only reset the query field
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl flex flex-col h-[calc(100vh-200px)] max-h-[700px] border border-border">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary" />AI Customer Chatbot</CardTitle>
        <CardDescription>Engage with our AI assistant for automated responses to buyer queries. Context is maintained automatically.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden p-0 sm:p-6">
        <ScrollArea className="flex-grow mb-4 pr-2" ref={scrollAreaRef}>
          <div className="space-y-4 p-4 sm:p-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-accent" />}
                    <span className="font-semibold text-sm">{msg.sender === 'user' ? 'You' : 'ShopMate AI'}</span>
                    <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</p>
                </div>
              </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
               <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-xl shadow-md bg-card border">
                  <div className="flex items-center gap-2 mb-1">
                     <Bot className="h-5 w-5 text-accent" />
                    <span className="font-semibold text-sm">ShopMate AI</span>
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-[50px]" />
                    <Skeleton className="h-3 w-[30px]" />
                  </div>
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-3 p-4 border-t sm:border sm:rounded-lg sm:shadow-md bg-background mt-auto"
          >
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="mb-1 text-xs py-1 h-auto"
            >
              <Info className="mr-1 h-3 w-3" /> {showOptionalFields ? 'Hide' : 'Show'} Optional Context
            </Button>

            {showOptionalFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-md bg-muted/20">
                <FormField
                  control={form.control}
                  name="productDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Product Details (Optional & Persistent)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Specifics about the product in question..." {...field} rows={3} className="text-sm" aria-label="Optional product details"/>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pastConvo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Current Conversation (Auto-Managed)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conversation history will appear here..." 
                          {...field} 
                          rows={3} 
                          className="text-sm bg-input/50" 
                          aria-label="Automatically managed past conversation history"
                          readOnly 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Type your message..." {...field} className="flex-grow" aria-label="Chat message input" autoComplete="off" />
                      <Button type="submit" disabled={isLoading} size="icon" aria-label="Send message">
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    