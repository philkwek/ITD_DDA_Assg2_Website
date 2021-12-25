//Object script for player data 

function Player(email, username, userID){
    this.email = email;
    this.username = username;
    this.userID = userID;
    this.admin = false;
}

function PlayerSessionTime(titleTimeSession, timeSpend, dateOfSession, timeOfSession) {
    this.titleTimeSession = titleTimeSession;
    this.timeSpend = timeSpend;
    this.dateOfSession = dateOfSession;
    this.timeOfSession = timeOfSession;
}

function PlayerProfileData(totalTimePlayed, noOfTaskCompleted, noOfMinigamesCompleted, completion, username, minigameHighscore) {
    this.totalTimePlayed = totalTimePlayed;
    this.noOfTaskCompleted = noOfTaskCompleted;
    this.noOfMinigamesCompleted = noOfMinigamesCompleted;
    this.completion = completion;
    this.username = username;
    this.minigameHighscore = minigameHighscore;

}

function PlayerGameData(totalObjPicked, noOfCraftsMade, minigameStats, username) {
    this.totalObjPicked = totalObjPicked;
    this.noOfCraftsMade = noOfCraftsMade;
    this.minigameStats = minigameStats;
    this.username = username;
}

function MinigameStats(highscore, totalThrows, totalHits, totalMiss, 
    accuracyPercentage, longestRoundMinutes, longestThrowStreak) {
    this.highscore = highscore;
    this.totalThrows = totalThrows;
    this.totalHits  = totalHits;
    this.totalMiss = totalMiss;
    this.accuracyPercentage = accuracyPercentage;
    this.longestRoundMinutes = longestRoundMinutes;
    this.longestThrowStreak = longestThrowStreak;
}