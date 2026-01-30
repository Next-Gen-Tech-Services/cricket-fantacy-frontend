import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const SimpleBanner = ({ 
  imageUrl, 
  redirectUrl = "#", 
  alt = "Advertisement",
  closeable = true,
  orientation = "horizontal", // "horizontal" or "vertical"
  size = "medium",
  className = "",
  openInNewTab = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Size classes for different orientations
  const sizeClasses = {
    horizontal: {
      small: "h-12 w-full max-w-sm",
      medium: "h-24 w-full max-w-2xl", 
      large: "h-32 w-full max-w-4xl",
      xlarge: "h-40 w-full"
    },
    vertical: {
      small: "w-32 h-48",
      medium: "w-40 h-64",
      large: "w-48 h-80",
      xlarge: "w-56 h-96"
    }
  };

  const currentSizeClass = sizeClasses[orientation][size] || sizeClasses[orientation].medium;

  const handleClick = () => {
    if (redirectUrl && redirectUrl !== "#") {
      if (openInNewTab) {
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = redirectUrl;
      }
    }
  };

  return (
    <div className={`relative bg-white rounded-lg overflow-hidden ${currentSizeClass} ${className}`}>
      {closeable && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-10 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          <FaTimes size={10} />
        </button>
      )}
      
      <div 
        onClick={handleClick}
        className={`block w-full h-full ${redirectUrl && redirectUrl !== "#" ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
      >
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE2MCA4MFYxMjBMMjAwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMjAwIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Qjc3ODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+QWR2ZXJ0aXNlbWVudDwvdGV4dD4KPHN2Zz4=';
          }}
        />
      </div>
    </div>
  );
};

export default SimpleBanner;