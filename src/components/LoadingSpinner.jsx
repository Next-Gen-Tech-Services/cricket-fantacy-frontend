import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'red-600' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-3">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-${color} rounded-full animate-spin`}
        ></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;