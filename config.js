import firebase from 'firebase';
require('@firebase/firestore');
var firebaseConfig = {
  apiKey: "AIzaSyDGBsjSVogFHtb68sTbPvQXnE_GLO5BQ2s",
  authDomain: "barter-system-bbabe.firebaseapp.com",
  projectId: "barter-system-bbabe",
  storageBucket: "barter-system-bbabe.appspot.com",
  messagingSenderId: "627235269446",
  appId: "1:627235269446:web:732dbf0bf6da7a8c2e1347",
  firebaseURL:"https://barter-system-bbabe.firebaseio.com"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();