import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  
  apiKey: 'AIzaSyAchKHp4083nE5J-4ba5oWw9ihb-AVoUmU',
  authDomain: 'blossom-77ec5.firebaseapp.com',
  projectId: 'blossom-77ec5',
  storageBucket: 'blossom-77ec5.appspot.com',
  messagingSenderId: '224118477905',
  appId: '1:224118477905:android:7900373c70c82e8f8fd470',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
