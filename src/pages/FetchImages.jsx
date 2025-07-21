import React, { useState } from 'react';

const FetchImages = () => {
  const [url, setUrl] = useState('');
  const [fetchedImages, setFetchedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImagesFromUrl = async () => {
    setLoading(true);
    setError(null);
    setFetchedImages([]);

    // Due to CORS restrictions, direct client-side fetching of images from arbitrary URLs is not possible.
    // A backend proxy is required to scrape images from external domains.
    try {
      // Placeholder for where a backend API call would be made to a service
      // that scrapes images from the provided URL.
      // const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(url)}`);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data = await response.json(); // Assuming the backend returns an array of image URLs
      // setFetchedImages(data.images);

      setError(
        'Direct fetching of images from external URLs is blocked by CORS. ' +
        'Please implement a backend proxy to scrape images from arbitrary URLs.'
      );
    } catch (err) {
      console.error("Error fetching images:", err);
      setError('Failed to fetch images. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Fetch Images</h1>
      <p className="text-lg mb-4">Enter a URL to fetch images from.</p>
      <input
        type="text"
        className="w-full p-4 border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={fetchImagesFromUrl}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Images'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {fetchedImages.length > 0 && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Fetched Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fetchedImages.map((imgSrc, index) => (
              <img key={index} src={imgSrc} alt={`Fetched Image ${index + 1}`} className="w-full h-auto rounded-md" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchImages;