function BonusBar(bonusBarId, container, deps) {
	debugger;
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
	this.stepsToMove = 1;
	this.frequency = 1000;
	this.colors = ['red', 'blue', 'green', 'white']
}

BonusBar.prototype.moveBonusBar = function() {
	this.moveForwardInterval = setInterval(function() {
		var currentTop = parseFloat(this.bonusBar.style.top);
		if(currentTop >= this.container.clientHeight) {
			return;
		}
		this.bonusBar.style.top = eval('' + currentTop + this.stepsToMove );
		this.rect.style.fill = this.colors[getRandomInteger(0, 3)];
	}.bind(this), this.frequency);
}
