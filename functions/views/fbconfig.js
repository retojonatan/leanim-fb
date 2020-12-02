const firebaseConfig = {
  apiKey: "AIzaSyB0TKaKMIDLXBjCLd0YB4SizbW-oN_WaRQ",
  authDomain: "fir-leanim.firebaseapp.com",
  databaseURL: "https://fir-leanim.firebaseio.com",
  projectId: "firebase-leanim",
  storageBucket: "firebase-leanim.appspot.com",
  messagingSenderId: "255885565279",
  appId: "1:255885565279:web:dac5ec28601ab798d4aaea",
  measurementId: "G-3DY76L7MSC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();