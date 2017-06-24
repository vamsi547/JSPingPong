function Bar(barID, container) {
	this.bar = document.getElementById(barID);
	this.rect = this.bar.getElementsByTagName('rect')[0];
	this.container = container;
	this.setup();
}

Bar.prototype.setup = function() {

	var barOperator = '+';

	this.bar.style.left = '0px';	
	this.stepsToMove = 150;
	this.defaultBarLength = 300;
	this.barLength = this.defaultBarLength;
	//Update Bar length if Previous game has diff length
	this.updateBarLength();
	// key stroke codes
	this.leftArrowCode = 37;
	this.rightArrowCode = 39;

	// keydown event 
	this.keyDownEventListener();
	// Mouse move event
	this.mouseMoveEventListener();
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

		this.bar.style.left = eval('' + newBarLeft)  - diffSpace + 'px';

	}.bind(this);

	document.addEventListener('keydown', this.moveBar);	
};

Bar.prototype.keyDownEventRemover = function() {
	document.removeEventListener('keydown', this.moveBar);
}

Bar.prototype.mouseMoveEventListener = function() {
	this.moveBarOnMouseMovement = function(e) {
		var mousePoint = e.clientX;
		var maxLeft = this.container.clientWidth - this.barLength;
		this.bar.style.left = mousePoint > maxLeft ? maxLeft : mousePoint;
	}.bind(this);
	document.addEventListener("mousemove", this.moveBarOnMouseMovement, false);

}

Bar.prototype.mouseMoveEventRemover = function() {
	document.removeEventListener('mousemove', this.moveBarOnMouseMovement);
}

Bar.prototype.increaseSpeed = function() {
	this.stepsToMove += 10;
}

Bar.prototype.updateBarLength = function(length) {
	if(length)
		this.barLength = length;
	this.bar.style.width = this.barLength + 'px';
	this.rect.style.width = this.barLength + 'px';
	this.adjustBarPosition();
}

/*
	Case : Bar at extreme right and Catches Bonus point that doubles the size
	Result : Bar extends beyond container as it doubles
	Solution: Adjust Bar's left such that it fits to the container at its right end
*/
Bar.prototype.adjustBarPosition = function() {
	var currentLeft = parseInt(this.bar.style.left);
	var containerWidth = this.container.clientWidth;
	var barOverflow = currentLeft + this.barLength - containerWidth;
	// Check currentleft > baroverflow  needed in lower resolutions
	if(barOverflow > 0 && currentLeft > barOverflow) {
		this.bar.style.left = currentLeft - (barOverflow) + 'px';
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
	// Bar stops moving on Mouse movement
	this.mouseMoveEventRemover();
}

Bar.prototype.reset = function() {
	this.setup();	
}