// services/api/googleUrlFetcherService.js

export const fetchContentWithGoogleContext = async (url) => {
  try {
    // First, try to fetch the Google cache version of the URL
    const googleCacheUrl = `http://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}&strip=1`;
    
    const response = await fetch(googleCacheUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Google cache not available');
    }

    const html = await response.text();
    
    // Parse the HTML to extract the main content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove unwanted elements (scripts, styles, etc.)
    const unwantedElements = doc.querySelectorAll('script, style, noscript, iframe, nav, footer');
    unwantedElements.forEach(el => el.remove());
    
    // Try to find the main content - this is a basic approach
    let mainContent = doc.querySelector('main') || 
                     doc.querySelector('article') || 
                     doc.querySelector('.post-content') || 
                     doc.body;
    
    // Get clean text content
    const textContent = mainContent.textContent
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!textContent || textContent.length < 100) {
      throw new Error('Insufficient content from Google cache');
    }
    
    // Extract metadata
    const title = doc.querySelector('title')?.textContent || 'Untitled';
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                 doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';
    
    // Extract keywords if available
    const keywordsMeta = doc.querySelector('meta[name="keywords"]');
    const keywords = keywordsMeta ? 
      keywordsMeta.getAttribute('content').split(',').map(k => k.trim()) : [];
    
    // Word count estimation
    const wordCount = textContent.split(/\s+/).length;
    
    return {
      url,
      title,
      description,
      content: textContent,
      wordCount,
      image,
      keywords,
      author: doc.querySelector('meta[name="author"]')?.getAttribute('content') || '',
      publishDate: doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || ''
    };
    
  } catch (error) {
    console.error('Google context fetch error:', error);
    return null;
  }
};