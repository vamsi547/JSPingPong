function Ball(ballID, audioID, container, deps, attrs) {
	this.ball = document.getElementById(ballID);
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
	this.stepsToMove = this.attrs.steps || 1; // Float type
	this.frequency = this.attrs.frequency || 1;
	this.bounceInterval = null;
}

Ball.prototype.increaseSpeed = function() {
	this.stepsToMove++;
}

Ball.prototype.moveBall = function() {
	var leftOperator = '+';
	var topOperator = '+';
	var upwards = false;
	
	this.bounceInterval = setInterval(function() {
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

		var barPosition = this.barObj.getBarPosition();
		var ballPosition = this.ball.getBoundingClientRect();

		var topCheck = ballPosition.top + this.ballHeight < barPosition.top;
		var leftCheck = ballPosition.left + this.ballWidth < barPosition.left;
		var rightCheck = ((ballPosition.left + ballPosition.right)/2 )> barPosition.right;
		
		if(!topCheck && !leftCheck && !rightCheck && !upwards) {
			// Hit the bar 
			// Reverse the direction, Increase Score
			this.audio.play();
			this.scoreObj.updateScore();
			upwards = true;
			return;
		}

		// If Ball Hits the Ground  - Game Over
		if(currentTop + this.ballHeight >= this.container.clientHeight && (leftCheck || rightCheck) && !upwards) {
			this.eventEmitter.emit('game-over');			
			return;
		}

	}.bind(this), this.frequency);

}

Ball.prototype.gameOver = function() {
	this.clearBounceInterval(this.bounceInterval);
}

Ball.prototype.clearBounceInterval = function(interval) {
	clearInterval(interval);
}

Ball.prototype.reset = function() {
	this.setup();
	this.moveBall();	
}