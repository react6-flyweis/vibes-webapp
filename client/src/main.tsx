import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Mobile App Initialization
function initializeMobileApp() {
  // Set CSS custom property for viewport height (mobile browser UI handling)
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });
  
  // Prevent zoom on input focus (iOS)
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content');
      if (content && !content.includes('user-scalable=no')) {
        viewportMeta.setAttribute('content', content + ', user-scalable=no');
      }
    }
  }
  
  // Add mobile app classes to body
  document.body.classList.add('mobile-app');
  
  // Detect if app is running as PWA
  if (window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone) {
    document.body.classList.add('pwa-mode');
    console.log('Running as PWA');
  }
  
  // Prevent context menu on long press (mobile)
  document.addEventListener('contextmenu', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
    }
  });
  
  // Handle back button behavior for mobile PWA
  if (window.history && window.history.pushState) {
    window.addEventListener('popstate', (e) => {
      // Handle back navigation in PWA
      console.log('Back navigation in PWA');
    });
  }
}

// Enhanced Service Worker Registration with Mobile Features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully');
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, refresh to activate
                console.log('[PWA] New content available, refreshing...');
                window.location.reload();
              }
            });
          }
        });
        
        // Request notification permission for mobile push notifications
        if ('Notification' in window && 'PushManager' in window) {
          if (Notification.permission === 'default') {
            // Don't request immediately, wait for user interaction
            console.log('[PWA] Push notifications available');
          }
        }
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
    
    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[PWA] Message from service worker:', event.data);
    });
  });
}

// Initialize mobile app features
initializeMobileApp();

createRoot(document.getElementById("root")!).render(<App />);
