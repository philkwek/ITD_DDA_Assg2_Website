 //This script handles all operations related to firebase realtimeDB and authentication
 
 // Import the functions you need from the SDKs you need
 import { getAuth, initializeAuth, 
     createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
signOut,
onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
 import { getDatabase, ref, child, set, update, remove, get, orderByChild } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"

//Reference the imports
 const auth = getAuth();
 const db = getDatabase();

 //References
 var signUpButton = document.getElementById("signupButton");
 var loginButton = document.getElementById("loginButton");
 var logoutButton = document.getElementById("logout");

// Functions
function signUpUser(email, username, password){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //Calls function to create a new user profile for realtimeDB
        writeUserData(user.uid, username, email);
        return;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(error.message);
        return;
    });
}

function loginUser(email, password){
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
      alert(error.message);
      return;
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

//function for writing user data into the realtimeDB
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

// Event listeners
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out

      // ...
    }
});

if (signUpButton){
  signUpButton.addEventListener("click", function(x){
    x.preventDefault();
    //var emailInput = document.getElementById("emailInput").value;
    var emailInput = document.getElementById("emailInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    var usernameInput = document.getElementById("usernameInput").value;
    console.log("Email: " + emailInput + " Password: " + passwordInput + " Username: " + usernameInput);
    signUpUser(emailInput, usernameInput, passwordInput);
    console.log("Signing up user...")
  })
}

if (loginButton){
  loginButton.addEventListener("click",function(x){
    x.preventDefault();
    var emailInput = document.getElementById("emailInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    loginUser(emailInput, passwordInput);
    console.log("Logging in user...")
  })
}

