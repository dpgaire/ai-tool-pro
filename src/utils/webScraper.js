// Web scraping utility for URL content fetching
// Note: This is a client-side implementation with limitations
// For production use, consider a backend service for better scraping capabilities

export class WebScraper {
  constructor() {
    this.corsProxies = [
      'https://api.allorigins.win/get?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/'
    ];
  }

  async fetchContent(url) {
    // Validate URL
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    // Try different methods to fetch content
    const methods = [
      () => this.fetchWithCorsProxy(url),
      () => this.fetchDirect(url),
      () => this.extractFromMetaTags(url)
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result && result.content) {
          return result;
        }
      } catch (error) {
        console.warn('Fetch method failed:', error.message);
        continue;
      }
    }

    throw new Error('Unable to fetch content from the provided URL. The site may not allow cross-origin requests.');
  }

  async fetchWithCorsProxy(url) {
    for (const proxy of this.corsProxies) {
      try {
        const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/html, */*',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const html = data.contents || data.data || data;
        
        return this.parseHtmlContent(html, url);
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All CORS proxies failed');
  }

  async fetchDirect(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (compatible; AI-Tools-Bot/1.0)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      return this.parseHtmlContent(html, url);
    } catch (error) {
      throw new Error(`Direct fetch failed: ${error.message}`);
    }
  }

  parseHtmlContent(html, url) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract metadata
    const title = this.extractTitle(doc);
    const description = this.extractDescription(doc);
    const author = this.extractAuthor(doc);
    const publishDate = this.extractPublishDate(doc);
    const image = this.extractFeaturedImage(doc, url);

    // Extract main content
    const content = this.extractMainContent(doc);

    // Extract keywords/tags
    const keywords = this.extractKeywords(doc);

    return {
      url,
      title,
      description,
      author,
      publishDate,
      image,
      content,
      keywords,
      wordCount: this.countWords(content),
      extractedAt: new Date().toISOString()
    };
  }

  extractTitle(doc) {
    // Try different title sources in order of preference
    const selectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title',
      'h1'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const title = element.getAttribute('content') || element.textContent;
        if (title && title.trim()) {
          return title.trim();
        }
      }
    }

    return 'Untitled';
  }

  extractDescription(doc) {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const description = element.getAttribute('content');
        if (description && description.trim()) {
          return description.trim();
        }
      }
    }

    // Fallback: extract first paragraph
    const firstParagraph = doc.querySelector('p');
    if (firstParagraph && firstParagraph.textContent) {
      return firstParagraph.textContent.trim().substring(0, 200) + '...';
    }

    return '';
  }

  extractAuthor(doc) {
    const selectors = [
      'meta[name="author"]',
      'meta[property="article:author"]',
      '[rel="author"]',
      '.author',
      '.byline'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const author = element.getAttribute('content') || element.textContent;
        if (author && author.trim()) {
          return author.trim();
        }
      }
    }

    return '';
  }

  extractPublishDate(doc) {
    const selectors = [
      'meta[property="article:published_time"]',
      'meta[name="publish_date"]',
      'time[datetime]',
      '.publish-date',
      '.date'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const date = element.getAttribute('content') || 
                    element.getAttribute('datetime') || 
                    element.textContent;
        if (date && date.trim()) {
          return new Date(date.trim()).toISOString();
        }
      }
    }

    return '';
  }

  extractFeaturedImage(doc, baseUrl) {
    const selectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'img[class*="featured"]',
      'img[class*="hero"]',
      'article img:first-of-type'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const src = element.getAttribute('content') || element.getAttribute('src');
        if (src) {
          return this.resolveUrl(src, baseUrl);
        }
      }
    }

    return '';
  }

  extractMainContent(doc) {
    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 
      '.advertisement', '.ads', '.sidebar', '.menu',
      '.comments', '.social-share', '.related-posts'
    ];

    unwantedSelectors.forEach(selector => {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Try to find main content area
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content'
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        return this.cleanText(element.textContent || element.innerText);
      }
    }

    // Fallback: extract all paragraphs
    const paragraphs = doc.querySelectorAll('p');
    const content = Array.from(paragraphs)
      .map(p => p.textContent || p.innerText)
      .filter(text => text && text.trim().length > 50)
      .join('\n\n');

    return this.cleanText(content);
  }

  extractKeywords(doc) {
    const keywordElements = doc.querySelectorAll('meta[name="keywords"]');
    const keywords = [];

    keywordElements.forEach(element => {
      const content = element.getAttribute('content');
      if (content) {
        keywords.push(...content.split(',').map(k => k.trim()));
      }
    });

    return keywords.filter(k => k.length > 0);
  }

  cleanText(text) {
    if (!text) return '';

    return text
      .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n')  // Clean up line breaks
      .trim();
  }

  countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  }

  resolveUrl(url, baseUrl) {
    if (!url) return '';
    
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  async extractFromMetaTags(url) {
    // This is a fallback method that tries to get basic info
    // without full content extraction
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      return {
        url,
        title: 'Content Available',
        description: 'Content extraction limited due to CORS restrictions. Please try a different URL or use a backend service for full content extraction.',
        content: 'Unable to extract full content due to browser security restrictions.',
        extractedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error('Unable to access the URL');
    }
  }
}

export const webScraper = new WebScraper();

