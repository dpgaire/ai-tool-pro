import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../hooks/useGemini';

const ImageGeneration = () => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedText, setGeneratedText] = useState(null);


  const styleOptions = [
    'Photorealistic',
    'Digital art',
    'Oil painting',
    'Watercolor',
    'Minimalist',
    'Cyberpunk',
    'Fantasy art',
    'Vintage poster',
    'Anime style',
    'Pixel art'
  ];

  const examples = [
    'A futuristic cityscape at sunset with flying cars',
    'Portrait of a wise old wizard in a magical library',
    'Modern minimalist logo for a tech startup',
    'A peaceful forest with sunlight filtering through the trees',
    'Abstract representation of artificial intelligence'
  ];

   const { generateImage, loading, error } = useGemini();

  const handleGenerate = async () => {
    if (!imagePrompt.trim()) return;
    
    try {
      // Construct full prompt with style if selected
      let fullPrompt = imagePrompt;
      if (style) {
        fullPrompt += ` in ${style.toLowerCase()} style`;
      }

      const result = await generateImage(fullPrompt);
      setGeneratedImage(result.image);
      setGeneratedText(result.text);
    } catch (err) {
      console.error('Image generation failed:', err);
    }
  };

  const handleExampleClick = (example) => {
    setImagePrompt(example);
  };

  const handleClear = () => {
    setImagePrompt('');
    setStyle('');
    setGeneratedImage(null);
    setGeneratedText(null);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'gemini-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Description Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Describe Your Image
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Description *
              </label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe the image you want to generate..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>

            {/* Style Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Art Style (Optional)
              </label>
              <select
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="">Select a style...</option>
                {styleOptions.map((option, index) => (
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
                disabled={loading || !imagePrompt.trim()}
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Example Ideas
            </h3>
            <div className="space-y-2">
              {examples.map((example, index) => (
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
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {generatedImage && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center">
                    🎨 Generated Image
                  </h3>
                  <button
                    onClick={downloadImage}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div className="p-6">
                <img 
                  src={generatedImage} 
                  alt="Generated from AI" 
                  className="w-full h-auto rounded-lg"
                />
                {generatedText && (
                  <div className="mt-4 prose dark:prose-invert max-w-none">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {generatedText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!generatedImage && !loading && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Describe the image you want to generate and click the button
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
              💡 Image Generation Tips
            </h3>
            <div className="space-y-3 text-sm text-indigo-700 dark:text-indigo-300">
              <ul className="space-y-1 ml-4">
                <li>• Be specific about the subject and composition</li>
                <li>• Include details about lighting and colors</li>
                <li>• Specify the mood or atmosphere you want</li>
                <li>• Add artistic style references if needed</li>
                <li>• For best results, describe the scene in detail</li>
                <li>• Mention any specific elements you want included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;