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

//Function for inputing daily active users data
function inputActiveUsersData(data){
    const activeUsersChart = document.getElementById('activeUsersChart').getContext('2d');
    const myChart = new Chart(activeUsersChart, {
        type: 'bar',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [{
                label: 'Total Active Users',
                data: [12, 19, 3, 5, 2, 3, 5],
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
    //figure out a way to accurately get week number of the year

    console.log(weekNumber);

    var weeklyData = {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0
    }

    const dbref = ref(db);

    //appends to weeklyData object for today's data
    get(child(dbref, "weeklyActive/" + weekNumber)).then((snapshot)=>{
        if(snapshot.exists()){
            var sundayValue = snapshot.Sunday.wasActive.numChildren();
            var mondayValue = snapshot.Monday.wasActive.numChildren();
            var tuesdayValue = snapshot.Monday.wasActive.numChildren();
            var wednesdayValue = snapshot.Monday.wasActive.numChildren();
            var thursdayValue = snapshot.Monday.wasActive.numChildren();
            var fridayValue = snapshot.Monday.wasActive.numChildren();
            var saturdayValue = snapshot.Monday.wasActive.numChildren();

            console.log(wednesdayValue);
        } else {
            console.log("error");
        }
    });

}

//this function gets current number of online players
function getCurrentOnlineUsers(){

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    const day = weekday[d.getDay()];

    get(child(dbref, "weeklyActive/" + weekNumber + "/" + day + "/currentlyActive")).then((snapshot)=>{
        if(snapshot.exists()){
            console.log(snapshot.numChildren() + " Total currently online players");
            //Insert data into html
        }
    });
}

getDailyActiveUsers();