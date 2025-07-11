import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, selected, onClick }) => {
  return (
    <div className={`relative ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
      />
      <button
        onClick={onClick}
        type="button"
        className={`
          node-button bg-white border-2 border-gray-300 rounded-lg shadow-md p-2 sm:p-3
          min-w-[140px] sm:min-w-[160px] md:min-w-[180px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] transition-all duration-200
          hover:shadow-lg hover:border-blue-400 hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          cursor-pointer select-none
          ${selected ? 'border-blue-500 shadow-lg' : ''}
        `}
      >
        <div className="flex flex-col items-center text-center">
          <span className="text-lg sm:text-xl md:text-2xl mb-1">{data.icon}</span>
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight mb-1">
            {data.label}
          </h3>
          <div className="text-xs text-blue-600 font-medium">
            Haz clic para más info
          </div>
        </div>
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
};

export default CustomNode; 