import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

const EnhancedBlog = () => {
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [template, setTemplate] = useState('standard');
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');

  const { generateBlogPost, generateStreamContent, loading, error, isInitialized } = useGemini();

  const templates = {
    standard: {
      name: 'Standard Blog Post',
      description: 'Comprehensive blog post with introduction, main content, and conclusion'
    },
    seo: {
      name: 'SEO Optimized',
      description: 'SEO-friendly post with meta description, keywords, and structured content'
    },
    listicle: {
      name: 'Listicle',
      description: 'Numbered list format with engaging points and explanations'
    },
    howto: {
      name: 'How-To Guide',
      description: 'Step-by-step tutorial with actionable instructions'
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    try {
      const result = await generateBlogPost(topic, customPrompt, template);
      setPost({
        title: `${templates[template].name}: ${topic}`,
        content: result.content,
        template: template,
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error generating blog post:', err);
    }
  };

  const handleStreamGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsStreaming(true);
    setStreamContent('');
    setPost(null);

    try {
      const prompt = `Write a comprehensive ${templates[template].name.toLowerCase()} about "${topic}". ${customPrompt ? `Additional requirements: ${customPrompt}` : ''}`;
      
      await generateStreamContent(prompt, (chunk, fullText) => {
        setStreamContent(fullText);
      });

      setPost({
        title: `${templates[template].name}: ${topic}`,
        content: streamContent,
        template: template,
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error generating streaming blog post:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    if (post?.content) {
      navigator.clipboard.writeText(`${post.title}\n\n${post.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (post?.content) {
      const blob = new Blob([`${post.title}\n\n${post.content}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
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
            Please set your Gemini API key in the Settings to use the blog generator.
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
              Blog Configuration
            </h2>
            
            {/* Topic Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Topic *
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your blog topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {Object.entries(templates).map(([key, tmpl]) => (
                  <option key={key} value={key}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {templates[template].description}
              </p>
            </div>

            {/* Custom Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add specific requirements, tone, target audience, etc..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerate}
                disabled={loading || isStreaming || !topic.trim()}
              >
                {loading ? 'Generating...' : 'Generate Post'}
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStreamGenerate}
                disabled={loading || isStreaming || !topic.trim()}
              >
                {isStreaming ? 'Streaming...' : 'Stream Generate'}
              </button>
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Template Features
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {template === 'standard' && (
                <>
                  <li>• Engaging introduction</li>
                  <li>• Well-structured main content</li>
                  <li>• Compelling conclusion</li>
                </>
              )}
              {template === 'seo' && (
                <>
                  <li>• SEO-optimized title and meta description</li>
                  <li>• Keyword integration</li>
                  <li>• Structured headings (H2, H3)</li>
                  <li>• Call-to-action</li>
                </>
              )}
              {template === 'listicle' && (
                <>
                  <li>• Numbered list format</li>
                  <li>• Catchy title with numbers</li>
                  <li>• Detailed explanations for each point</li>
                </>
              )}
              {template === 'howto' && (
                <>
                  <li>• Step-by-step instructions</li>
                  <li>• Tips and best practices</li>
                  <li>• Common mistakes to avoid</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {(post || isStreaming) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {post?.title || 'Generating...'}
                  </h3>
                  {post?.generatedAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generated: {new Date(post.generatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {post && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {isStreaming ? streamContent : post?.content}
                    {isStreaming && <span className="animate-pulse">|</span>}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!post && !isStreaming && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Enter a topic and click generate to create your blog post
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBlog;

