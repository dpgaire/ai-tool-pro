import { useState, useEffect, useCallback } from 'react';
import { pexelsService } from '../services/pexels/pexelsService';

export const usePexels = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pexelsApiKey') || '');
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Initialize service when API key changes
  useEffect(() => {
    if (apiKey) {
      try {
        pexelsService.initialize(apiKey);
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
    localStorage.setItem('pexelsApiKey', newApiKey);
  }, []);

  // Generic request handler
  const handleRequest = useCallback(async (requestFn) => {
    if (!isInitialized) {
      throw new Error('Pexels service not initialized. Please set your API key.');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      setRateLimitInfo(result.rateLimitInfo);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Search photos
  const searchPhotos = useCallback(async (query, options = {}) => {
    return handleRequest(() => pexelsService.searchPhotos(query, options));
  }, [handleRequest]);

  // Get curated photos
  const getCuratedPhotos = useCallback(async (options = {}) => {
    return handleRequest(() => pexelsService.getCuratedPhotos(options));
  }, [handleRequest]);

  // Get specific photo
  const getPhoto = useCallback(async (id) => {
    return handleRequest(() => pexelsService.getPhoto(id));
  }, [handleRequest]);

  // Search videos
  const searchVideos = useCallback(async (query, options = {}) => {
    return handleRequest(() => pexelsService.searchVideos(query, options));
  }, [handleRequest]);

  // Get popular videos
  const getPopularVideos = useCallback(async (options = {}) => {
    return handleRequest(() => pexelsService.getPopularVideos(options));
  }, [handleRequest]);

  // Get specific video
  const getVideo = useCallback(async (id) => {
    return handleRequest(() => pexelsService.getVideo(id));
  }, [handleRequest]);

  // Get featured collections
  const getFeaturedCollections = useCallback(async (options = {}) => {
    return handleRequest(() => pexelsService.getFeaturedCollections(options));
  }, [handleRequest]);

  // Get collection media
  const getCollectionMedia = useCallback(async (id, options = {}) => {
    return handleRequest(() => pexelsService.getCollectionMedia(id, options));
  }, [handleRequest]);

  // Download image
  const downloadImage = useCallback(async (imageUrl, filename) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await pexelsService.downloadImage(imageUrl);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `pexels-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Download video
  const downloadVideo = useCallback(async (videoUrl, filename) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await pexelsService.downloadVideo(videoUrl);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `pexels-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate API key
  const validateApiKey = useCallback(async (keyToValidate) => {
    setLoading(true);
    setError(null);

    try {
      const result = await pexelsService.validateApiKey(keyToValidate);
      if (result.rateLimitInfo) {
        setRateLimitInfo(result.rateLimitInfo);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get trending searches
  const getTrendingSearches = useCallback(() => {
    return pexelsService.getTrendingSearches();
  }, []);

  return {
    isInitialized,
    loading,
    error,
    apiKey,
    rateLimitInfo,
    updateApiKey,
    searchPhotos,
    getCuratedPhotos,
    getPhoto,
    searchVideos,
    getPopularVideos,
    getVideo,
    getFeaturedCollections,
    getCollectionMedia,
    downloadImage,
    downloadVideo,
    validateApiKey,
    getTrendingSearches,
    clearError: () => setError(null)
  };
};

