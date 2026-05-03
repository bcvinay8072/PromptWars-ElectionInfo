/**
 * Service Worker Registration for CivicSync PWA
 * 
 * Enables Progressive Web App capabilities including:
 * - Offline caching of static assets
 * - Installability on mobile and desktop
 * - Background sync preparation for Firebase Cloud Messaging
 * 
 * @module serviceWorkerRegistration
 * @see https://developers.google.com/web/fundamentals/primers/service-workers
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

/** Configuration for service worker registration callbacks */
interface Config {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

/**
 * Registers the service worker for PWA functionality.
 * Only registers in production environments with HTTPS.
 * @param config - Optional callbacks for success and update events
 */
export function register(config?: Config): void {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);

    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('CivicSync PWA: Service worker is active (localhost).');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Registers a valid service worker.
 */
function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('CivicSync PWA: Service worker registered successfully.');

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('CivicSync PWA: New content is available; please refresh.');
              config?.onUpdate?.(registration);
            } else {
              console.log('CivicSync PWA: Content is cached for offline use.');
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('CivicSync PWA: Error during service worker registration:', error);
    });
}

/**
 * Checks if a service worker can be found. If it can't, reloads the page.
 */
function checkValidServiceWorker(swUrl: string, config?: Config): void {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('CivicSync PWA: No internet connection found. App is running in offline mode.');
    });
}

/**
 * Unregisters the service worker.
 */
export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
