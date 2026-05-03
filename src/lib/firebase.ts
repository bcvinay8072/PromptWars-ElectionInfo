/**
 * Firebase Integration Module for CivicSync
 * 
 * Provides Firebase Analytics event tracking, Firestore chat history persistence,
 * and Google Analytics 4 integration for comprehensive telemetry.
 * 
 * @module firebase
 * @see https://firebase.google.com/docs/web/setup
 */
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics, isSupported } from 'firebase/analytics';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

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

/** Firebase app instance */
let app: FirebaseApp;

/** Firebase Analytics instance */
let analytics: Analytics | null = null;

/** Firestore database instance */
let db: Firestore;

/**
 * Initializes the Firebase application, Analytics, and Firestore.
 * Analytics is only initialized in supported browser environments.
 */
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // Analytics is only supported in browser environments
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully.');
    }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Tracks a custom event in Firebase Analytics.
 * Safely handles cases where analytics is not available.
 * 
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
 * Used for navigation tracking across the single-page application.
 * 
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
 * Logs when users send messages to the AI assistant.
 * 
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
 * Used when users search for polling stations by state.
 * 
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
 * 
 * @param stepNumber - The step number in the voter journey (1-4)
 * @param stepName - The name of the step
 */
export const trackJourneyStep = (stepNumber: number, stepName: string): void => {
  trackEvent('journey_step_view', {
    step_number: stepNumber,
    step_name: stepName,
  });
};

/** Interface for chat message data stored in Firestore */
interface ChatMessageData {
  userMessage: string;
  aiResponse: string;
  timestamp: any;
  sessionId: string;
}

/**
 * Saves a chat interaction to Firestore for analytics and audit purposes.
 * Messages are stored in the 'chat_history' collection.
 * Only the first 200 characters of each message are stored for privacy.
 * 
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
    
    const chatData: ChatMessageData = {
      userMessage: userMessage.substring(0, 200), // Truncate for privacy
      aiResponse: aiResponse.substring(0, 200),
      timestamp: serverTimestamp(),
      sessionId,
    };
    
    await addDoc(collection(db, 'chat_history'), chatData);
  } catch (error) {
    // Silently fail — analytics should never break the user experience
    console.warn('Firestore save failed:', error);
  }
};

export { app, analytics, db };
