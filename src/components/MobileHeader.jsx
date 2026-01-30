import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaDownload, FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import logo from '../assets/logo.svg';

export default function MobileHeader({ title, showBack = false, showSearch = false }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setShowProfileMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={logo}
                alt="Match Play"
                className="h-10 w-auto object-contain min-w-[120px]"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
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
          {/* {isInstallable && (
            <button
              onClick={showInstallPrompt}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <FaDownload size={16} />
            </button>
          )} */}

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

          {/* Profile Avatar with Dropdown */}
          {isAuthenticated && user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {getUserInitials(user.name)}
                </div>
                <FaChevronDown 
                  size={12} 
                  className={`transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <FaUser className="text-slate-400" />
                      My Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                    >
                      <FaCog className="text-slate-400" />
                      Settings
                    </button>
                    
                    <div className="h-px bg-slate-100 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
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