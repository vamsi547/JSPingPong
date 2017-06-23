function BonusBar(bonusBarId, container, deps, attrs) {
	this.bonusBar = document.getElementById(bonusBarId);
	this.rect = this.bonusBar.getElementsByTagName('rect')[0];
	this.container = container;
	this.barObj = deps.barObj;
	this.eventEmitter = deps.eventEmitter;
	this.attrs = attrs || {};
	this.setup();
	this.moveBonusBar();
}

/*
	Initiates Bonus Bar with Specified attributes and Defaults
*/
BonusBar.prototype.setup = function() {
	this.bonusBar.style.display = 'block';
	this.bonusBar.style.top = '0px';
	this.bonusBar.style.left = this.attrs.left + 'px' || '10px';
	this.bonusBarHeight = 20;
	this.bonusBarWidth = 10;
	this.stepsToMove = 1;
	this.frequency = 10;
	this.colors = ['red', 'blue', 'green', 'white'];
}

/*
	Bonus Bar moves with random colors of (R,G,B,W)
*/
BonusBar.prototype.moveBonusBar = function() {
	
	function animateBonusBar() {
		var currentTop = parseFloat(this.bonusBar.style.top);		
		var newTop = currentTop + this.stepsToMove;

		this.bonusBar.style.top = eval('' +  newTop) + 'px';
		this.rect.style.fill = this.colors[getRandomInteger(0, 3)];
		
		var barPosition = this.barObj.getBarPosition();
		var bonusBarPosition = this.bonusBar.getBoundingClientRect();

		var topCheck = bonusBarPosition.top + this.bonusBarHeight < barPosition.top;
		var leftCheck = bonusBarPosition.left + this.bonusBarWidth < barPosition.left;
		var rightCheck = ((bonusBarPosition.left + bonusBarPosition.right)/2 )> barPosition.right;
		
		if(!topCheck && !leftCheck && !rightCheck) {
			// Stop the Bonus Bar and effect the Bonus
			this.stopBonusMoveForwardInterval();
			this.eventEmitter.emit('bonus-effect', {});
			return;
		}

		// If Ball Hits the Ground  - Game Over
		if(currentTop + this.bonusBarHeight >= this.container.clientHeight && (leftCheck || rightCheck)) {
			this.stopBonusMoveForwardInterval();
			this.eventEmitter.emit('bonus-bar-miss');
			return;
		}
		this.moveForwardInterval = requestAnimationFrame(animateBonusBar.bind(this));
	};
	this.moveForwardInterval = requestAnimationFrame(animateBonusBar.bind(this));

}

/*
	Stops Movement of Bonus Bar
	- On Game over
	- On Bonus Miss/ Bonus Catch
*/
BonusBar.prototype.stopBonusMoveForwardInterval = function() {
	cancelAnimationFrame(this.moveForwardInterval)
}
