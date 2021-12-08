
//References for landing page buttons
var signupPageButton = document.getElementById("signupPageButton");
var loginPageButton = document.getElementById("loginPageButton");

//Listeners for button presses
if (signupPageButton){
    signupPageButton.addEventListener("click", function(x){
        x.preventDefault();
        window.location.href = "html/signup.html";
    })
}

if (loginPageButton){
    loginPageButton.addEventListener("click", function(x){
        x.preventDefault();
        window.location.href = "html/login.html";
    })
}