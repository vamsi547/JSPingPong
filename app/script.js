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
var timerObject = null;

var ballsList 	 = [{ id: 'svgBall', obj: ballObj }];
var svgCreator  = new SVGCreator(container);

// initBonusBar();

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Event to Handle when level increases
   - Creates extra Ball for each level up with variant speeds and variant sizes
   - Increase Bar Speed for Every level Increase
   - Storing all Balls with their Ids and Objects
*/
eventEmitter.on('level-up', function() {	

	var ballAttrs = balls[getRandomInteger(0, 2)];
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
	- Stop the Balls	
	- Stop the Bar
	- Display New Game Button
	- Blur the page - TODO
*/
eventEmitter.on('game-over', function() {
	
	ballsList.forEach(function(ball) {
		ball.obj.gameOver();
	});
	
	barObj.gameOver();
	
	newGame.style.display = 'block';	
});

// Bonus Time out 

eventEmitter.on('bonus-time-out', function() {
	timerObject.removeTimer();
});

/* Event to create New Game
   - Hide New Game Button	
   - Reset Score board and levels
   - Remove all the Balls and retain only primary ball
   - Updates ballslist with primary ball
   - Reset Ball - Only first ball as Initial state is One Ball
   - Reset Bar
*/
newGame.addEventListener('click', function() {
	
	newGame.style.display = 'none';
	
	scoreObj.reset();
	
	ballsList.splice(1).forEach(function(ball) {
		var ballElement = document.getElementById(ball.id);
		ballElement.remove();
	});
	
	ballsList = ballsList.splice(0, 1);
	
	ballsList[0].obj.reset();
	
	barObj.reset();
});

function initBonusBar() {
	var bonusBarId = svgCreator.cloneBonusBar('svgBonusBar');
	new BonusBar(bonusBarId, container, { 'barObj': barObj, 'eventEmitter': eventEmitter })
	timerObject = new BonusTimer('svgBonusTimer', 'timer-text', 5, { 'eventEmitter': eventEmitter });
}