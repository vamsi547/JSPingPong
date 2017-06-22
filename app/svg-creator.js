function SVGCreator(parent) {
	this.parent = parent;
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

SVGCreator.prototype.cloneBrick = function(id, attrs) {
	var newSvgObject = this.cloneElement(id);
	newSvgObject.style.display = 'block'
	newSvgObject.style.left = attrs.left || 10;
	newSvgObject.style.top  = attrs.top || '20%';
	
	this.parent.appendChild(newSvgObject);
	return newSvgObject.id;
}

SVGCreator.prototype.generateID = function() {
	return Math.random().toString(36).substring(7);
}	