import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDhoRvo-jfAyTSHplUglMO0Oixx2l2VZHQ",
  authDomain: "aioapi-4c80f.firebaseapp.com",
  projectId: "aioapi-4c80f",
  storageBucket: "aioapi-4c80f.appspot.com",
  messagingSenderId: "639782628054",
  appId: "1:639782628054:web:43c0360ffc5c509eed7777"
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