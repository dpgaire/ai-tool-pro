import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Blog = () => {
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('geminiApiKey');
    if (key) setGeminiApiKey(key);
  }, []);

  const generatePost = async () => {
    if (!geminiApiKey) {
      setError('Please set your Gemini API Key in the Settings.');
      return;
    }

    setLoading(true);
    setError(null);
    setPost(null);

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

      let userPrompt = `Generate a blog post about: ${topic}.`;
      if (prompt) {
        userPrompt += `\n\nAdditional instructions: ${prompt}`;
      }

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      setPost({
        title: `Blog Post about ${topic}`,
        content: text,
      });
    } catch (err) {
      console.error("Error generating blog post:", err);
      setError('Failed to generate blog post. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (post?.content) {
      navigator.clipboard.writeText(`${post.title}\n\n${post.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">AI Blog Generator</h1>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          className="w-full p-4 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <textarea
          className="w-full h-32 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter a custom prompt (optional)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={generatePost}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {post && (
        <div className="relative mt-8 p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {copied ? 'Copied!' : 'Copy Blog'}
            </button>
          </div>
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          <div className="prose dark:prose-invert overflow-auto max-w-none h-4/5 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
