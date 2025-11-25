import { useState, useEffect, useCallback, useRef } from 'react';
import { CreateMLCEngine, MLCEngineInterface, InitProgressReport } from '@mlc-ai/web-llm';

export interface UseWebLLMResult {
  engine: MLCEngineInterface | null;
  loading: boolean;
  progress: string;
  error: string | null;
  initialized: boolean;
  sendMessage: (message: string, onChunk?: (text: string) => void) => Promise<string>;
  resetConversation: () => void;
}

export function useWebLLM(): UseWebLLMResult {
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const conversationHistory = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (initializationAttempted.current) return;
    
    async function initEngine() {
      if (!(navigator as any).gpu) {
        setError('WebGPU is not supported in this browser. Please use Chrome, Edge, or another WebGPU-compatible browser.');
        setLoading(false);
        return;
      }

      initializationAttempted.current = true;
      setLoading(true);
      setError(null);

      try {
        const selectedModel = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
        
        const mlcEngine = await CreateMLCEngine(
          selectedModel,
          {
            initProgressCallback: (report: InitProgressReport) => {
              setProgress(report.text);
            },
          }
        );

        setEngine(mlcEngine);
        setInitialized(true);
        setProgress('Model loaded successfully!');
      } catch (err: any) {
        console.error('Failed to initialize web-llm engine:', err);
        setError(err.message || 'Failed to initialize AI model. Please refresh and try again.');
        initializationAttempted.current = false;
      } finally {
        setLoading(false);
      }
    }

    initEngine();

    return () => {
      if (engine) {
        engine.unload().catch(console.error);
      }
    };
  }, []);

  const sendMessage = useCallback(async (userMessage: string, onChunk?: (text: string) => void): Promise<string> => {
    if (!engine || !initialized) {
      throw new Error('AI model is not ready yet. Please wait for initialization to complete.');
    }

    conversationHistory.current.push({
      role: 'user',
      content: userMessage,
    });

    try {
      if (onChunk) {
        let fullResponse = '';
        const asyncChunkGenerator = await engine.chat.completions.create({
          messages: conversationHistory.current,
          temperature: 0.7,
          max_tokens: 512,
          stream: true,
        });

        for await (const chunk of asyncChunkGenerator) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            onChunk(fullResponse);
          }
        }

        conversationHistory.current.push({
          role: 'assistant',
          content: fullResponse,
        });

        return fullResponse;
      } else {
        const completion = await engine.chat.completions.create({
          messages: conversationHistory.current,
          temperature: 0.7,
          max_tokens: 512,
        });

        const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        conversationHistory.current.push({
          role: 'assistant',
          content: assistantMessage,
        });

        return assistantMessage;
      }
    } catch (err: any) {
      console.error('Error generating response:', err);
      conversationHistory.current.pop();
      throw new Error('Failed to generate response. Please try again.');
    }
  }, [engine, initialized]);

  const resetConversation = useCallback(() => {
    conversationHistory.current = [];
  }, []);

  return {
    engine,
    loading,
    progress,
    error,
    initialized,
    sendMessage,
    resetConversation,
  };
}
