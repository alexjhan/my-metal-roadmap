import React from 'react';

const RecognitionPanel = ({ topVersion, authorInfo }) => {
  if (!topVersion) return null;

  // Nombre real del autor
  let userName = 'Autor Destacado';
  let userEmail = 'usuario@ejemplo.com';
  if (authorInfo) {
    userName = authorInfo.user_metadata?.full_name || authorInfo.user_metadata?.name || authorInfo.email || 'Autor Destacado';
    userEmail = authorInfo.email || 'usuario@ejemplo.com';
  }

  return (
    <div className="flex-1 flex items-center space-x-3 min-w-0">
      {/* Icono de estrella */}
      <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      {/* Información del autor */}
      <div className="text-xs truncate min-w-0">
        <div className="font-semibold text-blue-900 truncate" title={userName}>{userName}</div>
        <div className="text-blue-700 truncate">{topVersion.total_votes || 0} votos</div>
        <div className="text-blue-600 truncate">
          {new Date(topVersion.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
      {/* Botones de redes sociales */}
      <div className="flex space-x-1 flex-shrink-0">
        <button
          className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          onClick={() => window.open('https://linkedin.com/in/usuario', '_blank')}
          title="LinkedIn"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
        <button
          className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
          onClick={() => window.open(`mailto:${userEmail}`, '_blank')}
          title="Email"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>
        <button
          className="flex items-center justify-center w-6 h-6 bg-blue-800 text-white rounded text-xs hover:bg-blue-900 transition-colors"
          onClick={() => window.open('https://facebook.com/usuario', '_blank')}
          title="Facebook"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecognitionPanel; 