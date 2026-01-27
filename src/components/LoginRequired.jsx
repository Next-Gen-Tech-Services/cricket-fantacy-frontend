import { Link } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function LoginRequired({ message = "You need to login to access this feature" }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#273470] to-[#1e2859] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
            <FaLock className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/login"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#273470] font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            <FaSignInAlt className="w-4 h-4" />
            Log In
          </Link>
          
          <Link 
            to="/signup"
            className="w-full bg-[#273470] hover:bg-[#1e2859] text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            <FaUserPlus className="w-4 h-4" />
            Sign Up
          </Link>
          
          <Link 
            to="/"
            className="block text-gray-500 hover:text-gray-700 text-sm mt-4 transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}