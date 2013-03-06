/* Collection of utility functions */
var Utils = (function () {


	var ns = function(namespace) {
		if (!namespace || namespace == '') return;
		var props = namespace.split('.');
		var l = props.length;
		var parent = window;
		var path;

		for(var i =0; i < l; i++) {
			path = props[i];
			parent[path] = parent[path] || {};
			parent = parent[path];
		}
	}

	var extend = function(subClass, superClass) {
		var parentInstance = new superClass();
		var oldProperties = subClass.prototype;
		subClass.prototype =  parentInstance;
		subClass.prototype.constructor = subClass;
		subClass.prototype.parent = {};
		subClass.prototype.parent.constructor = superClass;
		subClass.prototype.parent.instance = parentInstance;
		subClass.prototype.parent.proto = superClass.prototype;
		
		for(var prop in oldProperties) {
			subClass.prototype[prop] = oldProperties[prop]; 
		}

		
	};

	return {
		ns: ns,
		extend: extend
	}
})();

Utils.ns('Utils.Event');

Utils.Event.ObserverMixin = function() {
	
};


Utils.Event.ObserverMixin.prototype.addListener = function(eventName, listenerObj, functionName) {
	var listener = {};
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();
	}
	if (typeof this.eventListeners[eventName] == 'undefined') {
		this.eventListeners[eventName] = [];
	}
	listener.obj = listenerObj;
	listener.functionName = functionName;
	this.eventListeners[eventName].push(listener);
};

Utils.Event.ObserverMixin.prototype.removeListener = function(eventName, listenerObj) {
	var arrayLength = this.eventListeners[eventName].length;
	var i, foundIndex;
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();
	}
	if (arrayLength == 0) {
		return;
	}
	foundIndex = -1;
	for (i = 0; i < arrayLength; i++) {
		if (this.eventListeners[eventName][i].obj === listenerObj) {
			foundIndex = i;
			break;
		}
	}
	if (foundIndex >= 0) {
		this.eventListeners[eventName] = Array.remove(
				this.eventListeners[eventName], foundIndex);
	}
};

Utils.Event.ObserverMixin.prototype.removeAllListeners = function(event) {
	this.eventListeners[event] = [];
};

Utils.Event.ObserverMixin.prototype.fireEvent = function(eventName, eventDataObj) {
	var eventData = {};
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();		
	}
	if(typeof this.eventListeners[eventName]=='undefined') {
		return;	
	}
	eventData.sender = this;
	eventData.name = eventName;
	eventData.data = eventDataObj;	
	for (var listenerIterator in this.eventListeners[eventName]) {
		var listenerObj = this.eventListeners[eventName][listenerIterator];

		if (listenerObj && listenerObj.obj) {
			listenerObj.obj[listenerObj.functionName].apply(
					listenerObj.obj, [eventData]);
		}
	}
};
