import { useState, useEffect, useCallback } from 'react';
import { geminiService } from '../services/gemini/geminiService';

export const useGemini = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');

  // Initialize service when API key changes
  useEffect(() => {
    if (apiKey) {
      try {
        geminiService.initialize(apiKey);
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err.message);
        setIsInitialized(false);
      }
    } else {
      setIsInitialized(false);
    }
  }, [apiKey]);

  // Update API key
  const updateApiKey = useCallback((newApiKey) => {
    setApiKey(newApiKey);
    localStorage.setItem('geminiApiKey', newApiKey);
  }, []);

  // Generic generate content function
  const generateContent = useCallback(async (prompt, options = {}) => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateContent(prompt, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

   const generateImage = useCallback(async (prompt, options = {}) => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateImage(prompt, options);
      return {
        image: `data:image/png;base64,${result.image}`,
        text: result.text || ''
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Streaming content generation
  const generateStreamContent = useCallback(async (prompt, onChunk) => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateStreamContent(prompt, onChunk);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Blog post generation
  const generateBlogPost = useCallback(async (topic, customPrompt = '', template = 'standard') => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateBlogPost(topic, customPrompt, template);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Text summarization
  const summarizeText = useCallback(async (text, style = 'paragraph', length = 'medium') => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.summarizeText(text, style, length);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Social media post generation
  const generateSocialPost = useCallback(async (content, platform, tone = 'professional') => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateSocialPost(content, platform, tone);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // AI prompt generation
  const generateAIPrompt = useCallback(async (type, description, style = '') => {
    if (!isInitialized) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.generateAIPrompt(type, description, style);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Validate API key
  const validateApiKey = useCallback(async (keyToValidate) => {
    setLoading(true);
    setError(null);

    try {
      const result = await geminiService.validateApiKey(keyToValidate);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isInitialized,
    loading,
    error,
    apiKey,
    updateApiKey,
    generateContent,
    generateStreamContent,
    generateBlogPost,
    summarizeText,
    generateSocialPost,
    generateAIPrompt,
    validateApiKey,
    generateImage,
    clearError: () => setError(null)
  };
};

