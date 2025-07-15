import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RoadmapsSection from './components/RoadmapsSection';

import React from 'react';
import RoadmapGrid from './components/RoadmapGrid';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TermodinamicaPage from './components/TermodinamicaPage';
import RoadmapPage from './components/RoadmapPage';
import GraphLayout from './components/GraphLayout';
import CreateRoadmap from './components/CreateRoadmap';
import MyRoadmaps from './components/MyRoadmaps';
import PrivacyPolicy from './components/PrivacyPolicy';
import AuthCallback from './components/AuthCallback';
import EditRoadmapRefactored from './components/editor/EditRoadmapRefactored';
import EditLayout from './components/EditLayout';
import RoadmapVersionPage from './components/RoadmapVersionPage';
import Footer from './components/Footer';
import PerformanceMonitor from './components/PerformanceMonitor';
import { devConfig } from './config/dev';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/edit/:roadmapType" element={
          <EditLayout>
            <EditRoadmapRefactored />
          </EditLayout>
        } />
        <Route path="/roadmap/:roadmapType/version/:versionId" element={<RoadmapVersionPage />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <RoadmapGrid />
                  <RoadmapsSection />
                  <Footer />
                </>
              } />
              <Route path="/termodinamica" element={<TermodinamicaPage />} />
              <Route path="/roadmap/:roadmapType" element={<RoadmapPage />} />
              <Route path="/graph" element={<GraphLayout />} />
              <Route path="/create" element={<><CreateRoadmap /><Footer /></>} />
              {/* <Route path="/my-roadmaps" element={<><MyRoadmaps /><Footer /></>} /> */}
              {/* <Route path="/profile" element={<><UserProfile /><Footer /></>} /> */}
              <Route path="/privacy" element={<><PrivacyPolicy /><Footer /></>} />
              <Route path="/privacidad" element={<><PrivacyPolicy /><Footer /></>} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </>
        } />
      </Routes>
      
      {/* Monitor de Performance - Solo en desarrollo */}
      <PerformanceMonitor enabled={devConfig.isDevelopment} />
    </Router>
  );
}

export default App;
