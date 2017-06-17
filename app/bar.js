function Bar(barID, container) {
	this.bar = document.getElementById(barID);
	this.rect = this.bar.getElementsByTagName('rect')[0];
	this.container = container;
	this.setup();
}

Bar.prototype.setup = function() {

	var barOperator = '+';

	this.bar.style.left = '0';	
	this.stepsToMove = 40;
	this.defaultBarLength = 300;
	this.barLength = this.defaultBarLength;
	//Update Bar length if Previous game has diff length
	this.updateBarLength();
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

Bar.prototype.updateBarLength = function(length) {
	if(length)
		this.barLength = length;
	this.bar.style.width = this.barLength;
	this.rect.style.width = this.barLength;
	this.adjustBarPosition();
}

/*
	Case : Bar at extreme right and Catches Bonus point that doubles the size
	Result : Bar extends beyond container as it doubles
	Solution: Adjust Bar's left such that it fits to the container at its right end
*/
Bar.prototype.adjustBarPosition = function() {
	var currentLeft = this.bar.style.left;
	var containerWidth = this.container.clientWidth;
	var barOverflow = currentLeft + this.barLength - containerWidth;
	// Check currentleft > baroverflow  needed in lower resolutions
	if(barOverflow > 0 && currentLeft > barOverflow) {
		this.bar.style.left = currentLeft - (barOverflow);
	}
}

Bar.prototype.doubleBar = function() {
	this.barLength *= 2;
	this.updateBarLength();
}

Bar.prototype.halfBar = function() {
	this.barLength /= 2;	
	this.updateBarLength();
}

Bar.prototype.restoreBar = function() {
	this.updateBarLength(this.defaultBarLength	);
}

Bar.prototype.gameOver = function() {
	// Bar stops moving on key stroke
	this.keyDownEventRemover();
}

Bar.prototype.reset = function() {
	this.setup();	
}