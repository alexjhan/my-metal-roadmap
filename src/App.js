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

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

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
        <Route path="/" element={
          <MainLayout>
            <HeroSection />
            <RoadmapGrid />
            <RoadmapsSection />
          </MainLayout>
        } />
        <Route path="/termodinamica" element={<MainLayout><TermodinamicaPage /></MainLayout>} />
        <Route path="/roadmap/:roadmapType" element={<MainLayout><RoadmapPage /></MainLayout>} />
        <Route path="/graph" element={<MainLayout><GraphLayout /></MainLayout>} />
        <Route path="/create" element={<MainLayout><CreateRoadmap /></MainLayout>} />
        <Route path="/my-roadmaps" element={<MainLayout><MyRoadmaps /></MainLayout>} />
        {/* <Route path="/profile" element={<MainLayout><UserProfile /></MainLayout>} /> */}
        <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/privacidad" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Puedes agregar más rutas aquí si es necesario */}
      </Routes>
      {/* <PerformanceMonitor enabled={devConfig.isDevelopment} /> */}
    </Router>
  );
}

export default App;
