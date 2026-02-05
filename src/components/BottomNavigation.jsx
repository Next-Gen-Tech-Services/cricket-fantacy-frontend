import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaTrophy, 
  FaUsers, 
  FaUser,
  FaPlus,
  FaGamepad,
  FaBaseballBall,
  FaGift
} from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';

export default function BottomNavigation() {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: FaHome,
      path: '/',
      authRequired: false
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: FaTrophy,
      path: '/tournaments',
      authRequired: true
    },
    {
      id: 'matches',
      label: 'My Matches',
      icon: FaBaseballBall,
      path: '/my-matches',
      authRequired: true
    },
    {
      id: 'leagues',
      label: 'My Leagues',
      icon: FaUsers,
      path: '/my-leagues',
      authRequired: true
    }
  ];

  const isActiveTab = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActiveTab(tab.path);
            const needsAuth = tab.authRequired && !isAuthenticated;

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 relative ${
                  active
                    ? 'text-yellow-400'
                    : needsAuth 
                      ? 'text-gray-400' 
                      : 'text-gray-500 hover:text-gray-700'
                } ${needsAuth ? 'opacity-60' : ''}`}
              >
                <div className={`p-1 rounded-lg transition-all duration-200 relative ${
                  active ? 'bg-yellow-400/10' : ''
                }`}>
                  {tab.id === 'profile' && isAuthenticated && user ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      active 
                        ? 'bg-yellow-400 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {getUserInitials(user.name)}
                    </div>
                  ) : (
                    <>
                      <Icon size={20} />
                      {needsAuth && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </>
                  )}
                </div>
                <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  active ? 'text-yellow-400' : needsAuth ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
                
                {/* Active indicator */}
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-400 rounded-b-full"></div>
                )}
                
                
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  );
}