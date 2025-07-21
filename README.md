# AI Tools Pro

This project is a powerful and user-friendly application that leverages the Gemini API to provide a suite of AI-powered tools for content creation, social media management, and media generation. It features a modern, responsive interface built with React and Tailwind CSS, offering a seamless user experience.

## ✨ Features

### 📝 Content Generation Suite
- **Blog Post Generator**: Create high-quality blog posts from templates with SEO optimization.
- **Text Summarizer**: Generate concise summaries in various formats (paragraphs, bullet points).
- **URL Content Fetcher**: Extract and format content from any URL.
- **AI Prompt Generator**: Craft effective prompts for text, image, and video generation.

### 🚀 Social Media Integration
- **Multi-Platform Support**: Manage content for LinkedIn, Reddit, Twitter, Facebook, and Threads.
- **Content Optimization**: Automatically format content for each platform.
- **Hashtag Suggestions**: Get intelligent hashtag recommendations.
- **Scheduling**: Plan your content with a built-in calendar.

### 🖼️ Media Management
- **AI Image Generation**: Create stunning images with style presets.
- **Thumbnail Creator**: Design eye-catching thumbnails for your content.
- **Pexels Integration**: Access a vast library of high-quality stock photos and videos.
- **Media Library**: Organize and manage all your generated media.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Google Gemini API
- **Media**: Pexels API
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/enhanced-ai-tools-pro.git
   cd enhanced-ai-tools-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_PEXELS_API_KEY=your_pexels_api_key
   ```

### Running the Application

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.

## 📂 Project Structure

The project follows a modular structure to keep the codebase organized and maintainable:

```
src/
├── assets/         # Static assets
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── pages/          # Application pages
├── services/       # API service integrations
└── utils/          # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.