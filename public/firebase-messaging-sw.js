// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyCE2e9bDJAlSpnW95E2tfI1-8ck3UIQeDo",
  authDomain: "cricket-fantasy-743d8.firebaseapp.com",
  projectId: "cricket-fantasy-743d8",
  storageBucket: "cricket-fantasy-743d8.firebasestorage.app",
  messagingSenderId: "439087427201",
  appId: "1:439087427201:web:57bb12f2f19d28f8232780",
  measurementId: "G-7LYB3DBG3H"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Cricket Fantasy Update';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.data?.type || 'default',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
