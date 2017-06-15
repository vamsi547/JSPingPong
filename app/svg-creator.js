function SVGCreator(parent) {
	this.parent = parent;
}

// <svg width="50" height="50" id="svgBall">
//   <circle cx="25" cy="25" r="20" fill="white" style="stroke-width:3;stroke:grey;" />
// </svg>

SVGCreator.prototype.createBall = function(attrs) {
	var ballID = this.generateID();
	var svgObj = document.createElement('svg')
	svgObj.setAttribute('height', 50);
	svgObj.setAttribute('width', 50);
	svgObj.setAttribute('id', ballID);
	var circleObj = document.createElement('circle');
	circleObj.setAttribute('cx', 25);
	circleObj.setAttribute('cy', 25);
	circleObj.setAttribute('r', 20);
	circleObj.setAttribute('fill', 'white');
	circleObj.setAttribute('style', 'stroke-width:3;stroke:grey;');

	svgObj.appendChild(circleObj);
	this.parent.appendChild(svgObj);
	return ballID;
}


SVGCreator.prototype.cloneElement = function(id) {
	var svgObject =  document.getElementById(id);
	var newSvgObject = svgObject.cloneNode(true);
	newSvgObject.id = this.generateID();
	return newSvgObject;
}

SVGCreator.prototype.cloneBall = function(attrs, id) {
	var newSvgObject = this.cloneElement(id);

	newSvgObject.setAttribute('height', attrs.height || 50);
	newSvgObject.setAttribute('width', attrs.width || 50);

	var circleObj = newSvgObject.getElementsByTagName('circle')[0];
	circleObj.setAttribute('cx', attrs.cx || 25);
	circleObj.setAttribute('cy', attrs.cy || 25);
	circleObj.setAttribute('r', attrs.radius || 20);
	circleObj.setAttribute('fill', attrs.circleColor || 'white');
	circleObj.setAttribute('style', attrs.circleStyle || 'stroke-width:3;stroke:grey;');	

	this.parent.appendChild(newSvgObject);
	return newSvgObject.id;	
}

SVGCreator.prototype.cloneBonusBar = function(id) {
	var newSvgObject = this.cloneElement(id);
	this.parent.appendChild(newSvgObject);
	return newSvgObject.id;
}

SVGCreator.prototype.generateID = function() {
	return Math.random().toString(36).substring(7);
}	