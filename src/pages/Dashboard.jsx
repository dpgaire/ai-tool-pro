import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');

  useEffect(() => {
    if (localStorage.getItem('geminiApiKey')) {
      setGeminiApiKey(localStorage.getItem('geminiApiKey'));
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('geminiApiKey', geminiApiKey);
    setShowSettingsModal(false);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Settings
          </button>
        </div>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { geminiApiKey });
          }
          return child;
        })}

        {showSettingsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div className="mb-4">
                <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gemini API Key</label>
                <input
                  type="text"
                  id="geminiApiKey"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;