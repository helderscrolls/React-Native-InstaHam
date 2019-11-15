import firebase from 'firebase';

// Api details
const firebaseConfig = {
  apiKey: 'AIzaSyA0mNvZABRDrFURxUzFuHr__WN3y_aESjA',
  authDomain: 'instaham-8adc6.firebaseapp.com',
  databaseURL: 'https://instaham-8adc6.firebaseio.com',
  projectId: 'instaham-8adc6',
  storageBucket: 'instaham-8adc6.appspot.com',
  messagingSenderId: '123217609067',
  appId: '1:123217609067:web:a1cfd14fbae98d04becc2e',
  measurementId: 'G-M6JTX7F4KH',
};

firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
