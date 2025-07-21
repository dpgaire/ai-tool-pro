import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PostGeneration = ({ geminiApiKey }) => {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePost = async () => {
    if (!geminiApiKey) {
      setError('Please set your Gemini API Key in the Settings.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-preview" });

      const userPrompt = `Generate a short social media post about: ${topic}.`;

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      setGeneratedPost(text);
    } catch (err) {
      console.error("Error generating post:", err);
      setError('Failed to generate post. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Post Generation</h1>
      <p className="text-lg mb-4">Enter a topic to generate a social media post.</p>
      <input
        type="text"
        className="w-full p-4 border rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        placeholder="The future of AI"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={generatePost}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Post'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {generatedPost && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Generated Post</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>{generatedPost}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGeneration;