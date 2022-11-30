import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
//udskift det her med jers Firebase configuration
const firebaseApp = initializeApp({
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_AUTHDOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGINGSENDERID}`,
  appId: `${process.env.REACT_APP_APPID}`,
  measurementId: `${process.env.REACT_APP_MEASUREMENTID}`,
});

export const app = firebaseApp;
export const storage = getStorage(app);
