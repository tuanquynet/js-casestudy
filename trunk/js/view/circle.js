;Utils.ns('cs.com');
cs.com.Circle = cs.com.Circle || function() {
	//call super class's constructor to init property defined in super class.
	var ns = cs.com;
	ns.Circle.prototype.parent.constructor.call(this);
	
	var el;
	var _this = this;
	var registrationPoint = {xPer:0.5, yPer:0.5};
	var centerPoint = {x: 0, y: 0};


	this.draw = function() {
		var html = '<div class="circle" style=""></div>';
		el = $(html);

		el.css({
			width: this.prop.width + 'px',
	    	height: this.prop.width + 'px',
	    	"-webkit-border-radius": (this.prop.width/2) + 'px',
	    	"-moz-border-radius": (this.prop.width/2) + 'px',
	    	"border-radius": (this.prop.width/2) + 'px',
	    	"background-color": this.prop.background_color
	    });

	    centerPoint.y = centerPoint.x = this.prop.width * registrationPoint.xPer;	    
	}

	this.attachTo = function(parent) {
		$(el).appendTo(parent);
	}

	this.moveTo = function(pos) {
		var _pos = pos;
		$.extend(this.prop, pos);

		_pos.left = this.prop.left - centerPoint.x;
		_pos.top = this.prop.top - centerPoint.y;
		

		el.css({
			'left': _pos.left + 'px',
			'top': _pos.top + 'px'
		});
	}

	this.resize = function(size) {
		this.prop.width = size.width;
		this.prop.height = size.height;
		centerPoint.y = centerPoint.x = this.prop.width * registrationPoint.xPer;
	}

	this.getElement = function () {
		return el;
	}

	this.position = function() {
		return {left: this.pros.left, top: this.pros.left};
	}

	this.css = function(stylesheet) {
		$.extend(this.pros, stylesheet);
		if (stylesheet.left || stylesheet.top) {
			this.moveTo(left:stylesheet.left, top: stylesheet.top);
		}
	}
}

Utils.extend(cs.com.Circle, cs.com.Shape);