/* Event to Handle when level increases
   - Creates extra Ball for each level up with variant speeds and variant sizes
   - Increase Bar Speed for Every level Increase
   - Storing all Balls with their Ids and Objects
*/
eventEmitter.on('level-up', function() {	

	var ballAttrs = balls[getRandomInteger(0, balls.length - 1)];
	var ballId = svgCreator.cloneBall(ballAttrs, 'svgBall');
	var newBallObj = new Ball(ballId, 'audio', container, 
					{
						'barObj': barObj, 
						'bricks': bricks,
						'scoreObj': scoreObj, 
						'eventEmitter': eventEmitter
					}, ballAttrs);
	
	barObj.increaseSpeed();
	
	ballsList.push({ id: ballId, obj: newBallObj });
});

/* Event to handle when game ends
	- Set isGameOver state as true
	- Stop the Balls	
	- Stop the Bar
	- Stop the Bonus Bar
	- Stop the Bonus Balls
	- Display New Game Button
	- Blur the page - TODO
*/
eventEmitter.on('game-over', gameOver);

/* Bonus Time out 
   - Restart Bonus Bar 
*/

eventEmitter.on('bonus-time-out', function(args) {
	timerObject.removeTimer();
	if(isGameOver)
		return;
	if(args && args.bonusType && (args.bonusType === 'half-bar' || args.bonusType === 'double-bar')) {
		barObj.restoreBar();
	}
	if(args && args.bonusType && args.bonusType === 'multiple-balls') {
		bonusBallObj.removeAllBonusBalls();
		bonusBallObj = null;
	}
	initBonusBar();
});

// Bonus Effect 

eventEmitter.on('bonus-effect', function() {
	// Get Random Bonus from Config
	var bonusType = bonusTypes[getRandomInteger(0, bonusTypes.length - 1)];

	switch(bonusType) {
		case 'half-bar': 
			// Half the Bar Length
			barObj.halfBar();
			break;
		case 'double-bar':
			// Double the Bar Length
			barObj.doubleBar();
			break;
		case 'multiple-balls':
			// Generate Multiple Bonus balls till the time out 
			// Balls - 5 , Interval to generate Balls - 3 sec
			bonusBallObj = new BonusBalls(5, 3000, container, 
					{
						'barObj': barObj, 
						'scoreObj': scoreObj, 
						'bricks': bricks,
						'eventEmitter': eventEmitter,
						'svgCreator': svgCreator
					});
			break;
	}

	timerObject = new BonusTimer('svgBonusTimer', 'timer-text', bonusLength, { 'eventEmitter': eventEmitter, 'bonusType': bonusType });

	// Remove Bonus bar from DOM
	removeBonusBar()

});

/* Bonus Ball Miss
   - Remove Bonus Ball that missed the Bar		
*/
eventEmitter.on('bonus-ball-miss', function(args) {
	var ballID = args.ballID;
	if(!bonusBallObj || !ballID)
		return;	
	bonusBallObj.removeBonusBall(ballID);
});

/* Bonus Bar Miss
   - Remove Bonus bar from DOM
   - Initialise Bonus Bar
*/
eventEmitter.on('bonus-bar-miss', function() {
	
	removeBonusBar();
	
	initBonusBar();
});

/* Event to create New Game ( On click of New Game )
   - Set isGameOver state as false
   - Hide New Game Button	
   - Reset Score board and levels
   - Remove all the Balls and retain only primary ball
   - Updates ballslist with primary ball
   - Reset Ball - Only first ball as Initial state is One Ball
   - Remove Bonus Balls if any
   - Reset Bar
   - Reset Bricks to Level 1 State
   - Restart Bonus Bar
*/
newGame.addEventListener('click', startNewGame);

/*
	Keyboard Shortucts
	- Space bar => New Game
	- ESC Key   => Stop Game
*/
document.addEventListener('keydown', function(evt) {
	if(evt.keyCode === 32 && isGameOver) {
		startNewGame();
	}
	if(evt.keyCode === 27 && !isGameOver) {
		gameOver();
	}
})
