 // Import the functions you need from the SDKs you need
 import { getAuth, initializeAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence, } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getDatabase, ref, child, set, update, remove, 
    get, orderByChild, orderByValue, query, limitToFirst,
    onValue, equalTo, } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"

//Reference the imports
const auth = getAuth();
const db = getDatabase();

//Reference 
var searchUserButton = document.getElementById("searchPlayerButton");
var playerDataCharts = document.getElementById("playerData");

//checks what is the currently loaded HTML page
var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);

//Function for inputing daily active users data
function inputActiveUsersData(data){
    const activeUsersChart = document.getElementById('activeUsersChart').getContext('2d');
    const activeChart = new Chart(activeUsersChart, {
        type: 'line',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Total Active Users',
                data: data,
                borderColor: "rgb(62, 139, 62)",
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

//Function for inputing avg player session time data
function inputAveragePlaySessionData(data){
    const playerSessionChart = document.getElementById('playerSessionChart').getContext('2d');
    const playerChart = new Chart(playerSessionChart, {
        type: 'line',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Average Play time in Minutes',
                data: data,
                borderColor: "rgb(62, 139, 62)",
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

function inputPlayerData(data, parameters){
    const searchPlayerChart = document.getElementById('playSessionChart').getContext('2d');
    const sessionChart = new Chart(searchPlayerChart, {
        type: 'line',
        data: {
            labels: parameters,
            datasets: [{
                label: 'Average Play time in Minutes',
                data: data,
                borderColor: "rgb(62, 139, 62)",
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
        }
    });
}

//function gets number od active users for each day
function getDailyActiveUsers(){

    let weeklyData = [0,0,0,0,0,0,0];
    const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //query to get the latest week for data
    const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1))

    //gets data for current week
    get(latestWeek).then((snapshot)=>{
        if(snapshot.exists()){
            var data = snapshot.val();
            var data = Object.values(data)[0];

            // iterates through object to check for that day's online player count
            var iteration = -1;
            for (const property in data) {
                iteration += 1;
                //checks if wasActive property exists, if it does, get the number and place it in respective
                // value in array
                if (data[property].wasActive != null){
                    const playerCount = data[property].wasActive.length;
                    for (let i=0; i<dates.length; i++){
                        if (property == dates[i]){
                            weeklyData[i] = playerCount;
                        }
                    }
                }
            }
            inputActiveUsersData(weeklyData);

        } else {
            console.log("error");
        }
    });
}

//function gets play session times and calculates an overall average
function getPlayerSessionAvg(){
    
    let weeklyAvg = [0,0,0,0,0,0,0];
    const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //query to get the latest week for data
    const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1));

    //gets data for current week
    get(latestWeek).then((snapshot)=>{
        if(snapshot.exists()){
            var data = snapshot.val();
            var data = Object.values(data)[0];
            console.log(data);

            //function iterates through obj to get total session time for that day before calculating avg
            let iteration = -1;
            for (const property in data){
                //calcualtes avg
                iteration += 1;
                if (data[property].wasActive == null){
                    var averageTime = 0;
                } else {
                    var averageTime = data[property].totalPlaySession/data[property].wasActive.length;
                }
                //finds correct day to input into array
                for (let x=0; x<dates.length; x++){
                    if (property == dates[x]){
                        weeklyAvg[x] = averageTime;
                    }
                }
            }
            console.log(weeklyAvg);
            inputAveragePlaySessionData(weeklyAvg);

        } else {
            console.log("error");
        }
    });

}

//this function gets current number of online players
function getCurrentOnlineUsers(){
    //query to get the latest week for data
    const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1))

    get(latestWeek).then((snapshot)=>{
        if(snapshot.exists()){
            const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var data = snapshot.val();
            var data = Object.values(data)[0];
            //get value of current day
            const d = new Date();
            var currentDay = d.getDay();
            
            var iteration = -1;
            for (const property in data) {
                iteration += 1;
                //checks if iterated day is the current day
                if (property == dates[currentDay]){
                    console.log("day found")
                    if (data[property].currentlyActive != null){
                        const onlineCount = data[property].currentlyActive.length;
                        //input into html
                        $("#noOfOnlineUsers").text(onlineCount);
                    } else {
                        const onlineCount = 0;
                        //input into html
                        $("#noOfOnlineUsers").text(onlineCount);
                    }
                }
            }
        }
    });
}

//function that checks if input user is currently online or not
function searchOnlineUser(userKey){
    //query to get the latest week for data
    const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1))

    get(latestWeek).then((snapshot)=>{
        if(snapshot.exists()){
            const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var data = snapshot.val();
            var data = Object.values(data)[0];
            //get value of current day
            const d = new Date();
            var currentDay = d.getDay();

            for (const property in data) {
                //checks if iterated day is the current day
                if (property == dates[currentDay]){
                    console.log("day found")
                    if (data[property].currentlyActive != null){
                        let array = data[property].currentlyActive;
                        console.log(array);
                        //iterate through currentlyActive array to check for user
                        for (var i=0; i<array.length; i++){
                            if (array[i] == userKey){
                                //user online
                                $("#searchCurrentStatus").text("Online");
                                $("#searchCurrentStatus").css("color", "rgb(62, 139, 62)");
                                return
                            } else {
                                //user offline
                                $("#searchCurrentStatus").text("Offline");
                                $("#searchCurrentStatus").css("color", "grey");
                            }
                        }
                    } 
                } else {
                    //user offline
                    $("#searchCurrentStatus").text("Offline");
                    $("#searchCurrentStatus").css("color", "grey");
                }
            }
        }
    });
}

