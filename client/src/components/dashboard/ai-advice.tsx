import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAIAdvice, type AIAdviceResponse } from '@/lib/openai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Lightbulb } from 'lucide-react';
import type { Expense } from '@shared/schema';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIAdvice() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const adviceMutation = useMutation({
    mutationFn: getAIAdvice,
    onMutate: () => {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Can you analyze my recent expenses and give me some saving tips?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
    },
    onSuccess: (data: AIAdviceResponse) => {
      setIsTyping(false);
      
      // Add AI response with typing effect
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.tips.join('\n\n'),
        timestamp: new Date(),
      };
      
      // Simulate typing animation
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "Error getting AI advice",
        description: error.message || "Failed to get personalized advice",
        variant: "destructive",
      });
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble analyzing your expenses right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleGetAdvice = () => {
    if (expenses.length === 0) {
      toast({
        title: "No expenses found",
        description: "Add some expenses first to get personalized advice",
        variant: "destructive",
      });
      return;
    }
    
    adviceMutation.mutate(expenses);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Get Smart Advice</h2>
        <p className="text-muted-foreground">AI-powered insights based on your spending patterns</p>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Button 
              onClick={handleGetAdvice}
              disabled={adviceMutation.isPending || expenses.length === 0}
              className="bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white py-3 px-8 text-lg font-semibold"
              data-testid="button-get-advice"
            >
              <Bot className="h-5 w-5 mr-2" />
              Get Personalized Advice
            </Button>
          </div>

          {/* Chat Interface */}
          <div className="space-y-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to help!</h3>
                <p className="text-muted-foreground">
                  Click the button above to get AI-powered insights about your spending habits
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.type}-${message.id}`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 max-w-md ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/20 text-foreground'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-accent mb-1">Budget Buddy AI</p>
                          <div className="space-y-2">
                            {message.content.split('\n\n').map((tip, index) => (
                              <p key={index} className="text-sm">
                                <Lightbulb className="inline h-4 w-4 mr-1 text-accent" />
                                <strong>Tip {index + 1}:</strong> {tip.replace(/^💡\s*Tip\s*\d+:\s*/, '')}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {message.type === 'user' && (
                      <div className="flex items-start space-x-2">
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        <p className="text-sm">{message.content}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {/* Loading State */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
                data-testid="ai-loading"
              >
                <div className="bg-muted/20 text-foreground rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
