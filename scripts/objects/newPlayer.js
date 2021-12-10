//Object script for player data 

function Player(email, username, userID){
    this.email = email;
    this.username = username;
    this.userID;

    this.createNewPlayer = function(){
        return data[this.email, this.username, this.userID]
    }
}

function PlayerSessionTime(titleTimeSession, timeSpend, dateOfSession, timeOfSession) {
    this.titleTimeSession = titleTimeSession;
    this.timeSpend = timeSpend;
    this.dateOfSession = dateOfSession;
    this.timeOfSession = timeOfSession;

    this.createNewPlayerSessionTime = function(){
        return data[this.titleTimeSession, this.timeSpend, this.dateOfSession, this.timeOfSession]
    }
}

function PlayerProfileData(totalTimePlayed, noOfTaskCompleted, noOfMinigamesCompleted) {
    this.totalTimePlayed = totalTimePlayed;
    this.noOfTaskCompleted = noOfTaskCompleted;
    this.noOfMinigamesCompleted = noOfMinigamesCompleted;

    this.createNewPlayerProfileData = function(){
        return data[this.totalTimePlayed, this.noOfTaskCompleted, this.noOfMinigamesCompleted]
    }
}

function PlayerGameData(totalObjPicked, noOfCraftsMade, minigameStats) {
    this.totalObjPicked = totalObjPicked;
    this.noOfCraftsMade = noOfCraftsMade;
    this.minigameStats = minigameStats;

    this.createNewPlayerGameData = function(){
        return data[this.totalObjPicked, this.noOfCraftsMade, this.minigameStats]
    }
}

function MinigameStats(totalThrows, totalHits, totalMiss, accuracyPercentage, longestRoundMinutes, longestThrowStreak) {
    this.totalThrows = totalThrows;
    this.totalHits  = totalHits;
    this.totalMiss = totalMiss;
    this.accuracyPercentage = accuracyPercentage;
    this.longestRoundMinutes = longestRoundMinutes;
    this.longestThrowStreak = longestThrowStreak;

    this.createNewMinigameStats = function(){
        return data[this.totalThrows, this.totalHits, this.totalMiss, this.accuracyPercentage, 
        this.longestRoundMinutes, this.longestThrowStreak]
    }
}