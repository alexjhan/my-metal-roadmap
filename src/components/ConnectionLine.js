import React from 'react';

export default function ConnectionLine({ from, to, level = 0 }) {
  // Calcular la posición y dimensiones de la línea
  const getLineStyle = () => {
    const fromX = from.x;
    const fromY = from.y;
    const toX = to.x;
    const toY = to.y;

    // Calcular el centro de la línea
    const centerX = (fromX + toX) / 2;
    const centerY = (fromY + toY) / 2;

    // Calcular la longitud y el ángulo
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    return {
      position: 'absolute',
      left: `${centerX}%`,
      top: `${centerY}%`,
      width: `${length}%`,
      height: getLineThickness(level),
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      transformOrigin: 'center',
      zIndex: level
    };
  };

  const getLineThickness = (level) => {
    switch (level) {
      case 0: return '3px';
      case 1: return '2px';
      case 2: return '1px';
      default: return '1px';
    }
  };

  const getLineColor = (level) => {
    switch (level) {
      case 0: return 'bg-gray-400';
      case 1: return 'bg-gray-300';
      case 2: return 'bg-gray-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div
      className={`
        ${getLineColor(level)} 
        rounded-full 
        transition-all duration-200
      `}
      style={getLineStyle()}
    >
      {/* Flecha en el extremo */}
      <div 
        className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0"
        style={{
          borderLeft: `${getLineThickness(level)} solid currentColor`,
          borderTop: `${getLineThickness(level)} solid transparent`,
          borderBottom: `${getLineThickness(level)} solid transparent`
        }}
      />
    </div>
  );
} 