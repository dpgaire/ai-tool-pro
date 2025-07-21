import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

const AIPromptGenerator = () => {
  const [promptType, setPromptType] = useState('text');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [copied, setCopied] = useState(false);

  const { generateAIPrompt, loading, error, isInitialized } = useGemini();

  const promptTypes = {
    text: {
      name: 'Text Generation',
      icon: '📝',
      description: 'Prompts for ChatGPT, Claude, Gemini, etc.',
      examples: [
        'Write a professional email to decline a job offer',
        'Create a product description for an eco-friendly water bottle',
        'Generate a creative story about time travel'
      ],
      styleOptions: [
        'Creative and imaginative',
        'Professional and formal',
        'Casual and conversational',
        'Technical and detailed',
        'Persuasive and compelling'
      ]
    },
    image: {
      name: 'Image Generation',
      icon: '🎨',
      description: 'Prompts for DALL-E, Midjourney, Stable Diffusion',
      examples: [
        'A futuristic cityscape at sunset with flying cars',
        'Portrait of a wise old wizard in a magical library',
        'Modern minimalist logo for a tech startup'
      ],
      styleOptions: [
        'Photorealistic',
        'Digital art',
        'Oil painting',
        'Watercolor',
        'Minimalist',
        'Cyberpunk',
        'Fantasy art',
        'Vintage poster'
      ]
    },
    video: {
      name: 'Video Generation',
      icon: '🎬',
      description: 'Prompts for Sora, RunwayML, Pika Labs',
      examples: [
        'A peaceful morning in a Japanese garden with cherry blossoms',
        'Product showcase video for a new smartphone',
        'Time-lapse of a city transitioning from day to night'
      ],
      styleOptions: [
        'Cinematic',
        'Documentary style',
        'Animation',
        'Time-lapse',
        'Slow motion',
        'Drone footage',
        'Commercial style',
        'Artistic/experimental'
      ]
    },
    animation: {
      name: 'Animation Generation',
      icon: '🎭',
      description: 'Prompts for Luma AI, Stable Video, etc.',
      examples: [
        'Character walking through a magical forest',
        'Logo animation with smooth transitions',
        'Explainer animation for a mobile app'
      ],
      styleOptions: [
        '2D animation',
        '3D animation',
        'Motion graphics',
        'Character animation',
        'Logo animation',
        'Explainer style',
        'Cartoon style',
        'Realistic motion'
      ]
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      const result = await generateAIPrompt(promptType, description, style);
      setGeneratedPrompt({
        content: result.content,
        type: promptType,
        description: description,
        style: style,
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error generating prompt:', err);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt?.content) {
      navigator.clipboard.writeText(generatedPrompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExampleClick = (example) => {
    setDescription(example);
  };

  const handleClear = () => {
    setDescription('');
    setStyle('');
    setGeneratedPrompt(null);
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            API Key Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please set your Gemini API key in the Settings to use the AI prompt generator.
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
          {/* Prompt Type Selection */}
         

          {/* Description Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Describe What You Want
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder={`Describe what you want the AI to ${promptType === 'text' ? 'write' : 'create'}...`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Style Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style/Approach (Optional)
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="">Select a style...</option>
                {promptTypes[promptType].styleOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
              >
                {loading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Example Ideas
            </h3>
            <div className="space-y-2">
              {promptTypes[promptType].examples.map((example, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {example}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Select AI Tool Type
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(promptTypes).map(([key, type]) => (
                <button
                  key={key}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    promptType === key
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setPromptType(key)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{type.icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {type.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {generatedPrompt && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center">
                      {promptTypes[generatedPrompt.type].icon}
                      <span className="ml-2">{promptTypes[generatedPrompt.type].name} Prompt</span>
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">
                      Generated: {new Date(generatedPrompt.generatedAt).toLocaleString()}
                    </p>
                    {generatedPrompt.style && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-300">
                        Style: {generatedPrompt.style}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    {generatedPrompt.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!generatedPrompt && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Describe what you want and generate an optimized AI prompt
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
              💡 Prompt Writing Tips
            </h3>
            <div className="space-y-3 text-sm text-indigo-700 dark:text-indigo-300">
              {promptType === 'text' && (
                <div>
                  <h4 className="font-medium mb-1">Text Generation:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Be specific about format, tone, and length</li>
                    <li>• Include context and background information</li>
                    <li>• Specify the target audience</li>
                    <li>• Use examples when possible</li>
                  </ul>
                </div>
              )}
              {promptType === 'image' && (
                <div>
                  <h4 className="font-medium mb-1">Image Generation:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Describe composition, lighting, and colors</li>
                    <li>• Specify art style and medium</li>
                    <li>• Include camera angle and perspective</li>
                    <li>• Add quality modifiers (4K, detailed, etc.)</li>
                  </ul>
                </div>
              )}
              {promptType === 'video' && (
                <div>
                  <h4 className="font-medium mb-1">Video Generation:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Describe camera movements and transitions</li>
                    <li>• Specify duration and pacing</li>
                    <li>• Include environmental details</li>
                    <li>• Mention lighting and mood</li>
                  </ul>
                </div>
              )}
              {promptType === 'animation' && (
                <div>
                  <h4 className="font-medium mb-1">Animation Generation:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Describe character movements and expressions</li>
                    <li>• Specify animation style and technique</li>
                    <li>• Include timing and easing details</li>
                    <li>• Mention background and environment</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptGenerator;

