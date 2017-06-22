function Bricks(brickId, container, deps) {
	this.brickId = brickId;
	this.container = container;
	this.svgCreator = deps.svgCreator;
	this.eventEmitter = deps.eventEmitter
	this.setup();
}

Bricks.prototype.setup = function () {
	this.brickWidth = 50;
	this.brickHeight = 30;
	this.firstLeft = 200;
	this.marginLeft = 5;
	this.firstTop = '20%'
	this.bricksListMap = {};

	for(var row = 0; row < 5; row ++) {
		for(var i = 0; i < 15; i++) {
			var attrs = {
				left: (i === 0)? this.firstLeft : this.firstLeft + (i * (this.brickWidth + this.marginLeft)),
				top: '' + (parseInt(this.firstTop) + row*5) + '%'
			}
			var createdBrickId = this.svgCreator.cloneBrick(this.brickId, attrs);
			
			this.bricksListMap[createdBrickId] = document.getElementById(createdBrickId);
		}	
	}	

};

Bricks.prototype.getBrickPosition = function(id) {
	// Send position of the Brick { top, left, bottom, right}
	return this.bricksListMap[id] && this.bricksListMap[id].getBoundingClientRect();
};

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