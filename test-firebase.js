import { initializeApp } from 'firebase/app';
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

const app = initializeApp(firebaseConfig);
try {
  const db = getFirestore(app, 'ai-studio-atlantidaos-90244648-1c8c-45e1-b2f7-0663c0cf42ef');
  console.log("SUCCESS!");
} catch (err) {
  console.error("ERROR:", err.message);
}
