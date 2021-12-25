 //This script handles all operations related to firebase realtimeDB and authentication
 
 // Import the functions you need from the SDKs you need
 import { getAuth, initializeAuth, 
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      setPersistence,
      browserSessionPersistence,
      browserLocalPersistence,
      sendPasswordResetEmail,
      updateEmail, } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
 import { getDatabase, ref, child, set, update, remove, get, orderByChild } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"

//Reference the izmports
 const auth = getAuth();
 const db = getDatabase();

 //References
 var signUpButton = document.getElementById("signupButton");
 var loginButton = document.getElementById("loginButton");
 var logoutButton = document.getElementById("logoutButton");
 var rememberMeState = document.getElementById("rememberMe"); //checkbox
 var resetPasswordButton = document.getElementById("resetPasswordButton");
 var usernamePlace = document.getElementById("dropdownMenuButton");
 var changeEmailButton = document.getElementById("newEmailConfirmBtn");
 var changeUsernameButton = document.getElementById("newUsernameConfirmBtn");

// Functions
function signUpUser(email, username, password, authType){
  setPersistence(auth, authType)
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
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
          if(snapshot.val().admin){
            console.log("user logged in in admin");
            window.location.href = "../html/adminPages/adminHomepage.html";
          } else {
            console.log("user logged in is not admin");
            window.location.href = "../html/userPages/userHomepage.html";
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

function forgotPassword(email){
  console.log("Sending email...")
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    console.log("Email sent!");
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
}

//function for writing user data into the realtimeDB
function writeUserData(userId, username, email) {
    let newPlayer = new Player(email, username, userId);
    let newPlayerProfileData = new PlayerProfileData(0,0,0,0, username, 0);
    let newMinigameStat = new MinigameStats(0,0,0,0,0,0,0);
    let newPlayerGameData = new PlayerGameData(0,0,newMinigameStat, username)
    
    //sets profile data
    set(ref(db, 'players/' + userId), newPlayer)
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
    const uid = user.uid;
    console.log(uid);
    if (usernamePlace != null){
      const dbref = ref(db);
      get(child(dbref, "players/" + uid)).then((snapshot)=>{
        if(snapshot.exists()){
          const username = snapshot.val().username;
          $("#dropdownMenuButton").text(username);
        } else {
          console.log("Not found");
        }
      });
    }

    //For when user signs up and system logs user in
    var path = window. location. pathname;
    var page = path. split("/"). pop();
    console.log(page);
    if(page == "index.html"){
      const dbref = ref(db);
      //checks if logged in user is admin or user
      get(child(dbref, "players/" + user.uid)).then((snapshot)=>{
        if(snapshot.exists()){
          if(snapshot.val().admin){
            console.log("user logged in in admin");
            window.location.href = "html/adminPages/adminHomepage.html"
            
          } else {
            console.log("user logged in is not admin");
            window.location.href = "html/adminPages/userHomepage.html"
          }
        }
      });
    } 
    if(page == "signUp.html"){
      get(child(dbref, "players/" + user.uid)).then((snapshot)=>{
        if(snapshot.exists()){
          if(snapshot.val().admin){
            console.log("user logged in in admin");
            window.location.href = "../html/adminPages/adminHomepage.html"
            
          } else {
            console.log("user logged in is not admin");
            window.location.href = "../html/adminPages/userHomepage.html"
          }
        }
      });
    }
  } else {
    // User is signed out

  }
});

function changeEmail(newEmail) {
  const auth = getAuth();
  updateEmail(auth.currentUser, newEmail).then(() => {
    // Email updated!
    const emailUpdate = {};
    emailUpdate['/players/' + auth.currentUser.uid + "/email"] = newEmail;
    update(ref(db), emailUpdate);
    // ...
    alert("Email updated!");
  }).catch((error) => {
    // An error occurred
    // ...
    alert("Email update failed");
  });
}

function changeUsername(newUsername){
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  
  const usernameUpdate = {};
  usernameUpdate['/playerGameData/' + uid + "/username"] = newUsername;
  usernameUpdate['/playerProfileData/' + uid + "/username"] = newUsername;
  usernameUpdate['/players/' + uid + "/username"] = newUsername;
  return update(ref(db), usernameUpdate);
}

if (changeEmailButton){
  changeEmailButton.addEventListener("click", function(x){
    console.log("email button clicked");
    x.preventDefault();
    var newEmail = document.getElementById("newEmailText").value;
    changeEmail(newEmail);
  })
}

if (changeUsernameButton){
  changeUsernameButton.addEventListener("click", function(x){
    console.log("username button clicked");
    x.preventDefault();
    var newUsername = document.getElementById("newUsernameText").value;
    changeUsername(newUsername);
  })
}



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

    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const usernameInput = document.getElementById("usernameInput").value;
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
    const emailInput = document.getElementById("emailInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    loginUser(emailInput, passwordInput, authType);
    console.log("Logging in user...")
  })
};

if(logoutButton){
  logoutButton.addEventListener("click",function(x){
    x.preventDefault();
    console.log("Logging out user...")
    logoutUser();
    window.location.href = "../../index.html";
  })
}
  
if (resetPasswordButton){
    resetPasswordButton.addEventListener("click", function(x){
      console.log("Reset button clicked")
      x.preventDefault();
      const emailInput = document.getElementById("emailInput").value;

      if (emailInput == ""){
        alert("Please input an Email")
      } else {
        forgotPassword(emailInput);
      }
    })
};




