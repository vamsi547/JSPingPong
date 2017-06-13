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
					}, balls[0]);

var ballsList 	 = [{ id: 'svgBall', obj: ballObj }];
var ballCreator  = new BallCreator(container);

// Event to Handle when level increases
eventEmitter.on('level-up', function() {
	// Creates extra Ball for each level up with variant speeds and variant sizes
	var ballId = ballCreator.cloneBall({}, 'svgBall');
	var newBallObj = new Ball(ballId, 'audio', container, 
					{
						'barObj': barObj, 
						'scoreObj': scoreObj, 
						'eventEmitter': eventEmitter
					}, balls[1]);
	// Increase Bar Speed for Every level Increase
	barObj.increaseSpeed();
	// Storing all Balls with their Ids and Objects
	ballsList.push({ id: ballId, obj: newBallObj });
});

// Event to Handle when level increases
eventEmitter.on('level-up-1', function() {
	// Increase Ball Speed for Every level Increase
	ballsList[0].obj.increaseSpeed();
	barObj.increaseSpeed();
});

// Event to handle when game ends
eventEmitter.on('game-over', function() {
	// Stop the Balls	
	ballsList.forEach(function(ball) {
		ball.obj.gameOver();
	});
	// Stop the Bar
	barObj.gameOver();
	// Display New Game Button
	newGame.style.display = 'block';
	// Blur the page - TODO
});

// Event to create New Game
newGame.addEventListener('click', function() {
	// Hide New Game Button
	newGame.style.display = 'none';
	// Reset Score board and levels
	scoreObj.reset();
	// remove all the Balls and retain only primary ball
	ballsList.splice(1).forEach(function(ball) {
		var ballElement = document.getElementById(ball.id);
		ballElement.remove();
	})
	// Updates ballslist with primary ball
	ballsList = ballsList.splice(0, 1);
	// Reset Ball - Only first ball as Initial state is One Ball
	ballsList[0].obj.reset();
	// Reset Bar
	barObj.reset();
});