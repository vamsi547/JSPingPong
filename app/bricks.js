function Bricks(brickId, container, deps) {
	this.brickId = brickId;
	this.container = container;
	this.svgCreator = deps.svgCreator;
	this.setup();
}

Bricks.prototype.setup = function () {
	this.svgCreator.cloneBrick(this.brickId);
};