;Utils.ns('cs.com');
cs.com.Shape = cs.com.Shape || function() {
	this.defaults = {
		width:0, 
		height:0,
		top:0,
		left:0,
		background_color: '#FFFFFF'
	};
	
	this.props = jQuery.extend({}, this.defaults);
}

cs.com.Shape.prototype.init = function(settings) {
	this.props = jQuery.extend(this.props, settings);
}

cs.com.Shape.prototype.draw = function() {

}

cs.com.Shape.prototype.attachTo = function(parent) {

}