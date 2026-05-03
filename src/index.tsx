import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize Firebase services (Analytics, Firestore, Auth, Performance, Remote Config, FCM)
import './lib/firebase';

// Register PWA service worker for offline support and caching
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for Progressive Web App (PWA) functionality
serviceWorkerRegistration.register({
  onSuccess: () => console.log('CivicSync is ready for offline use.'),
  onUpdate: () => console.log('CivicSync update available. Refresh to update.'),
});

// Report Web Vitals to Google Analytics 4 for performance monitoring
reportWebVitals((metric) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
