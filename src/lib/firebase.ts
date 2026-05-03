/**
 * Firebase Integration Module for CivicSync
 * 
 * Comprehensive Firebase ecosystem integration providing:
 * - Firebase Analytics (event tracking & page views)
 * - Cloud Firestore (chat history persistence)
 * - Firebase Authentication (Google Sign-In)
 * - Firebase Performance Monitoring (custom traces)
 * - Firebase Remote Config (cloud-based feature flags)
 * - Firebase Cloud Messaging (push notification registration)
 * 
 * @module firebase
 * @see https://firebase.google.com/docs/web/setup
 */
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User
} from 'firebase/auth';
import {
  getPerformance,
  trace as perfTrace,
  FirebasePerformance
} from 'firebase/performance';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  RemoteConfig
} from 'firebase/remote-config';
import {
  getMessaging,
  getToken,
  Messaging
} from 'firebase/messaging';

/** Firebase configuration for the CivicSync project */
const firebaseConfig = {
  apiKey: "AIzaSyAN8p516ZmEhUObRkMs2eFlrnyHyVgIP8o",
  authDomain: "promptwars-494711.firebaseapp.com",
  projectId: "promptwars-494711",
  storageBucket: "promptwars-494711.firebasestorage.app",
  messagingSenderId: "299191823241",
  appId: "1:299191823241:web:b1ad04c850c5b95c868f58",
  measurementId: "G-K5W1ZXRBVG"
};

// ============================================
// CORE INITIALIZATION
// ============================================

/** Firebase app instance */
let app: FirebaseApp;

/** Firebase Analytics instance */
let analytics: Analytics | null = null;

/** Firestore database instance */
let db: Firestore;

/** Firebase Authentication instance */
let auth: Auth;

/** Firebase Performance Monitoring instance */
let performance: FirebasePerformance | null = null;

/** Firebase Remote Config instance */
let remoteConfig: RemoteConfig | null = null;

/** Firebase Cloud Messaging instance */
let messaging: Messaging | null = null;

/**
 * Initializes all Firebase services.
 * Analytics, Performance, and Messaging are only initialized in supported environments.
 */
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  // Analytics — only supported in browser environments
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully.');
    }
  });

  // Performance Monitoring — browser only
  try {
    performance = getPerformance(app);
    console.log('Firebase Performance Monitoring initialized.');
  } catch (e) {
    console.warn('Firebase Performance not available:', e);
  }

  // Remote Config — set defaults and fetch
  try {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    remoteConfig.defaultConfig = {
      welcome_message: "Namaskar! I'm your CivicSync Assistant for Indian elections.",
      max_chat_messages: "50",
      enable_voice_input: "false",
    };
    fetchAndActivate(remoteConfig).then(() => {
      console.log('Firebase Remote Config fetched and activated.');
    }).catch(() => {
      console.warn('Remote Config fetch failed, using defaults.');
    });
  } catch (e) {
    console.warn('Firebase Remote Config not available:', e);
  }

  // Cloud Messaging — browser only, requires service worker
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
      console.log('Firebase Cloud Messaging initialized.');
    }
  } catch (e) {
    console.warn('Firebase Cloud Messaging not available:', e);
  }

} catch (error) {
  console.error('Firebase initialization error:', error);
}

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

/**
 * Tracks a custom event in Firebase Analytics.
 * @param eventName - The name of the event to log
 * @param eventParams - Optional parameters to attach to the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>): void => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    console.warn('Analytics event tracking failed:', error);
  }
};

/**
 * Tracks a page view event in Firebase Analytics.
 * @param pageName - The name of the page being viewed
 */
export const trackPageView = (pageName: string): void => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

/**
 * Tracks a chat interaction event in Firebase Analytics.
 * @param messageLength - The character length of the user's message
 * @param isError - Whether the interaction resulted in an error
 */