function searchPlayer(input, emailTrue){
    var userKey = "";
    if (emailTrue){
        //search for email
        console.log(input);
        const searchQuery = query(ref(db, 'players'), orderByChild("email"), equalTo(input))
        get(searchQuery).then((snapshot)=>{
            if(snapshot.exists()){
                userKey = Object.keys(snapshot.val())[0];

                return getPlayerData(userKey);
            } else {
                alert("User not found!");
                console.log("failed");
            }
        })
    } else {
        //search for player username
        const searchQuery = query(ref(db, 'players'), orderByChild("username"), equalTo(input), limitToFirst(1))
        get(searchQuery).then((snapshot)=>{
            if(snapshot.exists()){
                userKey = Object.keys(snapshot.val())[0];
                console.log(userKey);
                return getPlayerData(userKey);
            } else {
                alert("User not found!");
                console.log("failed");
            }
        })
    }
}

function getPlayerData(userKey){
    console.log(userKey);
    var playerGameData = {};
    var playerProfileData = {};
    var playerSessionTime = {};

    searchOnlineUser(userKey);

    //gets player game data
    const dbref = ref(db);
    get(child(dbref, "playerGameData/" + userKey)).then((snapshot)=>{
        if(snapshot.exists()){
            playerGameData = snapshot.val();
            inputGameData(playerGameData);
        } else {
          console.log("Not found");
        }
    });
    //gets profile data
    get(child(dbref, "playerProfileData/" + userKey)).then((snapshot)=>{
        if(snapshot.exists()){
            playerProfileData = snapshot.val();
            inputProfileData(playerProfileData);
        } else {
          console.log("Not found");
        }
    });
    //gets player session data
    get(child(dbref, "playerSessionTime/" + userKey)).then((snapshot)=>{
        if(snapshot.exists()){
            playerSessionTime = snapshot.val();
            inputSessionData(playerSessionTime);
        } else {
          console.log("Not found");
        }
    });
    //gets player username
    get(child(dbref, "players/" + userKey)).then((snapshot)=>{
        if(snapshot.exists()){
            var username = snapshot.val().username;
            $("#searchUsername").text(username);
        } else {
          console.log("Not found");
        }
    });

    if (playerDataCharts.style.display === 'none'){
        playerDataCharts.style.display = "block";
    } else {
        playerDataCharts.style.display = "block";
    }
}

function inputGameData(data){
    //get references from html for data stored in this obj & input obj data
    $("#objectPickedText").text(data.totalObjPicked);
    $('#throwAccuracyText').text(data.minigameStats.accuracyPercentage);
    $('#throwAccuracyCSS').css("width", data.minigameStats.accuracyPercentage);
    $("#totalHitsText").text(data.minigameStats.totalHits);
    $("#longestRoundText").text(data.minigameStats.longestRoundMinutes);
    $("#throwStreakText").text(data.minigameStats.longestThrowStreak);
    $("#minigameHighscoreText").text(data.minigameStats.highscore);
}

function inputProfileData(data){
    var completionArray = ["0%", "25%", "50%", "75%", "100%"];
    $("#gameCompletionText").text(completionArray[data.completion]);
    $("#gameCompletionCSS").css("width", completionArray[data.completion]);
    $("#totalPlaytimeText").text(data.totalTimePlayed);
}

function inputSessionData(data){
    var sessionLength = [];
    var instanceName = [];
    //iterate through each obj and gets data from each
    for (let i=0; i<Object.keys(data).length + 1; i++){
        
        if (i < Object.keys(data).length){
            const timeSpend = Object.values(data)[i].timeSpendMin;
            const sessionName = Object.values(data)[i].dateOfSession + " , " + Object.values(data)[i].timeOfSession;
            sessionLength.push(timeSpend);
            instanceName.push(sessionName);
        } else {
            console.log(sessionLength);
            return inputPlayerData(sessionLength, instanceName);
        }
    }
}

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
}



const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1))
onValue(latestWeek, (snapshot) => {
    if(page == "adminHomepage.html"){
        getCurrentOnlineUsers();
    }
})

getCurrentOnlineUsers();

if(page == "adminHomepage.html"){
    getDailyActiveUsers();
 
    getPlayerSessionAvg();
}

if(searchUserButton){
    searchUserButton.addEventListener('click', function(x){
        x.preventDefault();
        const input = document.getElementById("playerSearch").value;
        if (validateEmail(input)){
            console.log("Email True");
            searchPlayer(input, true);
        } else{
            console.log("Email false");
            searchPlayer(input, false);
        };
    })
}
