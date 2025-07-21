import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const EnhancedSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      category: 'Dashboard',
      items: [
        { path: '/', name: 'Home', icon: '🏠', description: 'Overview and quick access' }
      ]
    },
    {
      category: 'Content Generation',
      items: [
        { path: '/enhanced-blog', name: 'Blog Generator', icon: '📝', description: 'AI-powered blog posts with templates' },
        { path: '/enhanced-summary', name: 'Text Summarizer', icon: '📄', description: 'Intelligent text summarization' },
        { path: '/enhanced-url-fetcher', name: 'URL Content Fetcher', icon: '🔗', description: 'Extract and process web content' },
        { path: '/ai-prompt-generator', name: 'AI Prompt Generator', icon: '🎯', description: 'Create optimized AI prompts' }
      ]
    },
    {
      category: 'Social Media',
      items: [
        { path: '/social-media-generator', name: 'Social Posts', icon: '📱', description: 'Multi-platform social media posts' }
      ]
    },
    {
      category: 'Media & Assets',
      items: [
        { path: '/image-generation', name: 'Image Generation', icon: '🎨', description: 'AI-generated images' },
        { path: '/thumbnail-generation', name: 'Thumbnail Creator', icon: '🖼️', description: 'Custom thumbnails' },
        { path: '/pexels-media-fetcher', name: 'Pexels Media', icon: '📸', description: 'High-quality stock photos & videos' }
      ]
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Tools Pro
              </h1>
              <p className="text-sm text-gray-400 mt-1">Enhanced AI Toolkit</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {category.category}
              </h3>
            )}
            <ul className="space-y-1">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                    )}
                    
                    {/* Icon */}
                    <span className="text-lg mr-3 flex-shrink-0">{item.icon}</span>
                    
                    {/* Text content */}
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}

                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">
              Powered by AI
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSidebar;

