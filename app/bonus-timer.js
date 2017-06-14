function BonusTimer(id, timerId, countdown, deps) {
	this.bonusTimer = document.getElementById(id);
	this.timer = this.bonusTimer.getElementById(timerId);
	this.countdown = countdown;
	this.eventEmitter = deps.eventEmitter;
	this.setTimer();
}

BonusTimer.prototype.setTimer = function() {
	this.bonusTimer.style.display = 'block';
	this.timer.textContent = this.countdown;
	var limit = this.countdown;
	this.timerInterval = setInterval(function() {
		this.timer.textContent = --limit;
		if(limit < 0) {			
			clearInterval(this.timerInterval);
			this.eventEmitter.emit('bonus-time-out');
		}		
	}.bind(this), 1000);
}

BonusTimer.prototype.removeTimer = function() {
	this.timer.textContent = this.countdown;
	this.bonusTimer.style.display = 'none';
};