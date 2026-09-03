import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0241028863",
  appId: "1:2541924531:web:335ef5b507719c9e84c0c6",
  apiKey: "AIzaSyDXLjUzpR8fiwEzamaeyoj99hLp8p045AE",
  authDomain: "gen-lang-client-0241028863.firebaseapp.com",
  storageBucket: "gen-lang-client-0241028863.firebasestorage.app",
  messagingSenderId: "2541924531",
  oAuthClientId: "2541924531-hhcs15949dt7ch26dmdsvvii59ehs80q.apps.googleusercontent.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = typeof window !== 'undefined' ? getAuth(app) : null;
export const db = typeof window !== 'undefined' ? getFirestore(app) : null;

export const googleProvider = typeof window !== 'undefined' ? new GoogleAuthProvider() : null;
export const githubProvider = typeof window !== 'undefined' ? new GithubAuthProvider() : null;

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
