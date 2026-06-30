import {computed, reactive} from 'vue';
import {jwtDecode} from 'jwt-decode';
import {AuthAPI} from './api';
import type {AuthError, AuthState, RegisterRequest, User, VerifyCodeRequest} from './types';

//const authAPI = new AuthAPI();

// Global auth state
const authState = reactive<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

// Storage keys
const TOKEN_KEY = 'petoman_auth_token';
const USER_KEY = 'petoman_auth_user';

// Utility functions
const saveToStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

const clearStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

const isTokenValid = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Initialize auth state from storage
const initializeAuth = () => {
  const token = getFromStorage(TOKEN_KEY);
  const user = getFromStorage(USER_KEY);
  
  if (token && user && isTokenValid(token)) {
    authState.token = token;
    authState.user = user;
    authState.isAuthenticated = true;
  } else {
    clearStorage();
  }
};

// Main composable function
export const useAuth = (baseUrl:string) => {
  const authAPI = new AuthAPI(baseUrl);
  const checkPhoneNumber = async (phoneNumber: string): Promise<{ exists: boolean }> => {
    try {
      authState.isLoading = true;
      authState.error = null;
      return await authAPI.checkPhoneNumber(phoneNumber);
    } catch (error) {
      authState.error = error as AuthError;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<{ data:any }> => {
    try {
      authState.isLoading = true;
      authState.error = null;
      return await authAPI.sendOTP(phoneNumber)
    } catch (error) {
      authState.error = error as AuthError;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  };

  const verifyOTP = async (data: VerifyCodeRequest): Promise<User> => {
    try {
      authState.isLoading = true;
      authState.error = null;
      
      const response = await authAPI.verifyOTP(data);
      
      // Update auth state
      authState.token = response.token;
      authState.user = response.user;
      authState.isAuthenticated = true;
      
      // Save to storage
      saveToStorage(TOKEN_KEY, response.token);
      saveToStorage(USER_KEY, response.user);
      
      return response.user;
    } catch (error) {
      authState.error = error as AuthError;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    try {
      authState.isLoading = true;
      authState.error = null;
      
      const response = await authAPI.register(data);
      
      // Update auth state
      authState.token = response.token;
      authState.user = response.user;
      authState.isAuthenticated = true;
      
      // Save to storage
      saveToStorage(TOKEN_KEY, response.token);
      saveToStorage(USER_KEY, response.user);
      
      return response.user;
    } catch (error) {
      authState.error = error as AuthError;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear state and storage
      authState.token = null;
      authState.user = null;
      authState.isAuthenticated = false;
      authState.error = null;
      clearStorage();
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authAPI.refreshToken();
      
      authState.token = response.token;
      authState.user = response.user;
      
      saveToStorage(TOKEN_KEY, response.token);
      saveToStorage(USER_KEY, response.user);
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      authState.isLoading = true;
      authState.error = null;
      
      const updatedUser = await authAPI.updateProfile(data);
      
      authState.user = updatedUser;
      saveToStorage(USER_KEY, updatedUser);
      
      return updatedUser;
    } catch (error) {
      authState.error = error as AuthError;
      throw error;
    } finally {
      authState.isLoading = false;
    }
  };

  const clearError = () => {
    authState.error = null;
  };

  // Computed properties
  const isAuthenticated = computed(() => authState.isAuthenticated);
  const user = computed(() => authState.user);
  const isLoading = computed(() => authState.isLoading);
  const error = computed(() => authState.error);
  const token = computed(() => authState.token);
  
  const isProfileComplete = computed(() => {
    return authState.user?.firstName && authState.user?.lastName;
  });

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    token,
    isProfileComplete,
    
    // Actions
    checkPhoneNumber,
    sendOTP,
    verifyOTP,
    register,
    logout,
    refreshToken,
    updateProfile,
    clearError,
    
    // Utils
    initializeAuth,
  };
};

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  initializeAuth();
}

export default useAuth;
