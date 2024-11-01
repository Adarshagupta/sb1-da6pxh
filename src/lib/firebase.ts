import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

interface UserData {
  email: string;
  tokens: number;
  // ... other existing fields
}

export const initializeNewUser = async (uid: string, email: string) => {
  const userData: UserData = {
    email,
    tokens: 50000,
    // ... other existing fields
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