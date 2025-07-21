import React, { useState } from 'react';

const FetchContentUrl = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    setContent(null);

    // Due to CORS restrictions, direct client-side fetching of arbitrary URLs is not possible.
    // A backend proxy is required to fetch content from external domains.
    // This is a placeholder for where a backend API call would be made.
    try {
      // Example of how you *would* fetch if CORS was not an issue or if you had a proxy:
      // const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const text = await response.text();
      // setContent(text);

      setError(
        'Direct fetching of external URLs is blocked by CORS. ' +
        'Please implement a backend proxy to fetch content from arbitrary URLs.'
      );
    } catch (err) {
      console.error("Error fetching content:", err);
      setError('Failed to fetch content. Please check the URL and your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Fetch Content from URL</h1>
      <p className="text-lg mb-4">Enter a URL to fetch its content.</p>
      <input
        type="text"
        className="w-full p-4 border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={fetchContent}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {content && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Fetched Content</h2>
          <div className="prose dark:prose-invert max-w-none overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap break-words">{content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchContentUrl;