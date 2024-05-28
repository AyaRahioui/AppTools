// src/app/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';


const firebaseConfig = environment.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
