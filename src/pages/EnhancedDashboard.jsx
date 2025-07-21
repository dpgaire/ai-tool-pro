import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { useGemini } from '../hooks/useGemini';
import { usePexels } from '../hooks/usePexels';

const EnhancedDashboard = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [pexelsApiKey, setPexelsApiKey] = useState('');
  const [validatingGemini, setValidatingGemini] = useState(false);
  const [validatingPexels, setValidatingPexels] = useState(false);
  const [validationResults, setValidationResults] = useState({});

  const { updateApiKey: updateGeminiKey, validateApiKey: validateGeminiKey, isInitialized: geminiInitialized } = useGemini();
  const { updateApiKey: updatePexelsKey, validateApiKey: validatePexelsKey, isInitialized: pexelsInitialized } = usePexels();

  useEffect(() => {
    setGeminiApiKey(localStorage.getItem('geminiApiKey') || '');
    setPexelsApiKey(localStorage.getItem('pexelsApiKey') || '');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getHeaderContent = () => {
  switch(location.pathname) {
    case '/enhanced-blog':
      return {
        title: 'AI Blog Generator',
        description: 'Create professional blog posts with customizable templates and real-time streaming'
      };
    case '/enhanced-summary':
      return {
        title: 'Text Summarizer',
        description: 'Transform long text into concise summaries with multiple styles and lengths'
      };
    case '/enhanced-url-fetcher':
      return {
        title: 'URL Content Fetcher',
        description: 'Extract, analyze, and process content from any web page'
      };
    case '/ai-prompt-generator':
      return {
        title: 'AI Prompt Generator',
        description: 'Create optimized prompts for text, image, video, and animation AI tools'
      };
    case '/social-media-generator':
      return {
        title: 'Social Media Post Generator',
        description: 'Create engaging posts optimized for multiple social media platforms'
      };
    case '/image-generation':
      return {
        title: 'AI Image Generator',
        description: 'Generate images directly using Gemini\'s image generation capabilities'
      };
    case '/pexels-media-fetcher':
      return {
        title: 'Pexels Media Fetcher',
        description: 'Search and download high-quality photos and videos from Pexels'
      };
    default:
      return {
        title: 'Welcome to AI Tools Pro',
        description: 'Your enhanced AI-powered content creation suite'
      };
  }
};

  const handleValidateGemini = async () => {
    if (!geminiApiKey.trim()) return;
    
    setValidatingGemini(true);
    try {
      const result = await validateGeminiKey(geminiApiKey);
      setValidationResults(prev => ({ ...prev, gemini: result }));
    } catch (error) {
      setValidationResults(prev => ({ ...prev, gemini: { valid: false, message: error.message } }));
    } finally {
      setValidatingGemini(false);
    }
  };

  const handleValidatePexels = async () => {
    if (!pexelsApiKey.trim()) return;
    
    setValidatingPexels(true);
    try {
      const result = await validatePexelsKey(pexelsApiKey);
      setValidationResults(prev => ({ ...prev, pexels: result }));
    } catch (error) {
      setValidationResults(prev => ({ ...prev, pexels: { valid: false, message: error.message } }));
    } finally {
      setValidatingPexels(false);
    }
  };

  const handleSaveApiKeys = () => {
    if (geminiApiKey.trim()) {
      updateGeminiKey(geminiApiKey);
    }
    if (pexelsApiKey.trim()) {
      updatePexelsKey(pexelsApiKey);
    }
    setShowSettingsModal(false);
    setValidationResults({});
  };

  const getStatusColor = (isInitialized) => {
    return isInitialized ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = (isInitialized) => {
    return isInitialized ? 'Connected' : 'Not configured';
  };

  const { title, description } = getHeaderContent();


  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <EnhancedSidebar />
      
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.5) 2px, transparent 0),
                             radial-gradient(circle at 75px 75px, rgba(147, 51, 234, 0.5) 2px, transparent 0)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* API Status Indicators */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${geminiInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={getStatusColor(geminiInitialized)}>Gemini</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${pexelsInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={getStatusColor(pexelsInitialized)}>Pexels</span>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 p-6 h-full overflow-y-auto">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                geminiApiKey: geminiApiKey,
                pexelsApiKey: pexelsApiKey 
              });
            }
            return child;
          })}
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    API Configuration
                  </h2>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Configure your API keys to unlock all features
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Gemini API Key */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Google Gemini API Key
                    </label>
                    <span className={`text-sm ${getStatusColor(geminiInitialized)}`}>
                      {getStatusText(geminiInitialized)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your Gemini API key..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                    <button
                      onClick={handleValidateGemini}
                      disabled={validatingGemini || !geminiApiKey.trim()}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validatingGemini ? '⏳' : '✓'}
                    </button>
                  </div>
                  {validationResults.gemini && (
                    <div className={`text-sm p-3 rounded-lg ${
                      validationResults.gemini.valid 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                      {validationResults.gemini.message}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from{' '}
                    <a 
                      href="https://makersuite.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </div>
                </div>

                {/* Pexels API Key */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pexels API Key
                    </label>
                    <span className={`text-sm ${getStatusColor(pexelsInitialized)}`}>
                      {getStatusText(pexelsInitialized)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your Pexels API key..."
                      value={pexelsApiKey}
                      onChange={(e) => setPexelsApiKey(e.target.value)}
                    />
                    <button
                      onClick={handleValidatePexels}
                      disabled={validatingPexels || !pexelsApiKey.trim()}
                      className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validatingPexels ? '⏳' : '✓'}
                    </button>
                  </div>
                  {validationResults.pexels && (
                    <div className={`text-sm p-3 rounded-lg ${
                      validationResults.pexels.valid 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                      {validationResults.pexels.message}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get your API key from{' '}
                    <a 
                      href="https://www.pexels.com/api/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Pexels API
                    </a>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    🔒 Privacy & Security
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• API keys are stored locally in your browser</li>
                    <li>• No data is sent to external servers</li>
                    <li>• Keys are used only for direct API communication</li>
                    <li>• You can clear keys anytime by clearing browser data</li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKeys}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedDashboard;

