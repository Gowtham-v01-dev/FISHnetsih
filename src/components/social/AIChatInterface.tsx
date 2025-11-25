import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWebLLM } from '@/hooks/useWebLLM';
import { authService } from '@/services/auth';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export const AIChatInterface = () => {
  const { engine, loading, progress, error, initialized, sendMessage } = useWebLLM();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentUser] = useState(authService.getState().user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialized && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I\'m your AI fishing assistant. I can help you with fishing tips, species information, techniques, and answer any questions you have about fishing. What would you like to know?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialized]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !initialized || isGenerating) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsGenerating(true);

    const assistantMessageId = `assistant_${Date.now()}`;
    const streamingMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, streamingMessage]);

    try {
      await sendMessage(
        newMessage,
        (partialResponse) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: partialResponse, isStreaming: true }
                : msg
            )
          );
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      console.error('Error sending message:', err);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  if (error) {
    return (
      <div className="h-[calc(100dvh-180px)] flex items-center justify-center p-4 bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <p className="font-semibold mb-2">AI Model Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">
              Please make sure you're using a WebGPU-compatible browser like Chrome or Edge.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[calc(100dvh-180px)] flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading AI Model...</h3>
          <p className="text-sm text-muted-foreground mb-4">{progress}</p>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            This may take a minute on first load. The model is being downloaded and cached for offline use.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-180px)] flex flex-col bg-background">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Avatar className="h-10 w-10 bg-gradient-primary">
          <AvatarFallback className="bg-gradient-primary text-white">
            <Bot size={20} />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">AI Fishing Assistant</h3>
          <p className="text-xs text-muted-foreground">
            {initialized ? 'Online • Powered by Llama 3.2' : 'Initializing...'}
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.role === 'user';
            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                {!isOwn && (
                  <Avatar className="h-8 w-8 bg-gradient-primary">
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2',
                    isOwn
                      ? 'bg-gradient-primary text-white'
                      : 'bg-muted text-foreground'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse"></span>
                    )}
                  </p>
                  {!message.isStreaming && (
                    <p
                      className={cn(
                        'text-xs mt-1',
                        isOwn ? 'text-white/70' : 'text-muted-foreground'
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about fishing..."
            className="flex-1"
            disabled={!initialized || isGenerating}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !initialized || isGenerating}
            className="bg-gradient-primary hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
