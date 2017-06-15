var container 	 = document.getElementById('container');
var newGame 	 = document.getElementById('newgame')
var eventEmitter = new EventEmitter();

var barObj 		 = new Bar('svgBar', container);
var scoreObj 	 = new ScoreBoard('score', 'level', {'eventEmitter': eventEmitter});
var ballObj 	 = new Ball('svgBall', 'audio', container, 
					{
						'barObj': barObj, 
						'scoreObj': scoreObj, 
						'eventEmitter': eventEmitter
					});

var ballsList 	 = [{ id: 'svgBall', obj: ballObj }];
var svgCreator   = new SVGCreator(container);

var timerObject   = null;
var bonusBarId    = null;
var bonusBarObj	  = null;
var bonusInterval = null;

var bonusLength	      = 5;
var showBonusInterval = bonusLength * 3;

var isGameOver = false;

initBonusBar();

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initBonusBar() {
	clearTimeout(bonusInterval);
	bonusInterval = setTimeout(function() {
		if(isGameOver)
			return;
		bonusBarId = svgCreator.cloneBonusBar('svgBonusBar');
		bonusBarObj = new BonusBar(bonusBarId, container, { 'barObj': barObj, 'eventEmitter': eventEmitter });		
	}, 1000 * showBonusInterval);
}

function removeBonusBar() {
	// Remove Bonus bar from DOM
	document.getElementById(bonusBarId).remove();
	bonusBarId = null;
	// Remove Bonus bar Object
	bonusBarObj = null;
}

/*
	Remove Timer
	Stop Bonus Movement Interval
	Remove Bonus Bar from DOM
	Stop Bonus Bar Selection Interval
*/
function stopBonusBarOnGameOver() {
	if(timerObject)
		timerObject.removeTimer();
	if(bonusBarObj) {	
		bonusBarObj.stopBonusMoveForwardInterval();
		removeBonusBar();		
	}	
	clearTimeout(bonusInterval);
}

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
						'scoreObj': scoreObj, 
						'eventEmitter': eventEmitter
					}, ballAttrs);
	
	barObj.increaseSpeed();
	
	ballsList.push({ id: ballId, obj: newBallObj });
});

/* Event to Handle when level increases
   - Increase Ball Speed for Every level Increase
*/
eventEmitter.on('level-up-1', function() {
	ballsList[0].obj.increaseSpeed();
	barObj.increaseSpeed();
});

/* Event to handle when game ends
	- Set isGameOver state as true
	- Stop the Balls	
	- Stop the Bar
	- Stop the Bonus Bar
	- Display New Game Button
	- Blur the page - TODO
*/
eventEmitter.on('game-over', function() {
	
	isGameOver = true;

	ballsList.forEach(function(ball) {
		ball.obj.gameOver();
	});
	
	barObj.gameOver();

	stopBonusBarOnGameOver();
	
	newGame.style.display = 'block';	
});

/* Bonus Time out 
   - Restart Bonus Bar 
*/

eventEmitter.on('bonus-time-out', function(args) {
	timerObject.removeTimer();
	if(args && args.bonusType && (args.bonusType === 'half-bar' || args.bonusType === 'double-bar')) {
		barObj.restoreBar();
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
	}

	timerObject = new BonusTimer('svgBonusTimer', 'timer-text', bonusLength, { 'eventEmitter': eventEmitter, 'bonusType': bonusType });

	// Remove Bonus bar from DOM
	removeBonusBar()

});

// Bonus Bar Miss

eventEmitter.on('bonus-bar-miss', function() {
	// Remove Bonus bar from DOM
	removeBonusBar();
	// Initialise Bonus Bar
	initBonusBar();
});

/* Event to create New Game
   - Set isGameOver state as false
   - Hide New Game Button	
   - Reset Score board and levels
   - Remove all the Balls and retain only primary ball
   - Updates ballslist with primary ball
   - Reset Ball - Only first ball as Initial state is One Ball
   - Reset Bar
   - Restart Bonus Bar
*/
newGame.addEventListener('click', function() {
	
	isGameOver = false; 

	newGame.style.display = 'none';
	
	scoreObj.reset();
	
	ballsList.splice(1).forEach(function(ball) {
		var ballElement = document.getElementById(ball.id);
		ballElement.remove();
	});
	
	ballsList = ballsList.splice(0, 1);
	
	ballsList[0].obj.reset();
	
	barObj.reset();

	initBonusBar();
});
