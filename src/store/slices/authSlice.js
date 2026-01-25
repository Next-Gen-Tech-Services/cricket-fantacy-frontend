import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';

// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            // response here is response.data from the API
            // which contains: { _id, name, email, role, token }
            
            const { token, ...user } = response;
            
            // Store in persistent storage
            if (token) {
                storage.setItem('token', token);
            }
            if (user) {
                storage.setItem('user', user);
            }

            return {
                user: user,
                token: token
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData);

            // Store in persistent storage
            if (response.token) {
                storage.setItem('token', response.token);
            }
            if (response.user) {
                storage.setItem('user', response.user);
            }

            return {
                user: response.user,
                token: response.token
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Signup failed');
        }
    }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await authService.logout();

            // Clear persistent storage
            storage.removeItem('token');
            storage.removeItem('user');

            return null;
        } catch {
            // Even if logout fails, clear local data
            storage.removeItem('token');
            storage.removeItem('user');
            return null;
        }
    }
);

// Async thunk for refreshing user profile
export const refreshProfile = createAsyncThunk(
    'auth/refreshProfile',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.refreshProfile();
            storage.setItem('user', user);
            return user;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to refresh profile');
        }
    }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const user = await authService.updateProfile(userData);
            storage.setItem('user', user);
            return user;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await authService.changePassword(passwordData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to change password');
        }
    }
);

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send reset email');
        }
    }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const response = await authService.resetPassword(resetData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);

// Async thunk for initializing auth state
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        try {
            // Try to get token and user from both storage methods for compatibility
            let token = storage.getItem('token') || authService.getToken();
            let user = storage.getItem('user') || authService.getCurrentUser();

            if (token && user) {
                // Store in unified storage if found in authService
                if (!storage.getItem('token') && token) {
                    storage.setItem('token', token);
                }
                if (!storage.getItem('user') && user) {
                    storage.setItem('user', user);
                }

                return {
                    user,
                    token,
                    isAuthenticated: true
                };
            }

            // Clear invalid data
            storage.clearAuthData();
            // Clear authService data without redirect
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return {
                user: null,
                token: null,
                isAuthenticated: false
            };
        } catch (error) {
            console.error('Error initializing auth:', error);
            storage.clearAuthData();
            return rejectWithValue('Authentication initialization failed');
        }
    }
);

// Get initial state from storage
const getInitialAuthState = () => {
    try {
        // Clear any corrupted storage first
        const checkStorageIntegrity = () => {
            try {
                const testToken = localStorage.getItem('token');
                const testUser = localStorage.getItem('user');
                
                if (testToken && (testToken === 'undefined' || testToken === 'null')) {
                    localStorage.removeItem('token');
                }
                if (testUser && (testUser === 'undefined' || testUser === 'null')) {
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.warn('Storage integrity check failed:', e);
            }
        };
        
        checkStorageIntegrity();
        
        // Check both storage methods for compatibility
        const token = storage.getItem('token') || authService.getToken();
        const user = storage.getItem('user') || authService.getCurrentUser();

        if (token && user && typeof user === 'object') {
            return {
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isInitialized: false,
            };
        }
    } catch (error) {
        console.error('Error parsing auth data from storage:', error);
        storage.clearAuthData();
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: false,
    };
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isInitialized = true;
            storage.clearAuthData();
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            storage.setItem('user', state.user);
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.isInitialized = true;
            })

            // Signup cases
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                // Don't auto-login after signup, let user login manually
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.error = null;
            })

            // Initialize auth cases
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
                state.isInitialized = false;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.isInitialized = true;
            });
    },
});

export const { clearError, resetAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;