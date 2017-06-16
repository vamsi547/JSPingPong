function BonusTimer(id, timerId, countdown, deps) {
	this.bonusTimer = document.getElementById(id);
	this.timer = this.bonusTimer.getElementById(timerId);
	this.countdown = countdown;
	this.eventEmitter = deps.eventEmitter;
	this.bonusType = deps.bonusType;
	this.setTimer();
}

/*
	Displays Bonus Timer Countdown
	- When Bonus start effect
*/

BonusTimer.prototype.setTimer = function() {
	this.bonusTimer.style.display = 'block';
	this.timer.textContent = this.countdown;
	var limit = this.countdown;
	this.timerInterval = setInterval(function() {
		this.timer.textContent = --limit;
		if(limit < 0) {			
			clearInterval(this.timerInterval);
			// Send Bonus type to do respective action to restore normal state
			this.eventEmitter.emit('bonus-time-out', { 'bonusType': this.bonusType});
		}		
	}.bind(this), 1000);
}


/*
	Removes Timer from Display 
	- When Bonus time is finished
	- When Game is Over
*/
BonusTimer.prototype.removeTimer = function() {
	clearInterval(this.timerInterval);
	this.timer.textContent = this.countdown;
	this.bonusTimer.style.display = 'none';
};