import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-002",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
     // Image generation model
    this.imageModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
      generationConfig: {
        temperature: 0.9,
      }
    });
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async generateContent(prompt, options = {}) {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    await this.enforceRateLimit();

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response received from Gemini API');
      }

      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      return {
        success: true,
        content: text,
        usage: response.usageMetadata || null
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Handle specific error types
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error(`Failed to generate content: ${error.message}`);
      }
    }
  }

  async generateStreamContent(prompt, onChunk) {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    await this.enforceRateLimit();

    try {
      const result = await this.model.generateContentStream(prompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        if (onChunk) {
          onChunk(chunkText, fullText);
        }
      }

      return {
        success: true,
        content: fullText
      };
    } catch (error) {
      console.error('Gemini Streaming Error:', error);
      throw new Error(`Failed to generate streaming content: ${error.message}`);
    }
  }

    async generateImage(prompt, options = {}) {
    if (!this.imageModel) {
      throw new Error('Gemini service not initialized. Please set your API key.');
    }

    await this.enforceRateLimit();

    try {
      const result = await this.imageModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { 
                text: `Generate an image based on the following prompt: ${prompt}. 
                Return only the image URL in the response.`
              }
            ]
          }
        ]
      });

      const response = await result.response;
      const textResponse = response.text();
      
      // The response should contain just the image URL
      if (!textResponse) {
        throw new Error('No image URL received from Gemini API');
      }

      // Extract the URL from the response
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const imageUrl = textResponse.match(urlRegex)?.[0];
      
      if (!imageUrl) {
        throw new Error('Could not extract image URL from response');
      }

      return {
        success: true,
        imageUrl: imageUrl,
        usage: response.usageMetadata || null
      };
    } catch (error) {
      console.error('Gemini Image Generation Error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  // Blog post generation with templates
  async generateBlogPost(topic, customPrompt = '', template = 'standard') {
    const templates = {
      standard: `Write a comprehensive blog post about "${topic}". Include an engaging introduction, well-structured main content with subheadings, and a compelling conclusion. Make it informative and engaging for readers.`,
      
      seo: `Write an SEO-optimized blog post about "${topic}". Include:
- An attention-grabbing title
- Meta description (150-160 characters)
- Introduction with the main keyword
- Well-structured content with H2 and H3 subheadings
- Natural keyword integration
- Conclusion with call-to-action
- Suggested tags`,
      
      listicle: `Write a listicle blog post about "${topic}". Format it as a numbered list with:
- Catchy title starting with a number
- Brief introduction explaining what readers will learn
- Each point as a separate section with explanation
- Conclusion summarizing the key takeaways`,
      
      howto: `Write a detailed how-to guide about "${topic}". Include:
- Clear, actionable title
- Introduction explaining what will be accomplished
- Step-by-step instructions with numbered steps
- Tips and best practices
- Common mistakes to avoid
- Conclusion with next steps`
    };

    let prompt = templates[template] || templates.standard;
    
    if (customPrompt) {
      prompt += `\n\nAdditional requirements: ${customPrompt}`;
    }

    return await this.generateContent(prompt);
  }

  // Text summarization with different styles
  async summarizeText(text, style = 'paragraph', length = 'medium') {
    const lengthMap = {
      short: '2-3 sentences',
      medium: '1-2 paragraphs',
      long: '3-4 paragraphs'
    };

    const styleMap = {
      paragraph: 'Write a coherent paragraph summary',
      bullets: 'Create a bullet-point summary with key points',
      keyinsights: 'Extract the key insights and main takeaways',
      executive: 'Write an executive summary suitable for business use'
    };

    const prompt = `${styleMap[style]} of the following text in ${lengthMap[length]}:

${text}

Summary:`;

    return await this.generateContent(prompt);
  }

  // Social media post generation
  async generateSocialPost(content, platform, tone = 'professional') {
    const platformSpecs = {
      linkedin: {
        maxLength: 3000,
        style: 'Professional networking post with industry insights',
        hashtags: 'Include 3-5 relevant professional hashtags'
      },
      twitter: {
        maxLength: 280,
        style: 'Concise and engaging tweet',
        hashtags: 'Include 1-3 trending hashtags'
      },
      facebook: {
        maxLength: 2000,
        style: 'Engaging Facebook post that encourages interaction',
        hashtags: 'Include relevant hashtags'
      },
      instagram: {
        maxLength: 2200,
        style: 'Visual-focused Instagram caption',
        hashtags: 'Include 5-10 relevant hashtags'
      },
      reddit: {
        maxLength: 10000,
        style: 'Informative Reddit post with discussion points',
        hashtags: 'No hashtags needed'
      },
      threads: {
        maxLength: 500,
        style: 'Conversational Threads post',
        hashtags: 'Include 2-4 relevant hashtags'
      }
    };

    const spec = platformSpecs[platform] || platformSpecs.linkedin;
    
    const prompt = `Create a ${tone} ${spec.style} for ${platform} based on this content: "${content}"

Requirements:
- Maximum ${spec.maxLength} characters
- ${spec.hashtags}
- Tone: ${tone}
- Platform-appropriate formatting
- Engaging and shareable

Post:`;

    return await this.generateContent(prompt);
  }

  // AI prompt generation
  async generateAIPrompt(type, description, style = '') {
    const promptTemplates = {
      text: `Create an effective prompt for text generation AI that will produce: ${description}
      
Include:
- Clear instructions
- Context and background
- Desired format and structure
- Tone and style guidelines
- Any specific requirements

Generated prompt:`,

      image: `Create a detailed prompt for image generation AI (like DALL-E, Midjourney, or Stable Diffusion) to create: ${description}

Include:
- Visual description
- Art style and medium
- Lighting and composition
- Color palette
- Technical specifications
- Quality modifiers

Generated prompt:`,

      video: `Create a comprehensive prompt for video generation AI to produce: ${description}

Include:
- Scene description
- Camera movements and angles
- Visual style and aesthetics
- Duration and pacing
- Audio considerations
- Technical specifications

Generated prompt:`,

      animation: `Create a detailed prompt for animation generation AI to create: ${description}

Include:
- Animation style and technique
- Character or object descriptions
- Movement and timing
- Visual effects
- Background and environment
- Technical requirements

Generated prompt:`
    };

    let prompt = promptTemplates[type] || promptTemplates.text;
    
    if (style) {
      prompt += `\n\nStyle preference: ${style}`;
    }

    return await this.generateContent(prompt);
  }

  // Validate API key
  async validateApiKey(apiKey) {
    try {
      const tempService = new GeminiService();
      tempService.initialize(apiKey);
      
      const result = await tempService.generateContent('Hello, this is a test message. Please respond with "API key is valid".');
      
      return {
        valid: true,
        message: 'API key is valid and working'
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message
      };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default GeminiService;

