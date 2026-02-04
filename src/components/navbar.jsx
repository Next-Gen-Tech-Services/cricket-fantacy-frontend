import { useState, useEffect, useRef } from "react";
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown, FaGift } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/slices/authSlice";
import notificationService from "../services/notificationService";
import logo from "../assets/logo.svg"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationPermissionChecked, setNotificationPermissionChecked] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const navLinks = [
    { name: "How to play?", href: "/", authRequired: false },
    { name: "Tournaments", href: "/tournaments", authRequired: true },
    { name: "My Leagues", href: "/my-leagues", authRequired: true },
    { name: "My Matches", href: "/my-matches", authRequired: true },
    { name: "How to score?", href: "/how-to-earn-points", authRequired: false },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check notification permissions for logged-in users
  useEffect(() => {
    const checkNotificationPermission = async () => {
      console.log('🔍 Checking notification permission. Authenticated:', isAuthenticated, 'Already checked:', notificationPermissionChecked);

      // Only check if user is authenticated and we haven't checked before
      if (isAuthenticated && !notificationPermissionChecked) {
        try {
          console.log('📱 Initializing notification service for authenticated user...');

          // Initialize notification service for authenticated user
          const initResult = await notificationService.initialize();
          console.log('🔧 Notification service initialization result:', initResult);

          // Check current permission status
          const permissionStatus = notificationService.getPermissionStatus();
          console.log('🔐 Current permission status:', permissionStatus);

          // If permission is default (not asked), request it
          if (permissionStatus === 'default') {
            console.log('🔔 Requesting notification permission for logged-in user...');
            const permResult = await notificationService.requestPermission();
            console.log('📋 Permission request result:', permResult);
          } else if (permissionStatus === 'granted') {
            // If already granted, just get and save token
            console.log('✅ Notification permission already granted');
            const tokenResult = await notificationService.getAndSaveToken();
            console.log('🎫 Token save result:', tokenResult);
          }

          setNotificationPermissionChecked(true);
        } catch (error) {
          console.error('❌ Error checking notification permission:', error);
          setNotificationPermissionChecked(true);
        }
      }

      // Reset check flag when user logs out
      if (!isAuthenticated && notificationPermissionChecked) {
        console.log('🔄 User logged out, resetting notification check flag');
        setNotificationPermissionChecked(false);
        notificationService.resetOnLogout();
      }
    };

    checkNotificationPermission();
  }, [isAuthenticated, notificationPermissionChecked]);

  const handleLogout = async () => {
    try {
      // Reset notification service on logout
      notificationService.resetOnLogout();
      setNotificationPermissionChecked(false);

      await dispatch(logoutUser()).unwrap();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };


  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[#273470] backdrop-blur border-b border-white/10 shadow-xl py-3">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={logo}
                alt="Match Play"
                className="h-12 lg:h-14 w-auto object-contain min-w-[140px] transition-all duration-200"
              />
            </Link>


            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-200 relative ${isActive
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-white hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 border-b-2 border-transparent"
                    } ${link.authRequired && !isAuthenticated ? 'opacity-75' : ''}`
                  }
                >
                  {link.name}

                </NavLink>
              ))}
            </div>

            {/* RIGHT ACTIONS (IMPROVED) */}
            <div className="hidden md:flex items-center gap-5">


              {isAuthenticated && user ? (
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition"
                    >
                      {/* Profile Avatar */}
                      <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {getUserInitials(user.name)}
                      </div>

                      {/* User Name */}
                      <span className="max-w-[120px] truncate">
                        {user.name || user.email}
                      </span>

                      {/* Dropdown Arrow */}
                      <FaChevronDown
                        className={`text-xs transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
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
                              setUserDropdownOpen(false);
                              navigate('/profile');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                          >
                            <FaUser className="text-slate-400" />
                            My Profile
                          </button>

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              navigate('/vault');
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                          >
                            <FiDollarSign className="text-slate-400" />
                            My Vault
                          </button>

                        

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
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
                </>
              ) : (
                /* Login/Signup Buttons */
                <>
                  <Link to="/login">
                    <button className="px-6 py-3 rounded-full text-sm font-semibold border bg-yellow-400 text-[#273470] hover:bg-yellow-400 transition cursor-pointer">
                      Log in
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="px-6 py-3 rounded-full text-sm font-semibold border border-white text-white hover:bg-white/10 transition cursor-pointer">
                      Sign up
                    </button>
                  </Link>


                </>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="rounded-2xl p-4 mt-2 bg-white border border-slate-200 shadow-sm space-y-4">
              {/* NAV LINKS */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium transition-all duration-200 relative ${isActive
                      ? "text-yellow-400 border-l-4 border-yellow-400 pl-4"
                      : "text-slate-700 hover:text-yellow-400 hover:border-l-4 hover:border-yellow-400 border-l-4 border-transparent pl-4"
                    } ${link.authRequired && !isAuthenticated ? 'opacity-75' : ''}`
                  }
                >
                  <span className="flex items-center justify-between">
                    {link.name}
                    {link.authRequired && !isAuthenticated && (
                      <span className="text-xs bg-yellow-400 text-[#273470] px-1 py-0.5 rounded">Login Required</span>
                    )}
                  </span>
                </NavLink>
              ))}

              <div className="h-px bg-slate-200" />



              {/* MOBILE USER SECTION */}
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-semibold">
                      {getUserInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                    </div>
                  </div>



                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <FaUser className="text-slate-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/vault');
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <FiDollarSign className="text-slate-400" />
                    My Vault
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/rewards');
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <FaGift className="text-slate-400" />
                    Rewards
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <FaCog className="text-slate-400" />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    Sign Out
                  </button>
                </>
              ) : (
                /* Login/Signup for Mobile */
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700">
                      Login
                    </button>
                  </Link>

                  <Link to="/signup" onClick={() => setMenuOpen(false)}>
                    <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-[#273470] text-white">
                      Sign up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
