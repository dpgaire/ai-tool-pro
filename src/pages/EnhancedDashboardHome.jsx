import React from 'react';
import { Link } from 'react-router-dom';
import { useGemini } from '../hooks/useGemini';
import { usePexels } from '../hooks/usePexels';

const EnhancedDashboardHome = () => {
  const { isInitialized: geminiInitialized } = useGemini();
  const { isInitialized: pexelsInitialized } = usePexels();

  const featuredTools = [
    {
      title: 'Enhanced Blog Generator',
      description: 'Create professional blog posts with multiple templates, SEO optimization, and real-time streaming.',
      icon: '📝',
      path: '/enhanced-blog',
      gradient: 'from-blue-500 to-purple-600',
      features: ['Multiple templates', 'SEO optimization', 'Real-time streaming', 'Custom prompts'],
      requiresApi: 'gemini'
    },
    {
      title: 'Social Media Generator',
      description: 'Generate optimized posts for LinkedIn, Twitter, Facebook, Instagram, Reddit, and Threads.',
      icon: '📱',
      path: '/social-media-generator',
      gradient: 'from-pink-500 to-rose-600',
      features: ['6 platforms', 'Character limits', 'Hashtag generation', 'Tone customization'],
      requiresApi: 'gemini'
    },
    {
      title: 'Pexels Media Fetcher',
      description: 'Search and download high-quality stock photos and videos from Pexels.',
      icon: '📸',
      path: '/pexels-media-fetcher',
      gradient: 'from-orange-500 to-red-600',
      features: ['HD photos & videos', 'Advanced filters', 'Bulk download', 'Trending searches'],
      requiresApi: 'pexels'
    },
    {
      title: 'AI Prompt Generator',
      description: 'Create optimized prompts for text, image, video, and animation AI tools.',
      icon: '🎯',
      path: '/ai-prompt-generator',
      gradient: 'from-indigo-500 to-purple-600',
      features: ['4 AI types', 'Style templates', 'Best practices', 'Example library'],
      requiresApi: 'gemini'
    }
  ];

  const quickActions = [
    { name: 'Text Summarizer', path: '/enhanced-summary', icon: '📄', color: 'bg-green-500' },
    { name: 'URL Content Fetcher', path: '/enhanced-url-fetcher', icon: '🔗', color: 'bg-blue-500' },
    { name: 'Image Generation', path: '/image-generation', icon: '🎨', color: 'bg-purple-500' },
    { name: 'Thumbnail Creator', path: '/thumbnail-generation', icon: '🖼️', color: 'bg-yellow-500' }
  ];

  const stats = [
    { label: 'AI Tools', value: '12+', icon: '🤖' },
    { label: 'Content Types', value: '8+', icon: '📋' },
    { label: 'Social Platforms', value: '6', icon: '🌐' },
    { label: 'Media Sources', value: '2', icon: '📱' }
  ];

  const getApiStatus = (apiType) => {
    if (apiType === 'gemini') return geminiInitialized;
    if (apiType === 'pexels') return pexelsInitialized;
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to AI Tools Pro
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-2xl">
            Your comprehensive AI-powered content creation suite with enhanced features, 
            premium UI, and seamless integrations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/enhanced-blog"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Creating
            </Link>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* API Status Alert */}
      {(!geminiInitialized || !pexelsInitialized) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                API Configuration Required
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                To unlock all features, please configure your API keys in the settings.
              </p>
              <div className="space-y-2 text-sm">
                {!geminiInitialized && (
                  <div className="flex items-center text-yellow-700 dark:text-yellow-300">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Google Gemini API key required for content generation features
                  </div>
                )}
                {!pexelsInitialized && (
                  <div className="flex items-center text-yellow-700 dark:text-yellow-300">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Pexels API key required for stock media features
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Tools */}
      <div id="features">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Featured Tools</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredTools.map((tool, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className={`h-2 bg-gradient-to-r ${tool.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{tool.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                        {tool.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${getApiStatus(tool.requiresApi) ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getApiStatus(tool.requiresApi) ? 'Ready' : 'API key required'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, featureIndex) => (
                      <span 
                        key={featureIndex}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link
                  to={tool.path}
                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${tool.gradient} text-white rounded-lg hover:shadow-lg transition-all duration-200 group-hover:scale-105`}
                >
                  Try Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                {action.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">What's New</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Enhanced UI & Premium Design</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Modern interface with improved user experience and responsive design.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Pexels Integration</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Access millions of high-quality stock photos and videos directly.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Multi-Platform Social Media</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Generate optimized posts for 6 different social media platforms.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">AI Prompt Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Create optimized prompts for various AI tools and platforms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Built with ❤️ using React, Tailwind CSS, and AI APIs
        </p>
      </div>
    </div>
  );
};

export default EnhancedDashboardHome;

