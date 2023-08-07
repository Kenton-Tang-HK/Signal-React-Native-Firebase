import firebase from "firebase/compat/app"
import { initializeApp } from 'firebase/app';
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { getFirestore } from 'firebase/firestore';
import { getAuth , createUserWithEmailAndPassword} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDa6O7kwBN_ewj-BtTlpahOw7xDN8z0AN0",
    authDomain: "signal-clone-rn-firebase.firebaseapp.com",
    projectId: "signal-clone-rn-firebase",
    storageBucket: "signal-clone-rn-firebase.appspot.com",
    messagingSenderId: "670459129635",
    appId: "1:670459129635:web:84aff2f4e61a128ea0e696"
  };
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db , auth };