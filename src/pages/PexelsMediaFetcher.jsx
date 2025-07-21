import React, { useState, useEffect } from 'react';
import { usePexels } from '../hooks/usePexels';

const PexelsMediaFetcher = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState('photos');
  const [orientation, setOrientation] = useState('');
  const [color, setColor] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const {
    isInitialized,
    loading,
    error,
    rateLimitInfo,
    searchPhotos,
    searchVideos,
    getCuratedPhotos,
    getPopularVideos,
    downloadImage,
    downloadVideo,
    getTrendingSearches
  } = usePexels();

  const orientations = ['', 'landscape', 'portrait', 'square'];
  const colors = ['', 'red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'violet', 'pink', 'brown', 'black', 'gray', 'white'];
  const trendingSearches = getTrendingSearches();

  useEffect(() => {
    if (isInitialized && !searchQuery) {
      handleGetCurated();
    }
  }, [isInitialized]);

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      handleGetCurated(page);
      return;
    }

    try {
      const options = {
        page,
        perPage: 20,
        ...(orientation && { orientation }),
        ...(color && { color })
      };

      let result;
      if (mediaType === 'photos') {
        result = await searchPhotos(searchQuery, options);
      } else {
        result = await searchVideos(searchQuery, options);
      }

      if (page === 1) {
        setResults(result.data[mediaType]);
        setCurrentPage(1);
      } else {
        setResults(prev => [...prev, ...result.data[mediaType]]);
        setCurrentPage(page);
      }
      
      setTotalResults(result.data.total_results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleGetCurated = async (page = 1) => {
    try {
      const options = { page, perPage: 20 };

      let result;
      if (mediaType === 'photos') {
        result = await getCuratedPhotos(options);
      } else {
        result = await getPopularVideos(options);
      }

      if (page === 1) {
        setResults(result.data[mediaType]);
        setCurrentPage(1);
      } else {
        setResults(prev => [...prev, ...result.data[mediaType]]);
        setCurrentPage(page);
      }
      
      setTotalResults(result.data.total_results || 1000);
    } catch (err) {
      console.error('Curated fetch error:', err);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (searchQuery.trim()) {
      handleSearch(nextPage);
    } else {
      handleGetCurated(nextPage);
    }
  };

  const handleDownload = async (item) => {
    try {
      if (mediaType === 'photos') {
        const filename = `pexels-${item.id}-${item.photographer.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        await downloadImage(item.src.large, filename);
      } else {
        const videoFile = item.videoFiles.find(file => file.quality === 'hd') || item.videoFiles[0];
        const filename = `pexels-video-${item.id}.mp4`;
        await downloadVideo(videoFile.link, filename);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleBulkDownload = async () => {
    for (const itemId of selectedItems) {
      const item = results.find(r => r.id === itemId);
      if (item) {
        await handleDownload(item);
        // Add delay between downloads to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    setSelectedItems(new Set());
  };

  const toggleSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === results.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(results.map(item => item.id)));
    }
  };

  const handleTrendingClick = (term) => {
    setSearchQuery(term);
    handleSearch(1);
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Pexels API Key Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please set your Pexels API key in the Settings to use the media fetcher.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search for photos or videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
            />
          </div>

          {/* Media Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                mediaType === 'photos'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setMediaType('photos')}
            >
              📸 Photos
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                mediaType === 'videos'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setMediaType('videos')}
            >
              🎬 Videos
            </button>
          </div>

          {/* Search Button */}
          <button
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium disabled:opacity-50"
            onClick={() => handleSearch(1)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {/* Filters Toggle */}
          <button
            className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔧 Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orientation
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
              >
                <option value="">Any orientation</option>
                {orientations.slice(1).map(orient => (
                  <option key={orient} value={orient}>
                    {orient.charAt(0).toUpperCase() + orient.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {mediaType === 'photos' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <select
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="">Any color</option>
                  {colors.slice(1).map(colorOption => (
                    <option key={colorOption} value={colorOption}>
                      {colorOption.charAt(0).toUpperCase() + colorOption.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Trending Searches */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Trending searches:</p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.slice(0, 12).map((term, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                onClick={() => handleTrendingClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      {results.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {totalResults.toLocaleString()} results
            </span>
            {rateLimitInfo && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                API: {rateLimitInfo.remaining}/{rateLimitInfo.limit} remaining
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.size} selected
                </span>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  onClick={handleBulkDownload}
                  disabled={loading}
                >
                  Download Selected
                </button>
              </div>
            )}

            <button
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              onClick={selectAll}
            >
              {selectedItems.size === results.length ? 'Deselect All' : 'Select All'}
            </button>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className={`grid gap-6 mb-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {results.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelection(item.id)}
                />
              </div>

              {/* Media Preview */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'}`}>
                {mediaType === 'photos' ? (
                  <img
                    src={item.src.medium}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.image}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mediaType === 'photos' ? `${item.width} × ${item.height}` : `${item.width} × ${item.height} • ${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                      by {mediaType === 'photos' ? item?.photographer : item?.user?.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                    onClick={() => handleDownload(item)}
                    disabled={loading}
                  >
                    Download
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Search for photos or videos, or browse curated content
          </p>
        </div>
      )}

      {/* Load More Button */}
      {results.length > 0 && results.length < totalResults && (
        <div className="text-center">
          <button
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium disabled:opacity-50"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PexelsMediaFetcher;

