import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RoadmapsSection from './components/RoadmapsSection';
import FeaturesSection from './components/FeaturesSection';

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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/edit/:roadmapType" element={
          <EditLayout>
            <EditRoadmapRefactored />
          </EditLayout>
        } />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <RoadmapGrid />
                  <RoadmapsSection />
                  <FeaturesSection />
                </>
              } />
              <Route path="/termodinamica" element={<TermodinamicaPage />} />
              <Route path="/roadmap/:roadmapType" element={<RoadmapPage />} />
              <Route path="/graph" element={<GraphLayout />} />
              <Route path="/create" element={<CreateRoadmap />} />
              <Route path="/my-roadmaps" element={<MyRoadmaps />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>

          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
