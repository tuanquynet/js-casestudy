;Utils.ns('cs.com');
cs.com.Shape = cs.com.Shape || function() {
	this.defaults = {
		width:0, 
		height:0,
		top:0,
		left:0,
		background_color: '#FFFFFF'
	};
	
	this.prop = jQuery.extend({}, this.defaults);
}

cs.com.Shape.prototype.init = function(settings) {
	this.prop = jQuery.extend(this.prop, settings);
}

cs.com.Shape.prototype.draw = function() {

}

cs.com.Shape.prototype.attachTo = function(parent) {

}