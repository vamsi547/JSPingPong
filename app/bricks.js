function Bricks(brickId, container, deps) {
	this.brickId = brickId;
	this.container = container;
	this.svgCreator = deps.svgCreator;
	this.eventEmitter = deps.eventEmitter
	this.setup();
}
/*
	Sets Bricks of 5 * 10 Layout for Level 1
	- Default Height is 30px and Width is 50px
	- Stores all the Bricks with Ids as a JSON
*/
Bricks.prototype.setup = function () {
	this.brickWidth = 50;
	this.brickHeight = 30;
	this.firstLeft = 500;
	this.marginLeft = 5;
	this.firstTop = '30%'
	this.bricksListMap = {};

	for(var row = 0; row < 1; row ++) {
		for(var i = 0; i < 1; i++) {
			var attrs = {
				left: (i === 0)? this.firstLeft : this.firstLeft + (i * (this.brickWidth + this.marginLeft)),
				top: '' + (parseInt(this.firstTop) + row*5) + '%'
			}
			var createdBrickId = this.svgCreator.cloneBrick(this.brickId, attrs);
			
			this.bricksListMap[createdBrickId] = document.getElementById(createdBrickId);
		}	
	}	

};

/*
	Returns Position of a specific brick associated with passed ID;
*/
Bricks.prototype.getBrickPosition = function(id) {
	// Send position of the Brick { top, left, bottom, right}
	return id && this.bricksListMap[id] && this.bricksListMap[id].getBoundingClientRect();
};

/*
	Removes specified Brick of passed ID from the DOM and from the Brick Map
*/
Bricks.prototype.removeBrick = function(id) {
	
	if(id && this.bricksListMap[id]) {
		// Remove Brick from DOM
		this.bricksListMap[id].remove();
		// Remove Brick from list
		delete this.bricksListMap[id];
		// Check for level-up
		if(Object.keys(this.bricksListMap).length === 0) {
			this.eventEmitter.emit('game-over');
		}
	}

}

/*
	Removes all the Bricks currently existing in the DOM 
*/
Bricks.prototype.removeAllBricks = function() {
	for(var brickId in this.bricksListMap) {
		if(this.bricksListMap.hasOwnProperty(brickId)) {
			this.bricksListMap[brickId].remove();
		}
	}	
	this.bricksListMap = {};
}

/*
	- Remove all the Bricks
	- Set the Bricks state to Level 1 Layout
*/
Bricks.prototype.reset = function() {
	this.removeAllBricks();
	this.setup();
}