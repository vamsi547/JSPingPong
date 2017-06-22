var container 	  = document.getElementById('container');
var newGame 	  = document.getElementById('newgame')
var eventEmitter  = new EventEmitter();

var barObj 		  = new Bar('svgBar', container);
var svgCreator    = new SVGCreator(container);
var bricks        = new Bricks('svgBrick', container, { 'svgCreator': svgCreator, 'eventEmitter': eventEmitter });
var scoreObj 	  = new ScoreBoard('score', 'level', {'eventEmitter': eventEmitter});
var ballObj 	  = new Ball('svgBall', 'audio', container, 
					{
						'barObj': barObj, 
						'bricks': bricks,
						'scoreObj': scoreObj, 
						'eventEmitter': eventEmitter
					});

var ballsList 	  = [{ id: 'svgBall', obj: ballObj }];

var timerObject   = null;
var bonusBarId    = null;
var bonusBarObj	  = null;
var bonusBallObj  = null;
var bonusInterval = null;

var bonusLength	      = 20;
var showBonusInterval = 5;

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
		var bonusBarLeft = bonusBarPosition[getRandomInteger(0, bonusBarPosition.length - 1)];
		bonusBarObj = new BonusBar(bonusBarId, container, { 'barObj': barObj, 'eventEmitter': eventEmitter }, { 'left': bonusBarLeft});		
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

/*
	Stop Bonus Ball Movement Interval

*/
function stopBonusBallsOnGameOver() {
	if(!bonusBallObj)
		return;
	bonusBallObj.stopBonusBallsInterval();
}

function startNewGame() {
	
	isGameOver = false; 

	newGame.style.display = 'none';
	
	scoreObj.reset();
	
	ballsList.splice(1).forEach(function(ball) {
		var ballElement = document.getElementById(ball.id);
		ballElement.remove();
	});
	
	ballsList = ballsList.splice(0, 1);
	
	ballsList[0].obj.reset();

	if(bonusBallObj) {
		bonusBallObj.removeAllBonusBalls();
	}
	
	barObj.reset();

	initBonusBar();
}

function gameOver() {

	isGameOver = true;

	ballsList.forEach(function(ball) {
		ball.obj.gameOver();
	});
	
	barObj.gameOver();

	stopBonusBarOnGameOver();

	stopBonusBallsOnGameOver();
	
	newGame.style.display = 'block';	
}