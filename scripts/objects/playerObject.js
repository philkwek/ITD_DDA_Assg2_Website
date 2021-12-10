//Object script for player data 

function Player(email, username, userID){
    this.email = email;
    this.username = username;
    this.userID = userID;
}

function PlayerSessionTime(titleTimeSession, timeSpend, dateOfSession, timeOfSession) {
    this.titleTimeSession = titleTimeSession;
    this.timeSpend = timeSpend;
    this.dateOfSession = dateOfSession;
    this.timeOfSession = timeOfSession;
}

function PlayerProfileData(totalTimePlayed, noOfTaskCompleted, noOfMinigamesCompleted) {
    this.totalTimePlayed = totalTimePlayed;
    this.noOfTaskCompleted = noOfTaskCompleted;
    this.noOfMinigamesCompleted = noOfMinigamesCompleted;
}

function PlayerGameData(totalObjPicked, noOfCraftsMade, minigameStats) {
    this.totalObjPicked = totalObjPicked;
    this.noOfCraftsMade = noOfCraftsMade;
    this.minigameStats = minigameStats;
}

function MinigameStats(totalThrows, totalHits, totalMiss, accuracyPercentage, longestRoundMinutes, longestThrowStreak) {
    this.totalThrows = totalThrows;
    this.totalHits  = totalHits;
    this.totalMiss = totalMiss;
    this.accuracyPercentage = accuracyPercentage;
    this.longestRoundMinutes = longestRoundMinutes;
    this.longestThrowStreak = longestThrowStreak;
}