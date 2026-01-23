import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state on component mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = authService.getToken();
                const userData = authService.getCurrentUser();

                if (token && userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear potentially corrupted data
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            const userData = authService.getCurrentUser();

            setUser(userData);
            setIsAuthenticated(true);

            return response;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.signup(userData);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;