import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RoadmapsSection from './components/RoadmapsSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import React from 'react';
import RoadmapGrid from './components/RoadmapGrid';

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RoadmapGrid />
      <RoadmapsSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}

export default App;
