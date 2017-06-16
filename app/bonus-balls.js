function BonusBalls(ballCount, interval, container, deps) {
	this.ballCount = ballCount;
	this.interval = interval;
	this.container = container;
	this.deps = deps
	this.ballObj = this.deps.ballObj;
	this.svgCreator = this.deps.svgCreator;
	this.setup();
}

BonusBalls.prototype.setup = function() {
	this.ballsList = [];
	var limit = this.ballCount;
	this.ballCreationInterval = setInterval(function() {
		var bonusBallId = this.svgCreator.cloneBall({}, 'svgBall');
		var bonusBallObj = new Ball(bonusBallId, 'audio', container,
					this.deps, {type: 'bonus'});
		this.ballsList.push({
			id: bonusBallId,
			obj: bonusBallObj
		});

		if(--limit === 0) {
			clearInterval(this.ballCreationInterval);
		}

	}.bind(this), this.interval);
}

BonusBalls.prototype.stopBonusBallsInterval = function() {
	clearInterval(this.ballCreationInterval);
	this.ballCreationInterval = null;
	this.ballsList.forEach(function(ball) {
		ball.obj.clearBounceInterval();
	});
}

BonusBalls.prototype.removeBonusBall = function(ballId) {
	var ballIndexToRemove = -1;
	this.ballsList.forEach(function(ball, index) {
		if(ball.id === ballId) {
			ballIndexToRemove = index;
			return;
		}
	});
	if(ballIndexToRemove !== -1) {
		// Remove that Ball from Balls List
		this.ballsList.splice(ballIndexToRemove, 1);
		// Remove that Ball from DOM
		document.getElementById(ballId).remove();		
	}
	
}

BonusBalls.prototype.removeAllBonusBalls = function() {
	this.ballsList.forEach(function(ball) {
		// Remove the Ball from DOM
		document.getElementById(ball.id).remove();		
	});

	this.ballsList = [];

	// Stop Interval if exists any
	this.stopBonusBallsInterval();

}