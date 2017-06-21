function Bricks(brickId, container, deps) {
	this.brickId = brickId;
	this.container = container;
	this.svgCreator = deps.svgCreator;
	this.bricksList = [];
	this.setup();
}

Bricks.prototype.setup = function () {
	this.brickWidth = 50;
	this.brickHeight = 30;
	this.firstLeft = 100;
	this.paddingLeft = 2;

	for(var i = 0; i < 10; i++) {
		var attrs = {
			left: this.firstLeft + this.paddingLeft + (i * this.brickWidth),
			paddingLeft: this.paddingLeft
		}
		var createdBrickId = this.svgCreator.cloneBrick(this.brickId, attrs);
		this.bricksList[i] = {
			id: createdBrickId,
			obj: document.getElementById(createdBrickId)
		};
	}	
};

Bricks.prototype.getPosition = function() {
	
};

