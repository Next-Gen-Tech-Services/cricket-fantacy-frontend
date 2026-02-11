import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-multi-carousel/lib/styles.css"
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { initializeAuth } from './store/slices/authSlice'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const swPath = import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js';
      const mainSW = await navigator.serviceWorker.register(swPath, {
        scope: './',
        updateViaCache: 'none'
      });
      console.log('✅ PWA Service Worker registered:', mainSW);
      
      // Check for updates
      mainSW.addEventListener('updatefound', () => {
        console.log('🔄 New service worker available');
      });
    } catch (error) {
      console.error('❌ SW registration failed:', error);
    }
  });
}

// App wrapper to initialize auth state
function AppWrapper() {
  useEffect(() => {
    // Initialize auth state from storage when app starts
    store.dispatch(initializeAuth());
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
