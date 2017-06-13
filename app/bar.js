function Bar(barID, container) {
	this.bar = document.getElementById(barID);
	this.container = container;
	this.setup();
}

Bar.prototype.setup = function() {

	var barOperator = '+';

	this.bar.style.left = '0';	
	this.stepsToMove = 40;
	this.barLength = 300;

	// key stroke codes
	this.leftArrowCode = 37;
	this.rightArrowCode = 39;

	// keydown event 
	this.keyDownEventListener();
}

Bar.prototype.getBarPosition = function() {
	return this.bar.getBoundingClientRect();
}

Bar.prototype.keyDownEventListener = function() {
	
	this.moveBar = function(evt) {

		var currentLeft = parseInt(this.bar.style.left);
		var diffSpace = 0;
		if(evt.keyCode !== this.leftArrowCode && evt.keyCode !== this.rightArrowCode) {
			return;
		} 
		else if(evt.keyCode === this.leftArrowCode) {
			if(currentLeft - this.stepsToMove <= 0) {
				// To Fit the end of the Container - Adds remaining space to its left
				diffSpace = currentLeft - this.stepsToMove;				
			}

			barOperator = '-';
		} 
		else {
			if(currentLeft + this.barLength + this.stepsToMove >= this.container.clientWidth) {
				// To Fit the end of the Container - Adds remaining space to its right
				diffSpace = currentLeft + this.barLength + this.stepsToMove - this.container.clientWidth;
			}
			barOperator = '+';		
		}

		var newBarLeft = currentLeft + barOperator + this.stepsToMove;

		this.bar.style.left = eval('' + newBarLeft)  - diffSpace;

	}.bind(this);

	document.addEventListener('keydown', this.moveBar);	
};

Bar.prototype.keyDownEventRemover = function() {
	document.removeEventListener('keydown', this.moveBar);
}

Bar.prototype.increaseSpeed = function() {
	this.stepsToMove += 10;
}

Bar.prototype.gameOver = function() {
	// Bar stops moving on key stroke
	this.keyDownEventRemover();
}

Bar.prototype.reset = function() {
	this.setup();	
}