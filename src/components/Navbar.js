import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from "./Auth";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full bg-white z-[1000]">
      <div className="flex justify-between items-center w-full py-4 sm:py-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/assets/logo.png"
            alt="MetalRoadmap"
            className="transition duration-500"
            style={{
              height: "3rem",
              width: "auto",
              objectFit: "contain",
              padding: "0.3rem",
            }}
          />
          <h1
            className="text-4xl font-bold transition-all duration-500"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "1.5rem",
              lineHeight: "2rem",
              color: "#001f3f",
              padding: "0.3rem",
            }}
          >
           San Antonio Abad
          </h1>
        </Link>
        
        {/* Navegación para usuarios autenticados */}
        {user && (
          <div className="flex items-center space-x-4">
            <Link
              to="/my-roadmaps"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Mis Roadmaps
            </Link>
            <Link
              to="/create"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Crear Roadmap
            </Link>
          </div>
        )}
        
        {/* Componente de autenticación */}
        <Auth />
      </div>
      <style jsx>{`
        h1:hover {
          background: linear-gradient(270deg, #6e7b8b, #bfa14c, #6e7b8b);
          background-size: 1000% 1000%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        img:hover {
          filter: brightness(1.1) saturate(1.2) hue-rotate(180deg)
            drop-shadow(0 0 4px #bfa14c);
        }
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </nav>
  );
}
