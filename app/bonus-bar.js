function BonusBar(bonusBarId, container, deps) {
	this.bonusBar = document.getElementById(bonusBarId);
	this.rect = this.bonusBar.getElementsByTagName('rect')[0];
	this.container = container;
	this.barObj = deps.barObj;
	this.eventEmitter = deps.eventEmitter;
	this.setup();
	this.moveBonusBar();
}

BonusBar.prototype.setup = function() {
	// Initialize Bonus Bar
	this.bonusBar.style.display = 'block';
	this.bonusBar.style.top = '0';
	this.bonusBarHeight = 20;
	this.stepsToMove = 0.8;
	this.frequency = 10;
	this.colors = ['red', 'blue', 'green', 'white']
}

BonusBar.prototype.moveBonusBar = function() {
	this.moveForwardInterval = setInterval(function() {
		var currentTop = parseFloat(this.bonusBar.style.top);
		if(currentTop + this.bonusBarHeight >= this.container.clientHeight) {
			return;
		}
		var newTop = currentTop + this.stepsToMove;
		this.bonusBar.style.top = eval('' +  newTop);
		this.rect.style.fill = this.colors[getRandomInteger(0, 3)];
	}.bind(this), this.frequency);
}
