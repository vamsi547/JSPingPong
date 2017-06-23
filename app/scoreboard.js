function ScoreBoard(scoreId, levelId, deps) {
	this.scoreboard = document.getElementById(scoreId);	
	this.levelboard = document.getElementById(levelId);	
	this.eventEmitter = deps.eventEmitter;	
	this.initializeScoreBoard();
}

/*
	Initiates Score Board with Default values 
	- Setup of Leves Map with Increase in Score
*/
ScoreBoard.prototype.initializeScoreBoard = function() {
	this.score = 0;
	this.steps = 5;
	this.level = 1;
	this.levelToStepsMap = {
		1: 5,
		2: 10,
		3: 20,
		4: 50
	}
	this.updateScore(true);
	this.updateLevel(true);
}

/*
	Updates score based on the Level
*/
ScoreBoard.prototype.updateScore = function(initialize) {
	if(!initialize)		
		this.score += this.steps;
	if(this.score >= Math.pow(10, this.level))
		this.updateLevel();

	this.scoreboard.textContent = this.score;
}

/*
	Updates Level based on the Score
	- For every 10 Powers of Score Level Increases by 1
*/
ScoreBoard.prototype.updateLevel = function(initialize) {
	if(!initialize) 
		this.level++;
	this.steps = this.levelToStepsMap[this.level];
	this.levelboard.textContent = this.level;
	// Adding false to stop level up - temporarily
	if(false && !initialize)
		this.eventEmitter.emit('level-up');
}

/*
	Resets Score to Initial State
*/
ScoreBoard.prototype.reset = function() {
	this.initializeScoreBoard();
}