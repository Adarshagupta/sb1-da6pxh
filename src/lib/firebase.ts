import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const DEFAULT_TOKENS = 50000;

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Force account selection even if user is already signed in
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline',
      login_hint: '' // Clear any previous login hints
    });

    // Use signInWithPopup with the configured provider
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if this is a new user
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Initialize new user data with tokens
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        tokens: DEFAULT_TOKENS,
        createdAt: new Date().toISOString(),
        settings: {
          theme: 'system',
          notifications: true,
          language: 'en',
          emailNotifications: {
            bookGenerated: true,
            tokensPurchased: true,
            weeklyNewsletter: false,
          }
        }
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const initializeNewUser = async (uid: string, email: string) => {
  const userData = {
    email,
    tokens: DEFAULT_TOKENS,
    createdAt: new Date().toISOString(),
    settings: {
      theme: 'system',
      notifications: true,
      language: 'en',
      emailNotifications: {
        bookGenerated: true,
        tokensPurchased: true,
        weeklyNewsletter: false,
      }
    }
  };
  
  await setDoc(doc(db, 'users', uid), userData);
};

export const updateUserTokens = async (uid: string, newTokenCount: number) => {
  await updateDoc(doc(db, 'users', uid), {
    tokens: newTokenCount
  });
};

export const getUserTokens = async (uid: string): Promise<number> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.data()?.tokens ?? 0;
};