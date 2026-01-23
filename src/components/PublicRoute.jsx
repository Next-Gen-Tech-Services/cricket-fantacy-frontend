import { useAppSelector } from '../store/hooks';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAppSelector(state => state.auth);

  // Show loading while checking authentication or initializing
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#273470] to-[#1e2859]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-400 border-r-transparent" />
          <p className="mt-4 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;