export const trackChatInteraction = (messageLength: number, isError: boolean = false): void => {
  trackEvent('chat_interaction', {
    message_length: messageLength,
    is_error: isError,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Tracks a search event in Firebase Analytics.
 * @param searchTerm - The search query entered by the user
 * @param hasResult - Whether the search returned a result
 */
export const trackSearch = (searchTerm: string, hasResult: boolean): void => {
  trackEvent('search', {
    search_term: searchTerm,
    has_result: hasResult,
  });
};

/**
 * Tracks voter journey step interactions in Firebase Analytics.
 * @param stepNumber - The step number in the voter journey (1-4)
 * @param stepName - The name of the step
 */
export const trackJourneyStep = (stepNumber: number, stepName: string): void => {
  trackEvent('journey_step_view', {
    step_number: stepNumber,
    step_name: stepName,
  });
};

// ============================================
// FIRESTORE FUNCTIONS
// ============================================

/** Interface for chat message data stored in Firestore */
interface ChatMessageData {
  userMessage: string;
  aiResponse: string;
  timestamp: any;
  sessionId: string;
  userId?: string;
}

/**
 * Saves a chat interaction to Firestore for analytics and audit purposes.
 * Messages are truncated to 200 characters for privacy.
 * @param userMessage - The user's message (truncated for privacy)
 * @param aiResponse - The AI's response (truncated for privacy)
 * @param sessionId - A unique identifier for the current chat session
 */
export const saveChatToFirestore = async (
  userMessage: string,
  aiResponse: string,
  sessionId: string
): Promise<void> => {
  try {
    if (!db) return;

    const currentUser = auth?.currentUser;
    const chatData: ChatMessageData = {
      userMessage: userMessage.substring(0, 200),
      aiResponse: aiResponse.substring(0, 200),
      timestamp: serverTimestamp(),
      sessionId,
      userId: currentUser?.uid || 'anonymous',
    };

    await addDoc(collection(db, 'chat_history'), chatData);
  } catch (error) {
    console.warn('Firestore save failed:', error);
  }
};

// ============================================
// AUTHENTICATION FUNCTIONS (Google Sign-In)
// ============================================

/** Google Auth Provider for Sign-In */
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Signs in the user with Google using a popup window.
 * Uses Firebase Authentication with GoogleAuthProvider.
 * @returns The authenticated User object, or null on failure
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackEvent('login', { method: 'google' });
    return result.user;
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user') {
      console.error('Google Sign-In error:', error);
      trackEvent('login_error', { method: 'google', error_code: error.code });
    }
    return null;
  }
};

/**
 * Signs out the current user from Firebase Authentication.
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    trackEvent('logout');
  } catch (error) {
    console.error('Sign-out error:', error);
  }
};

/**
 * Subscribes to authentication state changes.
 * @param callback - Function called with the User object (or null) on state change
 * @returns Unsubscribe function to stop listening
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================
// PERFORMANCE MONITORING FUNCTIONS
// ============================================

/**
 * Starts a custom performance trace for measuring operation duration.
 * Used to measure chat response times and page load performance.
 * @param traceName - The name of the trace
 * @returns An object with a stop() method to end the trace
 */
export const startPerformanceTrace = (traceName: string): { stop: () => void } => {
  try {
    if (performance) {
      const t = perfTrace(performance, traceName);
      t.start();
      return {
        stop: () => {
          try { t.stop(); } catch (e) { /* trace already stopped */ }
        }
      };
    }
  } catch (error) {
    console.warn('Performance trace failed:', error);
  }
  return { stop: () => {} };
};

// ============================================
// REMOTE CONFIG FUNCTIONS
// ============================================

/**
 * Gets a string value from Firebase Remote Config.
 * Falls back to the default value if Remote Config is unavailable.
 * @param key - The configuration key to retrieve
 * @returns The configuration value as a string
 */
export const getConfigValue = (key: string): string => {
  try {
    if (remoteConfig) {
      return getValue(remoteConfig, key).asString();
    }
  } catch (error) {
    console.warn('Remote Config getValue failed:', error);
  }
  return '';
};

/**
 * Gets a number value from Firebase Remote Config.
 * @param key - The configuration key to retrieve
 * @returns The configuration value as a number
 */
export const getConfigNumber = (key: string): number => {
  try {
    if (remoteConfig) {
      return getValue(remoteConfig, key).asNumber();
    }
  } catch (error) {
    console.warn('Remote Config getNumber failed:', error);
  }
  return 0;
};

// ============================================
// CLOUD MESSAGING FUNCTIONS
// ============================================

/**
 * Requests permission and registers for Firebase Cloud Messaging.
 * Returns the FCM token for push notification delivery.
 * @returns The FCM token string, or null if unavailable
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Push notification permission denied.');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.messagingSenderId,
    });

    trackEvent('push_notification_registered');
    console.log('FCM Token:', token?.substring(0, 10) + '...');
    return token;
  } catch (error) {
    console.warn('FCM registration failed:', error);
    return null;
  }
};

// ============================================
// EXPORTS
// ============================================

export { app, analytics, db, auth, performance, remoteConfig, messaging };
export type { User };
