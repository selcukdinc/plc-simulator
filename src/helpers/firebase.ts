import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredConfig = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

if (hasRequiredConfig) {
  firebase.initializeApp(config);
} else {
  console.warn("Firebase config missing; Firebase features are disabled.");
}

const createDisabledAuth = () => {
  const disabledError = () =>
    Promise.reject(new Error("Firebase is disabled because configuration is missing."));
  return {
    currentUser: null,
    signInWithEmailAndPassword: disabledError,
    createUserWithEmailAndPassword: disabledError,
    sendPasswordResetEmail: disabledError,
    signOut: disabledError,
    onAuthStateChanged: (callback: (user: firebase.User | null) => void) => {
      callback(null);
      return () => undefined;
    },
  } as unknown as firebase.auth.Auth;
};

export const firebaseEnabled = hasRequiredConfig;
export const auth = hasRequiredConfig ? firebase.auth() : createDisabledAuth();
export const firestore = hasRequiredConfig ? firebase.firestore() : null;
export const analytics = hasRequiredConfig ? firebase.analytics() : null;

export const logEvent = (name: string, params?: Record<string, unknown>) => {
  if (!analytics) return;
  analytics.logEvent(name, params);
};

export default firebase;
