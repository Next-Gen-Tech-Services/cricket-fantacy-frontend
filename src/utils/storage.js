// Storage utility for handling both localStorage and cookies
class StorageService {
  // Cookie methods
  setCookie(name, value, days = 7) {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
      document.cookie = `${name}=${encodeURIComponent(cookieValue)};expires=${expires.toUTCString()};path=/;secure;samesite=lax`;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  deleteCookie(name) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure;samesite=lax`;
    } catch (error) {
      console.error('Error deleting cookie:', error);
    }
  }

  // localStorage methods with fallback to cookies
  setItem(key, value) {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        this.setCookie(key, value, 30); // 30 days for important data
      }
    } catch (error) {
      console.error('Error setting storage item:', error);
      // Fallback to cookie if localStorage fails
      this.setCookie(key, value, 30);
    }
  }

  getItem(key) {
    try {
      if (this.isLocalStorageAvailable()) {
        const item = localStorage.getItem(key);
        if (!item || item === 'undefined' || item === 'null') {
          return null;
        }
        return JSON.parse(item);
      } else {
        const cookieValue = this.getCookie(key);
        return cookieValue;
      }
    } catch (error) {
      console.error('Error getting storage item:', error);
      // Clear the corrupted item
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
      return null;
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
      // Also remove from cookies as a safety measure
      this.deleteCookie(key);
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  }

  // Check if localStorage is available
  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Clear all auth-related data
  clearAuthData() {
    this.removeItem('token');
    this.removeItem('authToken'); // Legacy key from authService
    this.removeItem('user');
    this.removeItem('refreshToken');
  }
}

export const storage = new StorageService();
export default storage;