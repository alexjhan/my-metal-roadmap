import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RoadmapsSection from './components/RoadmapsSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import React from 'react';
import RoadmapGrid from './components/RoadmapGrid';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TermodinamicaPage from './components/TermodinamicaPage';
import GraphLayout from './components/GraphLayout';
import CreateRoadmap from './components/CreateRoadmap';
import MyRoadmaps from './components/MyRoadmaps';
import PrivacyPolicy from './components/PrivacyPolicy';
import AuthCallback from './components/AuthCallback';
import EditTermodinamica from './components/EditTermodinamica';


function App() {
  return (
    <Router>
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
        <Route path="/edit/termodinamica" element={<EditTermodinamica />} />
        <Route path="/graph" element={<GraphLayout />} />
        <Route path="/create" element={<CreateRoadmap />} />
        <Route path="/my-roadmaps" element={<MyRoadmaps />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
