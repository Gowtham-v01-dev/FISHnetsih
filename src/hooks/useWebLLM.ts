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
  restoreConversation: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => void;
}

// Global engine instance shared across all components
let globalEngine: MLCEngineInterface | null = null;
let globalInitPromise: Promise<MLCEngineInterface> | null = null;
let globalInitialized = false;
let globalError: string | null = null;

// Preload function that can be called from anywhere
export async function preloadWebLLM(
  onProgress?: (progress: string) => void
): Promise<MLCEngineInterface | null> {
  // Return existing engine if already initialized
  if (globalEngine && globalInitialized) {
    return globalEngine;
  }

  // Return existing promise if initialization is in progress
  if (globalInitPromise) {
    return globalInitPromise;
  }

  // Check WebGPU support
  if (!(navigator as any).gpu) {
    globalError = 'WebGPU is not supported in this browser. Please use Chrome, Edge, or another WebGPU-compatible browser.';
    return null;
  }

  // Start new initialization
  globalInitPromise = (async () => {
    try {
      const selectedModel = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
      
      const mlcEngine = await CreateMLCEngine(
        selectedModel,
        {
          initProgressCallback: (report: InitProgressReport) => {
            onProgress?.(report.text);
          },
        }
      );

      globalEngine = mlcEngine;
      globalInitialized = true;
      globalError = null;
      onProgress?.('Model loaded successfully!');
      
      return mlcEngine;
    } catch (err: any) {
      console.error('Failed to initialize web-llm engine:', err);
      globalError = err.message || 'Failed to initialize AI model. Please refresh and try again.';
      globalInitPromise = null;
      throw err;
    }
  })();

  return globalInitPromise;
}

export function useWebLLM(): UseWebLLMResult {
  const [engine, setEngine] = useState<MLCEngineInterface | null>(globalEngine);
  const [loading, setLoading] = useState(!globalInitialized && !globalError);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(globalError);
  const [initialized, setInitialized] = useState(globalInitialized);
  const conversationHistory = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const initStarted = useRef(false);

  useEffect(() => {
    // Use global engine if already available
    if (globalEngine && globalInitialized) {
      setEngine(globalEngine);
      setInitialized(true);
      setLoading(false);
      setError(null);
      return;
    }

    // Use global error if available
    if (globalError) {
      setError(globalError);
      setLoading(false);
      return;
    }

    // Start initialization if not started
    if (!initStarted.current && !globalInitPromise) {
      initStarted.current = true;
      setLoading(true);
      
      preloadWebLLM((progressText) => {
        setProgress(progressText);
      })
        .then((mlcEngine) => {
          if (mlcEngine) {
            setEngine(mlcEngine);
            setInitialized(true);
            setError(null);
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to initialize AI model');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (globalInitPromise) {
      // Join existing initialization
      setLoading(true);
      globalInitPromise
        .then((mlcEngine) => {
          setEngine(mlcEngine);
          setInitialized(true);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || 'Failed to initialize AI model');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const sendMessage = useCallback(async (userMessage: string, onChunk?: (text: string) => void): Promise<string> => {
    const currentEngine = globalEngine || engine;
    
    if (!currentEngine || !globalInitialized) {
      throw new Error('AI model is not ready yet. Please wait for initialization to complete.');
    }

    conversationHistory.current.push({
      role: 'user',
      content: userMessage,
    });

    try {
      if (onChunk) {
        let fullResponse = '';
        const asyncChunkGenerator = await currentEngine.chat.completions.create({
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
        const completion = await currentEngine.chat.completions.create({
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
  }, [engine]);

  const resetConversation = useCallback(() => {
    conversationHistory.current = [];
  }, []);

  const restoreConversation = useCallback((messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    conversationHistory.current = messages;
  }, []);

  return {
    engine,
    loading,
    progress,
    error,
    initialized,
    sendMessage,
    resetConversation,
    restoreConversation,
  };
}
