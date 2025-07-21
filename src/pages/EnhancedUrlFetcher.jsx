import React, { useState } from 'react';
import { webScraper } from '../utils/webScraper';
import { useGemini } from '../hooks/useGemini';
import { fetchContentWithGoogleContext } from '../services/api/googleUrlFetcherService';

const EnhancedUrlFetcher = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingOption, setProcessingOption] = useState('extract');
  const [processedContent, setProcessedContent] = useState(null);
  const [processingLoading, setProcessingLoading] = useState(false);

  const { summarizeText, generateContent, isInitialized } = useGemini();

  const processingOptions = {
    extract: {
      name: 'Extract Only',
      description: 'Just extract and display the content'
    },
    summarize: {
      name: 'Summarize',
      description: 'Extract and create a summary'
    },
    keypoints: {
      name: 'Key Points',
      description: 'Extract main points and insights'
    },
    rewrite: {
      name: 'Rewrite',
      description: 'Rewrite in a different style or format'
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setContent(null);
    setProcessedContent(null);

    try {
      let result = null;
      try {
        // Attempt to fetch using Google context first
        result = await fetchContentWithGoogleContext(url);
        if (!result) {
          throw new Error('Google context returned no content, falling back to web scraper.');
        }
      } catch (googleErr) {
        console.warn('Google context fetch failed or returned no content, falling back to web scraper:', googleErr.message);
        result = await webScraper.fetchContent(url);
      }

      setContent(result);
      
      // Auto-process if option is selected and Gemini is available
      if (processingOption !== 'extract' && isInitialized) {
        await handleProcess(result);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(`Failed to fetch content: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (contentData = content) => {
    if (!contentData || !isInitialized) return;

    setProcessingLoading(true);
    setError(null);

    try {
      let result;
      const text = contentData.content;

      switch (processingOption) {
        case 'summarize':
          result = await summarizeText(text, 'paragraph', 'medium');
          setProcessedContent({
            type: 'Summary',
            content: result.content
          });
          break;

        case 'keypoints':
          result = await generateContent(`Extract the key points and main insights from this content in bullet format:\n\n${text}`);
          setProcessedContent({
            type: 'Key Points',
            content: result.content
          });
          break;

        case 'rewrite':
          result = await generateContent(`Rewrite this content in a clear, engaging, and well-structured format:\n\n${text}`);
          setProcessedContent({
            type: 'Rewritten Content',
            content: result.content
          });
          break;

        default:
          break;
      }
    } catch (err) {
      console.error('Error processing content:', err);
      setError(`Processing failed: ${err.message}`);
    } finally {
      setProcessingLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              URL Input
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website URL *
              </label>
              <input
                type="url"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {url && !isValidUrl(url) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid URL</p>
              )}
            </div>

            {/* Processing Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Processing Option
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={processingOption}
                onChange={(e) => setProcessingOption(e.target.value)}
                disabled={!isInitialized && processingOption !== 'extract'}
              >
                {Object.entries(processingOptions).map(([key, option]) => (
                  <option key={key} value={key} disabled={!isInitialized && key !== 'extract'}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {processingOptions[processingOption].description}
                {!isInitialized && processingOption !== 'extract' && ' (Requires API key)'}
              </p>
            </div>

            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleFetch}
              disabled={loading || !url.trim() || !isValidUrl(url)}
            >
              {loading ? 'Fetching...' : 'Fetch Content'}
            </button>
          </div>

          {/* Quick Actions */}
          {content && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  onClick={() => handleCopy(content.content)}
                >
                  Copy Content
                </button>
                <button
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  onClick={() => handleDownload(content.content, `${content.title.replace(/[^a-z0-9]/gi, '_')}.txt`)}
                >
                  Download Content
                </button>
                {isInitialized && processingOption === 'extract' && (
                  <button
                    className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                    onClick={() => handleProcess()}
                    disabled={processingLoading}
                  >
                    {processingLoading ? 'Processing...' : 'Process Content'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error</h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Extracted Content */}
          {content && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                      {content.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {content.url}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span>Words: {content.wordCount}</span>
                      {content.author && <span>Author: {content.author}</span>}
                      {content.publishDate && (
                        <span>Published: {new Date(content.publishDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  {content.image && (
                    <img 
                      src={content.image} 
                      alt="Featured" 
                      className="w-20 h-20 object-cover rounded-lg ml-4"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
              </div>
              
              {content.description && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Description:</strong> {content.description}
                  </p>
                </div>
              )}

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {content.content}
                  </pre>
                </div>
              </div>

              {content.keywords && content.keywords.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {content.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Processed Content */}
          {processedContent && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    {processedContent.type}
                  </h3>
                  <button
                    onClick={() => handleCopy(processedContent.content)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {processedContent.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!content && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a URL and click fetch to extract content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
          ℹ️ How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <h4 className="font-medium mb-2">Supported Content:</h4>
            <ul className="space-y-1">
              <li>• News articles and blog posts</li>
              <li>• Documentation and guides</li>
              <li>• Research papers and reports</li>
              <li>• Product pages and reviews</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Limitations:</h4>
            <ul className="space-y-1">
              <li>• Some sites block automated access</li>
              <li>• JavaScript-heavy sites may not work</li>
              <li>• Login-required content not accessible</li>
              <li>• Rate limits may apply</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUrlFetcher;

