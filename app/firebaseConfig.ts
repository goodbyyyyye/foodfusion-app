import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCsBTM_KyS62GXwcXtDHtsUL3cWJJBHNrw",
    authDomain: "foodfusion-64276.firebaseapp.com",
    projectId: "foodfusion-64276",
    storageBucket: "foodfusion-64276.firebasestorage.app",
    messagingSenderId: "1007069863840",
    appId: "1:1007069863840:web:3ae1c0d008c859c4638ec5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);