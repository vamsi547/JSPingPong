function BrickLevelConstructor() {
	this.bricksToLevelMap = {
		1: level1Bricks,
		2: level2Bricks
	};
}

/*
	Assigns corresponding Brick Constructor based on the level
*/
BrickLevelConstructor.prototype.getBrickConstructor = function(level) {
	return level && this.bricksToLevelMap[level];
}

function level1Bricks() {
	var rows = 5, columns = 15;
	for(var row = 0; row < rows; row ++) {
		for(var column = 0; column < columns; column++) {
			if(rows > 2 && row < rows - 1 && column > 2 && column < columns - 3) {
				continue;
			}
			var attrs = {
				left: (column === 0)? this.firstLeft : this.firstLeft + (column * (this.brickWidth + this.marginLeft)),
				top: '' + (parseInt(this.firstTop) + row*5) + '%'
			}
			var createdBrickId = this.svgCreator.cloneBrick(this.brickId, attrs);
			
			this.bricksListMap[createdBrickId] = document.getElementById(createdBrickId);
		}	
	}
}

function level2Bricks() {
	var rows = 5, columns = 15;
	for(var row = 0; row < rows; row ++) {
		for(var column = 0; column < columns; column++) {
			if(rows > 2 && row > 0 && column > 2 && column < columns - 3) {
				continue;
			}
			var attrs = {
				left: (column === 0)? this.firstLeft : this.firstLeft + (column * (this.brickWidth + this.marginLeft)),
				top: '' + (parseInt(this.firstTop) + row*5) + '%'
			}
			var createdBrickId = this.svgCreator.cloneBrick(this.brickId, attrs);
			
			this.bricksListMap[createdBrickId] = document.getElementById(createdBrickId);
		}	
	}
}