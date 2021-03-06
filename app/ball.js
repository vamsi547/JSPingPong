function Ball(ballID, audioID, container, deps, attrs) {
	this.ball = document.getElementById(ballID);
	this.circle = this.ball.getElementsByTagName('circle')[0];
	this.audio = document.getElementById(audioID);
	this.container = container;
	this.barObj = deps.barObj;
	this.scoreObj = deps.scoreObj;	
	this.eventEmitter = deps.eventEmitter;
	this.attrs = attrs || {};
	this.setup();
	this.moveBall();
}

Ball.prototype.setup = function() {
	this.ball.style.position = "absolute";
	this.ball.style.left = this.attrs.left || '0';
	this.ball.style.top = this.attrs.right || '0';
	this.glitchHeight = 0;
	this.ballHeight = this.attrs.height || 50;
	this.ballWidth = this.attrs.width || 50;
	this.stepsToMove = this.attrs.steps || 4; // Float type
	this.frequency = this.attrs.frequency || 1;
	this.type = this.attrs.type || 'normal';
	this.colors = this.attrs.colors || ['red', 'blue', 'green'];
	this.bounceInterval = null;
}

Ball.prototype.increaseSpeed = function() {
	this.stepsToMove++;
}

Ball.prototype.moveBall = function() {
	var leftOperator = '+';
	var topOperator = '+';
	var upwards = false;
	
	function ballAnimate() {
		var currentLeft = parseFloat(this.ball.style.left);
		var currentTop = parseFloat(this.ball.style.top);
		var diffSpaceLR = 0;
		var diffSpaceTB = 0;
		// Towards extreme right - Turn left		
		if(currentLeft + this.ballWidth === this.container.clientWidth) {			
		 	leftOperator = '-';
		}
		// Towards extreme left - Turn right
		if(currentLeft === 0) {
	 		leftOperator = '+';
		}
		// To Fit the end of the Container - Adds remaining space to its right
		if(leftOperator === '+' && currentLeft + this.ballWidth + this.stepsToMove > this.container.clientWidth) {			
			diffSpaceLR = currentLeft + this.ballWidth + this.stepsToMove - this.container.clientWidth;
		}
		// To Fit the end of the Container - Adds remaining space to its left
		if(leftOperator === '-' && currentLeft - this.stepsToMove < 0 ) {
			diffSpaceLR = currentLeft - this.stepsToMove;
		}

		// Go Up
	 	if(upwards) {	 		
	 		topOperator = '-';
	 	}
	 	// Towards extreme Top - Turn down
	 	if(currentTop === 0) {
	 		upwards = false;
	 		topOperator = '+';
	 	}
	 	// To Fit the end of the Container - Adds remaining space to its top
		if(topOperator === '+' && currentTop + this.ballHeight + this.stepsToMove > this.container.clientHeight) {
			diffSpaceTB = currentTop + this.ballHeight + this.stepsToMove - this.container.clientHeight;
		}
		// To Fit the end of the Container - Adds remaining space to its bottom
		if(topOperator === '-' && currentTop - this.stepsToMove < 0 ) {
			diffSpaceTB = currentTop - this.stepsToMove;
		}

		var newLeft = '' + currentLeft + leftOperator + this.stepsToMove;
		var newTop = '' + currentTop + topOperator + this.stepsToMove;

		this.ball.style.left = '' + eval(newLeft) - diffSpaceLR;
		this.ball.style.top = '' + eval(newTop) - diffSpaceTB;

		// Update colors if Ball is Bonus type
		if(this.type === 'bonus')
			this.circle.style.fill = this.colors[getRandomInteger(0, 3)];


		var barPosition = this.barObj.getBarPosition();
		var ballPosition = this.ball.getBoundingClientRect();

		var topCheck = ballPosition.top + this.ballHeight < barPosition.top;
		var leftCheck = ballPosition.left + this.ballWidth < barPosition.left;
		var rightCheck = ((ballPosition.left + ballPosition.right)/2 )> barPosition.right;
		
		if(!topCheck && !leftCheck && !rightCheck && !upwards) {
			// Hit the bar 
			// Reverse the direction, Increase Score
			leftOperator = changeDirection(barPosition, ballPosition, leftOperator);
			this.audio.play();
			this.scoreObj.updateScore();
			upwards = true;
			this.bounceInterval = requestAnimationFrame(ballAnimate.bind(this));
			return;
		}

		// If Ball Hits the Ground  - Game Over
		if(currentTop + this.ballHeight >= this.container.clientHeight && (leftCheck || rightCheck) && !upwards) {
			if(this.type === 'bonus') {
				this.eventEmitter.emit('bonus-ball-miss', {ballID: this.ball.id});
			} else {
				this.eventEmitter.emit('game-over');
			}
			return;
		}

		this.bounceInterval = requestAnimationFrame(ballAnimate.bind(this));
	};

	this.bounceInterval = requestAnimationFrame(ballAnimate.bind(this))

}

var changeDirection = function(barPosition, ballPosition, leftOperator) {
	var barMid = (barPosition.left + barPosition.right) / 2;
	var ballMid = (ballPosition.left + ballPosition.right) / 2;
	if(ballMid < (barPosition.left + (barMid-barPosition.left)/4)) {
		// Go left
		return '-';
	} else if(ballMid > (barMid + (barPosition.right-barMid)/4)) {
		// Go Right
		return '+';
	} else {
		// Go Opposite direction
		return leftOperator;
	}
}

Ball.prototype.gameOver = function() {
	this.clearBounceInterval(this.bounceInterval);
}

Ball.prototype.clearBounceInterval = function(interval) {
	cancelAnimationFrame(interval || this.bounceInterval);
}

Ball.prototype.reset = function() {
	this.setup();
	this.moveBall();	
}