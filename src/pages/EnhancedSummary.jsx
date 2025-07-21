import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

const EnhancedSummary = () => {
  const [inputText, setInputText] = useState('');
  const [style, setStyle] = useState('paragraph');
  const [length, setLength] = useState('medium');
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);

  const { summarizeText, loading, error, isInitialized } = useGemini();

  const styles = {
    paragraph: {
      name: 'Paragraph Summary',
      description: 'Coherent paragraph format with flowing narrative'
    },
    bullets: {
      name: 'Bullet Points',
      description: 'Key points in easy-to-scan bullet format'
    },
    keyinsights: {
      name: 'Key Insights',
      description: 'Main takeaways and important insights'
    },
    executive: {
      name: 'Executive Summary',
      description: 'Business-focused summary for decision makers'
    }
  };

  const lengths = {
    short: {
      name: 'Short',
      description: '2-3 sentences'
    },
    medium: {
      name: 'Medium',
      description: '1-2 paragraphs'
    },
    long: {
      name: 'Long',
      description: '3-4 paragraphs'
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      alert('Please enter text to summarize');
      return;
    }

    try {
      const result = await summarizeText(inputText, style, length);
      setSummary({
        content: result.content,
        style: style,
        length: length,
        originalLength: inputText.length,
        summaryLength: result.content.length,
        compressionRatio: Math.round((1 - result.content.length / inputText.length) * 100),
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error summarizing text:', err);
    }
  };

  const handleCopy = () => {
    if (summary?.content) {
      navigator.clipboard.writeText(summary.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary(null);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            API Key Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please set your Gemini API key in the Settings to use the text summarizer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Text Input
            </h2>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text to Summarize *
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {wordCount} words
                </span>
              </div>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Paste your text here to summarize..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSummarize}
                disabled={loading || !inputText.trim()}
              >
                {loading ? 'Summarizing...' : 'Summarize Text'}
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Summary Options
            </h2>

            {/* Style Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Summary Style
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {Object.entries(styles).map(([key, styleInfo]) => (
                  <option key={key} value={key}>
                    {styleInfo.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {styles[style].description}
              </p>
            </div>

            {/* Length Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Summary Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(lengths).map(([key, lengthInfo]) => (
                  <button
                    key={key}
                    className={`p-3 rounded-lg border transition-all ${
                      length === key
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setLength(key)}
                  >
                    <div className="font-medium">{lengthInfo.name}</div>
                    <div className="text-xs opacity-75">{lengthInfo.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {summary && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {styles[summary.style].name} - {lengths[summary.length].name}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Compression: {summary.compressionRatio}%</span>
                      <span>Original: {summary.originalLength} chars</span>
                      <span>Summary: {summary.summaryLength} chars</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {summary.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!summary && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Enter text and click summarize to generate a summary
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 Tips for Better Summaries
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Use well-structured text with clear paragraphs</li>
              <li>• Longer texts (500+ words) produce better summaries</li>
              <li>• Choose executive style for business documents</li>
              <li>• Use bullet points for quick reference lists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSummary;

