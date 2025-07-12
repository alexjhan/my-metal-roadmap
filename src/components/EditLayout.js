import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 