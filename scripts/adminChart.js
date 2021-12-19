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
    get, orderByChild, orderByValue, query, limitToFirst } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"

//Reference the izmports
const auth = getAuth();
const db = getDatabase();

//Function for inputing daily active users data
function inputActiveUsersData(data){
    const activeUsersChart = document.getElementById('activeUsersChart').getContext('2d');
    const myChart = new Chart(activeUsersChart, {
        type: 'bar',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Total Active Users',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(235, 52, 213, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(235, 52, 213, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getDailyActiveUsers(){

    var weeklyData = [0,0,0,0,0,0,0];

    //query to get the latest week for data
    const latestWeek = query(ref(db, 'weeklyActive'), orderByValue("weekNumber"), limitToFirst(1))

    //gets data for current week
    get(latestWeek).then((snapshot)=>{
        if(snapshot.exists()){
            var data = snapshot.val();
            var data = Object.values(data)[0];
            console.log(data);
            const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            console.log(data)

            // iterates through object to check for that day's online player count
            var iteration = -1;
            for (const property in data) {
                iteration += 1;
                console.log(iteration);
                console.log(property);
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
            console.log(weeklyData);
            inputActiveUsersData(weeklyData);

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
            console.log(data);

            //get value of current day
            const d = new Date();
            var currentDay = d.getDay();
            
            var iteration = -1;
            for (const property in data) {
                iteration += 1;
                //checks if iterated day is the current day
                if (property == dates[currentDay]){
                    console.log("day found")
                    if (data[property].currentActive != null){
                        const onlineCount = data[property].currentActive;
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

getDailyActiveUsers();
getCurrentOnlineUsers();