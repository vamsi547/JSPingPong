function EventEmitter() {	
	this.events = {}; // { 'eventName': [callbacks]}
}

EventEmitter.prototype.emit = function(event, args) {
	// execute all callbacks registered with this event
	if(!this.events[event])
		return;
	var listeners = this.events[event];
	listeners.forEach(function(listener) {
		listener(args);
	});
}

EventEmitter.prototype.on = function(event, listener) {
	if(!this.events[event])
		this.events[event] = [];
	this.events[event].push(listener);
}