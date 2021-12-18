 //This script handles all operations related to firebase realtimeDB and authentication
 
 // Import the functions you need from the SDKs you need
 import { getAuth, initializeAuth, 
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      setPersistence,
      browserSessionPersistence,
      browserLocalPersistence, } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
 import { getDatabase, ref, child, set, update, remove, get, orderByChild } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"

//Reference the izmports
 const auth = getAuth();
 const db = getDatabase();

 //References
 var signUpButton = document.getElementById("signupButton");
 var loginButton = document.getElementById("loginButton");
 var logoutButton = document.getElementById("logout");
 var rememberMeState = document.getElementById("rememberMe"); //checkbox

// Functions
function signUpUser(email, username, password, authType){
  setPersistence(auth, authType)
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

function loginUser(email, password, authType){
    setPersistence(auth, authType) //sets persistence to remember user
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      console.log("User logged in succesfully")
      const user = userCredential.user;
      const dbref = ref(db);

      //checks if logged in user is admin or user
      get(child(dbref, "players/" + user.uid)).then((snapshot)=>{
        if(snapshot.exists()){
          if(snapshot.val().admin == "true"){
            console.log("user logged in in admin");
            window.location.href = "../../html/adminPages/adminHomepage.html";
          } else {
            console.log("user logged in is not admin");
            window.location.href = "../../html/userPages/userHomepage.html";
          }
        }
      });
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
function writeUserData(userId, username, email) {
    let newPlayer = new Player(email, username, userId);
    let newPlayerProfileData = new PlayerProfileData(0,0,0);
    let newMinigameStat = new MinigameStats(0,0,0,0,0,0);
    let newPlayerGameData = new PlayerGameData(0,0,newMinigameStat)
    
    //sets profile data
    set(ref(db, 'players/' + userId), newPlayer)
    .then(()=>{
        console.log("User data written successfully");
    })
    .catch((error)=>{
        console.log("Error uploading data!");
    });

    set(ref(db, 'playerSessionTime/' + userId), {
      "firstInstance": "firstInstance"
    })
    .then(()=>{
        console.log("User data written successfully");
    })
    .catch((error)=>{
        console.log("Error uploading data!");
    });

    set(ref(db, 'playerProfileData/' + userId), newPlayerProfileData)
    .then(()=>{
        console.log("User data written successfully");
    })
    .catch((error)=>{
        console.log("Error uploading data!");
    });

    set(ref(db, 'playerGameData/' + userId), newPlayerGameData)
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

  } else {
    // User is signed out

  }
});

console.log(auth)

if (signUpButton){
  signUpButton.addEventListener("click", function(x){
    x.preventDefault();

    //Check remember me state
    var authType = browserSessionPersistence;
    if(rememberMeState.checked){
      authType = browserLocalPersistence;
    } else {
      authType = browserSessionPersistence;
    }

    var emailInput = document.getElementById("emailInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    var usernameInput = document.getElementById("usernameInput").value;
    console.log("Email: " + emailInput + " Password: " + passwordInput + " Username: " + usernameInput);
    signUpUser(emailInput, usernameInput, passwordInput, authType);
    console.log("Signing up user...")
  })
}

if (loginButton){
  loginButton.addEventListener("click",function(x){
    x.preventDefault();

    //Check remember me state
    var authType = browserSessionPersistence;
    if(rememberMeState.checked){
      authType = browserLocalPersistence;
    } else {
      authType = browserSessionPersistence;
    }

    var emailInput = document.getElementById("emailInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    loginUser(emailInput, passwordInput, authType);
    console.log("Logging in user...")
  })
}


