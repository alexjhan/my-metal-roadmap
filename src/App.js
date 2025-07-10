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
        <Route path="/graph" element={<GraphLayout />} />
        <Route path="/create" element={<CreateRoadmap />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
