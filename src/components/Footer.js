import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-6 mt-16">
      <div className="container mx-auto text-center text-slate-600 text-sm">
        <div className="mb-4">
          &copy; 2025 MetalRoadmap. Plataforma especializada en educación metalúrgica.<br/>
          Desarrollado por un estudiante de Ingeniería Metalúrgica e Ingeniería de Sistemas.
        </div>
        <div className="flex justify-center space-x-6 text-xs">
          <Link to="/privacidad" className="text-slate-500 hover:text-slate-700 transition-colors">
            Política de Privacidad
          </Link>
          <a href="mailto:contact@metalroadmap.com" className="text-slate-500 hover:text-slate-700 transition-colors">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
