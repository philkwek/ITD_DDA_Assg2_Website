 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
 import { getAuth, initializeAuth, 
     createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
signOut,
onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
 import { getDatabase, ref, child, set, update, remove, get } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA25qh-gs-cOv-eC9_sa2ZQJOie--a5kXc",
    authDomain: "itd-dda-assg2.firebaseapp.com",
    databaseURL: "https://itd-dda-assg2-default-rtdb.firebaseio.com",
    projectId: "itd-dda-assg2",
    storageBucket: "itd-dda-assg2.appspot.com",
    messagingSenderId: "171136772904",
    appId: "1:171136772904:web:74f60054d60cedecac3e1d",
    measurementId: "G-X8PN9WYBVE"
  };



 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth();
 const db = getDatabase();

 //References
 var signUpButton = document.getElementById("signUp");
 var loginButton = document.getElementById("login");
 var logoutButton = document.getElementById("logout");

// Functions
function signUpUser(email, username, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        writeUserData(user.uid, username, email);
        return;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return;
    });
}

function loginUser(email, username, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      console.log("User logged in succesfully")
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function logoutUser(){
    const auth = getAuth();
    signOut(auth).then(() => {
        displayUserData();
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
}

function writeUserData(userId, name, email) {
    set(ref(db, 'players/' + userId), {
      username: name,
      email: email,
    })
    .then(()=>{
        console.log("User data written successfully");
    })
    .catch((error)=>{
        console.log("Error uploading data!");
    });
}


function displayUserData(user){
    
    const dbref = ref(db);
    console.log("displaying user data...");

    get(child(dbref, "players/" + user.uid)).then((snapshot)=>{
        if(snapshot.exists()){
            console.log("Username: " + snapshot.val().username);
            document.getElementById("usernameText").textContent = snapshot.val().username;
            document.getElementById("emailText").textContent = snapshot.val().email;
            document.getElementById("userIDText").textContent = user.uid;
        } 
        else 
        {
            console.log("No snapshot found!");
        }
    });
};



// Event listeners
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      displayUserData(user);
      // ...
    } else {
      // User is signed out
      document.getElementById("usernameText").textContent = "User is not signed in";
      document.getElementById("emailText").textContent = "User is not signed in";
      document.getElementById("userIDText").textContent = "User is not signed in";
      // ...
    }
});