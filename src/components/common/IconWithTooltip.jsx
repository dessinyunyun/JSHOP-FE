import React from 'react';

const IconWithTooltip = ({ icon: Icon, tooltipText, onClick, iconClass = '' }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${iconClass}`}
      >
        <Icon size={20} />
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltipText}
      </div>
    </div>
  );
};

export default IconWithTooltip; 