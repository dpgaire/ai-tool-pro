import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SummaryText = ({ geminiApiKey }) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summarizeText = async () => {
    if (!geminiApiKey) {
      setError('Please set your Gemini API Key in the Settings.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-preview" });

      const userPrompt = `Summarize the following text:\n\n"""\n${inputText}\n"""`;

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      setSummary(text);
    } catch (err) {
      console.error("Error summarizing text:", err);
      setError('Failed to summarize text. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Text Summarization</h1>
      <p className="text-lg mb-4">Paste your text below to get a summary.</p>
      <textarea
        className="w-full h-64 p-4 border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to summarize..."
      ></textarea>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={summarizeText}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {summary && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryText;