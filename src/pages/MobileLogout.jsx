import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/slices/authSlice";
import { FiLogOut, FiUser, FiSettings, FiHelpCircle, FiChevronRight } from "react-icons/fi";

const MobileLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowConfirmDialog(false);
    }
  };

  const menuItems = [
    {
      icon: FiUser,
      title: "Profile",
      description: "Manage your account details",
      action: () => navigate('/profile')
    },
    {
      icon: FiSettings,
      title: "Settings",
      description: "App preferences and notifications",
      action: () => navigate('/settings')
    },
    {
      icon: FiHelpCircle,
      title: "Help & Support",
      description: "Get help or contact support",
      action: () => navigate('/contact')
    }
  ];

  return (
    <main className="min-h-screen bg-main">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white p-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            {user?.name || 'User'}
          </h1>
          <p className="text-slate-600">{user?.email}</p>
        </div>

        {/* Menu Items */}
        <div className="bg-white mt-4 divide-y divide-slate-100">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <FiChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Logout Section */}
        <div className="bg-white mt-4 p-6">
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full bg-red-500 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* App Info */}
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-2">Cricket Lover Fantasy</p>
          <p className="text-xs text-slate-400">Version 1.0.0</p>
          <div className="flex justify-center space-x-4 mt-4 text-xs text-slate-400">
            <button onClick={() => navigate('/privacy-policy')}>Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-use')}>Terms of Use</button>
            <button onClick={() => navigate('/cookies')}>Cookies</button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Logout Confirmation
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MobileLogout;