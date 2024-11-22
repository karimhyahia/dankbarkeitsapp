import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEuIlErRxAfBGBpzaDQSIRwuONRvDojF0",
  authDomain: "dankbarkeits-app.firebaseapp.com",
  projectId: "dankbarkeits-app",
  storageBucket: "dankbarkeits-app.firebasestorage.app",
  messagingSenderId: "112937046853",
  appId: "1:112937046853:web:8c7067752ad83daf76e42c"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);