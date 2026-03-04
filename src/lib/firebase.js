/**
 * SignLex Frontend - Firebase Configuration
 * Author: Pawan Rijal
 * 
 * Initializes the Firebase app and exports auth instance.
 * 
 * Status: ~15% complete
 *   - Firebase app initialization configured
 *   - Auth instance exported
 *   - Environment variable placeholders set
 *   - Social login providers TODO
 *   - Auth state observer TODO
 * 
 * IMPORTANT: Replace placeholder values with actual Firebase project config.
 * These should be stored in environment variables (.env.local):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "signlex-app.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "signlex-app",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "signlex-app.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:placeholder",
};

// Initialize Firebase (prevent re-initialization in Next.js hot reload)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
