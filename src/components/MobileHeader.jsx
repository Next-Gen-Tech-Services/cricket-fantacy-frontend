import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaDownload } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { usePWA } from '../hooks/usePWA';

export default function MobileHeader({ title, showBack = false, showSearch = false }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { isInstallable, showInstallPrompt } = usePWA();
  const navigate = useNavigate();

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="md:hidden bg-gradient-to-r from-[#273470] to-[#1e2a5e] text-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                <img
                  src="/cricket-lovers-logo.svg"
                  alt="Cricket Lovers Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-yellow-400 rounded-lg items-center justify-center hidden">
                  <span className="text-white font-bold text-sm">CL</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Cricket Lovers</span>
                <span className="text-xs text-white/70">Global</span>
              </div>
            </Link>
          )}
        </div>

        {/* Center Section - Title */}
        {title && (
          <h1 className="text-lg font-semibold text-center flex-1">{title}</h1>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          {showSearch && (
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <FaSearch size={16} />
            </button>
          )}

          {/* Install App Button */}
          {isInstallable && (
            <button
              onClick={showInstallPrompt}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <FaDownload size={16} />
            </button>
          )}

          {/* Notifications */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-white/10 transition relative"
              >
                <FaBell size={16} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          )}

          {/* Profile Avatar */}
          {isAuthenticated && user && (
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold hover:bg-yellow-500 transition"
            >
              {getUserInitials(user.name)}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for loading states */}
      <div className="h-1 bg-white/10">
        <div className="h-full bg-yellow-400 w-0 transition-all duration-300"></div>
      </div>
    </div>
  );
}