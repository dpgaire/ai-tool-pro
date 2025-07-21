import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

const SocialMediaGenerator = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin']);
  const [tone, setTone] = useState('professional');
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({});

  const { generateSocialPost, error, isInitialized } = useGemini();

  const platforms = {
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-600',
      maxLength: 3000,
      description: 'Professional networking'
    },
    twitter: {
      name: 'Twitter/X',
      icon: '🐦',
      color: 'bg-black',
      maxLength: 280,
      description: 'Microblogging'
    },
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-700',
      maxLength: 2000,
      description: 'Social networking'
    },
    instagram: {
      name: 'Instagram',
      icon: '📸',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      maxLength: 2200,
      description: 'Visual content'
    },
    reddit: {
      name: 'Reddit',
      icon: '🤖',
      color: 'bg-orange-600',
      maxLength: 10000,
      description: 'Discussion forums'
    },
    threads: {
      name: 'Threads',
      icon: '🧵',
      color: 'bg-gray-800',
      maxLength: 500,
      description: 'Text conversations'
    }
  };

  const tones = {
    professional: 'Professional and formal',
    casual: 'Casual and friendly',
    enthusiastic: 'Enthusiastic and energetic',
    informative: 'Informative and educational',
    humorous: 'Light and humorous',
    inspirational: 'Motivational and inspiring'
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerateAll = async () => {
    if (!content.trim()) {
      alert('Please enter content to generate posts');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    setLoading(true);
    setPosts({});
    setCopied({});

    try {
      const newPosts = {};
      
      for (const platform of selectedPlatforms) {
        try {
          const result = await generateSocialPost(content, platform, tone);
          newPosts[platform] = {
            content: result.content,
            platform: platform,
            tone: tone,
            generatedAt: new Date().toISOString(),
            characterCount: result.content.length
          };
        } catch (err) {
          console.error(`Error generating ${platform} post:`, err);
          newPosts[platform] = {
            error: err.message,
            platform: platform
          };
        }
      }
      
      setPosts(newPosts);
    } catch (err) {
      console.error('Error generating posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (platform) => {
    if (posts[platform]?.content) {
      navigator.clipboard.writeText(posts[platform].content);
      setCopied(prev => ({ ...prev, [platform]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [platform]: false }));
      }, 2000);
    }
  };

  const handleDownloadAll = () => {
    const allPosts = Object.entries(posts)
      .filter(([_, post]) => post.content)
      .map(([platform, post]) => 
        `=== ${platforms[platform].name} ===\n${post.content}\n\n`
      )
      .join('');

    if (allPosts) {
      const blob = new Blob([allPosts], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'social_media_posts.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            API Key Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please set your Gemini API key in the Settings to use the social media generator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Content Input
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Content *
              </label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                placeholder="Enter your content, idea, or message to adapt for social media..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tone
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                {Object.entries(tones).map(([key, description]) => (
                  <option key={key} value={key}>
                    {description}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateAll}
              disabled={loading || !content.trim() || selectedPlatforms.length === 0}
            >
              {loading ? 'Generating...' : `Generate Posts (${selectedPlatforms.length})`}
            </button>
          </div>

          {/* Platform Selection */}
          
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Select Platforms
            </h2>
            
            <div className="space-y-3 w-full grid grid-col-2 lg:grid-cols-2 gap-4">
              {Object.entries(platforms).map(([key, platform]) => (
                <label
                  key={key}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlatforms.includes(key)
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedPlatforms.includes(key)}
                    onChange={() => handlePlatformToggle(key)}
                  />
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{platform.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {platform.name}
                      </div>
                      <div className="text-sm break-words text-gray-500 dark:text-gray-400">
                        {platform.description} • {platform.maxLength} chars max
                      </div>
                    </div>
                  </div>
                  {selectedPlatforms.includes(key) && (
                    <div className="text-pink-600 dark:text-pink-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {Object.keys(posts).length > 0 && (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Generated Posts
              </h2>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download All
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {Object.entries(posts).map(([platform, post]) => (
              <div key={platform} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className={`p-4 ${platforms[platform].color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{platforms[platform].icon}</span>
                      <div>
                        <h3 className="font-semibold">{platforms[platform].name}</h3>
                        <p className="text-sm opacity-90">{platforms[platform].description}</p>
                      </div>
                    </div>
                    {post.content && (
                      <button
                        onClick={() => handleCopy(platform)}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-sm"
                      >
                        {copied[platform] ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {post.error ? (
                    <div className="text-red-600 dark:text-red-400">
                      <p className="font-medium">Generation failed:</p>
                      <p className="text-sm">{post.error}</p>
                    </div>
                  ) : post.content ? (
                    <>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Characters: {post.characterCount}/{platforms[platform].maxLength}</span>
                          <span className={post.characterCount > platforms[platform].maxLength ? 'text-red-500' : 'text-green-500'}>
                            {post.characterCount > platforms[platform].maxLength ? 'Over limit' : 'Within limit'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              post.characterCount > platforms[platform].maxLength 
                                ? 'bg-red-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min((post.characterCount / platforms[platform].maxLength) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                          {post.content}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-pink-600 rounded-full mx-auto mb-2"></div>
                      <p>Generating post...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(posts).length === 0 && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Enter content, select platforms, and generate posts
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-6">
        <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-3">
          💡 Tips for Better Social Media Posts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-pink-700 dark:text-pink-300">
          <div>
            <h4 className="font-medium mb-2">Content Tips:</h4>
            <ul className="space-y-1">
              <li>• Keep your original message clear and focused</li>
              <li>• Include key benefits or value propositions</li>
              <li>• Mention specific details or numbers when relevant</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Platform Optimization:</h4>
            <ul className="space-y-1">
              <li>• LinkedIn: Professional insights and industry news</li>
              <li>• Twitter: Quick updates and trending topics</li>
              <li>• Instagram: Visual storytelling and lifestyle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Engagement:</h4>
            <ul className="space-y-1">
              <li>• Use relevant hashtags for discoverability</li>
              <li>• Include calls-to-action when appropriate</li>
              <li>• Ask questions to encourage interaction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaGenerator;

