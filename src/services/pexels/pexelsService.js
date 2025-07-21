class PexelsService {
  constructor() {
    this.baseUrl = 'https://api.pexels.com/v1';
    this.videoBaseUrl = 'https://api.pexels.com/videos';
    this.apiKey = null;
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Pexels API key is required');
    }
    this.apiKey = apiKey;
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async makeRequest(url, options = {}) {
    if (!this.apiKey) {
      throw new Error('Pexels service not initialized. Please set your API key.');
    }

    await this.enforceRateLimit();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Pexels API key. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 400) {
          throw new Error('Bad request. Please check your search parameters.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      // Extract rate limit information from headers
      const rateLimitInfo = {
        limit: response.headers.get('X-Ratelimit-Limit'),
        remaining: response.headers.get('X-Ratelimit-Remaining'),
        reset: response.headers.get('X-Ratelimit-Reset')
      };

      return {
        success: true,
        data: data,
        rateLimitInfo: rateLimitInfo
      };
    } catch (error) {
      console.error('Pexels API Error:', error);
      throw error;
    }
  }

  // Search for photos
  async searchPhotos(query, options = {}) {
    const {
      page = 1,
      perPage = 15,
      orientation = null, // 'landscape', 'portrait', 'square'
      size = null, // 'large', 'medium', 'small'
      color = null, // 'red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'violet', 'pink', 'brown', 'black', 'gray', 'white'
      locale = 'en-US'
    } = options;

    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString(),
      locale: locale
    });

    if (orientation) params.append('orientation', orientation);
    if (size) params.append('size', size);
    if (color) params.append('color', color);

    const url = `${this.baseUrl}/search?${params.toString()}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: {
        ...result.data,
        photos: result.data.photos.map(photo => this.formatPhoto(photo))
      }
    };
  }

  // Get curated photos
  async getCuratedPhotos(options = {}) {
    const {
      page = 1,
      perPage = 15
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString()
    });

    const url = `${this.baseUrl}/curated?${params.toString()}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: {
        ...result.data,
        photos: result.data.photos.map(photo => this.formatPhoto(photo))
      }
    };
  }

  // Get a specific photo by ID
  async getPhoto(id) {
    const url = `${this.baseUrl}/photos/${id}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: this.formatPhoto(result.data)
    };
  }

  // Search for videos
  async searchVideos(query, options = {}) {
    const {
      page = 1,
      perPage = 15,
      minWidth = null,
      minHeight = null,
      minDuration = null,
      maxDuration = null,
      orientation = null, // 'landscape', 'portrait', 'square'
      locale = 'en-US'
    } = options;

    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString(),
      locale: locale
    });

    if (minWidth) params.append('min_width', minWidth.toString());
    if (minHeight) params.append('min_height', minHeight.toString());
    if (minDuration) params.append('min_duration', minDuration.toString());
    if (maxDuration) params.append('max_duration', maxDuration.toString());
    if (orientation) params.append('orientation', orientation);

    const url = `${this.videoBaseUrl}/search?${params.toString()}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: {
        ...result.data,
        videos: result.data.videos.map(video => this.formatVideo(video))
      }
    };
  }

  // Get popular videos
  async getPopularVideos(options = {}) {
    const {
      page = 1,
      perPage = 15,
      minWidth = null,
      minHeight = null,
      minDuration = null,
      maxDuration = null,
      orientation = null
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString()
    });

    if (minWidth) params.append('min_width', minWidth.toString());
    if (minHeight) params.append('min_height', minHeight.toString());
    if (minDuration) params.append('min_duration', minDuration.toString());
    if (maxDuration) params.append('max_duration', maxDuration.toString());
    if (orientation) params.append('orientation', orientation);

    const url = `${this.videoBaseUrl}/popular?${params.toString()}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: {
        ...result.data,
        videos: result.data.videos.map(video => this.formatVideo(video))
      }
    };
  }

  // Get a specific video by ID
  async getVideo(id) {
    const url = `${this.videoBaseUrl}/videos/${id}`;
    const result = await this.makeRequest(url);

    return {
      ...result,
      data: this.formatVideo(result.data)
    };
  }

  // Format photo data for consistent structure
  formatPhoto(photo) {
    return {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      url: photo.url,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      photographerId: photo.photographer_id,
      avgColor: photo.avg_color,
      alt: photo.alt,
      src: {
        original: photo.src.original,
        large2x: photo.src.large2x,
        large: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
        portrait: photo.src.portrait,
        landscape: photo.src.landscape,
        tiny: photo.src.tiny
      },
      liked: photo.liked || false
    };
  }

  // Format video data for consistent structure
  formatVideo(video) {
    return {
      id: video.id,
      width: video.width,
      height: video.height,
      duration: video.duration,
      url: video.url,
      image: video.image,
      fullRes: video.full_res,
      tags: video.tags || [],
      user: {
        id: video.user.id,
        name: video.user.name,
        url: video.user.url
      },
      videoFiles: video.video_files.map(file => ({
        id: file.id,
        quality: file.quality,
        fileType: file.file_type,
        width: file.width,
        height: file.height,
        fps: file.fps,
        link: file.link
      })),
      videoPictures: video.video_pictures.map(picture => ({
        id: picture.id,
        nr: picture.nr,
        picture: picture.picture
      }))
    };
  }

  // Download image to blob
  async downloadImage(imageUrl, size = 'large') {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  // Download video to blob
  async downloadVideo(videoUrl) {
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  }

  // Get trending search terms (mock implementation - Pexels doesn't provide this endpoint)
  getTrendingSearches() {
    return [
      'nature', 'business', 'technology', 'people', 'food', 'travel',
      'architecture', 'animals', 'fashion', 'health', 'education',
      'sports', 'music', 'art', 'science', 'lifestyle', 'abstract',
      'landscape', 'city', 'ocean', 'mountains', 'flowers', 'sunset'
    ];
  }

  // Validate API key
  async validateApiKey(apiKey) {
    try {
      const tempService = new PexelsService();
      tempService.initialize(apiKey);
      
      // Try to get curated photos with minimal request
      const result = await tempService.getCuratedPhotos({ page: 1, perPage: 1 });
      
      return {
        valid: true,
        message: 'API key is valid and working',
        rateLimitInfo: result.rateLimitInfo
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message
      };
    }
  }

  // Get collections (featured collections)
  async getFeaturedCollections(options = {}) {
    const {
      page = 1,
      perPage = 15
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString()
    });

    const url = `${this.baseUrl}/collections/featured?${params.toString()}`;
    const result = await this.makeRequest(url);

    return result;
  }

  // Get collection media
  async getCollectionMedia(id, options = {}) {
    const {
      page = 1,
      perPage = 15,
      type = 'photos' // 'photos' or 'videos'
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: Math.min(perPage, 80).toString(),
      type: type
    });

    const url = `${this.baseUrl}/collections/${id}?${params.toString()}`;
    const result = await this.makeRequest(url);

    return result;
  }
}

// Export singleton instance
export const pexelsService = new PexelsService();
export default PexelsService;

