import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedDashboard from './pages/EnhancedDashboard';
import EnhancedDashboardHome from './pages/EnhancedDashboardHome';

// Enhanced Components
import EnhancedBlog from './pages/EnhancedBlog';
import EnhancedSummary from './pages/EnhancedSummary';
import EnhancedUrlFetcher from './pages/EnhancedUrlFetcher';
import SocialMediaGenerator from './pages/SocialMediaGenerator';
import AIPromptGenerator from './pages/AIPromptGenerator';
import PexelsMediaFetcher from './pages/PexelsMediaFetcher';

// Legacy Components (for backward compatibility)
import {
  Blog,
  SummaryText,
  FetchContentUrl,
  ImageGeneration,
  ThumbnailGeneration,
  PostGeneration,
  FetchImages,
} from './pages/Tools';

const App = () => {
  return (
    <Router>
      <EnhancedDashboard>
        <Routes>
          {/* Enhanced Dashboard */}
          <Route path="/" element={<EnhancedDashboardHome />} />
          
          {/* Enhanced Content Generation Tools */}
          <Route path="/enhanced-blog" element={<EnhancedBlog />} />
          <Route path="/enhanced-summary" element={<EnhancedSummary />} />
          <Route path="/enhanced-url-fetcher" element={<EnhancedUrlFetcher />} />
          <Route path="/social-media-generator" element={<SocialMediaGenerator />} />
          <Route path="/ai-prompt-generator" element={<AIPromptGenerator />} />
          
          {/* Media Tools */}
          <Route path="/pexels-media-fetcher" element={<PexelsMediaFetcher />} />
          <Route path="/image-generation" element={<ImageGeneration />} />
          <Route path="/thumbnail-generation" element={<ThumbnailGeneration />} />
        </Routes>
      </EnhancedDashboard>
    </Router>
  );
};

export default App;

