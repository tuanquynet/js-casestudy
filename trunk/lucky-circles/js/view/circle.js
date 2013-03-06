;Utils.ns('cs.com');
cs.com.Circle = cs.com.Circle || function() {
	//call super class's constructor to init property defined in super class.
	var ns = cs.com;
	ns.Circle.prototype.parent.constructor.call(this);
	
	var el;
	var _this = this;
	var registrationPoint = {xPer:0.5, yPer:0.5};
	var centerPoint = {x: 0, y: 0};

	this.snapToEdge = false;
	this.snapedPoint = '';
	
	this.draw = function() {
		var html = '<div class="circle" style=""></div>';
		el = $(html);

		el.css({
			top: this.props.top + 'px',
	    	left: this.props.left + 'px',
			width: this.props.width + 'px',
	    	height: this.props.width + 'px',
	    	"-webkit-border-radius": (this.props.width/2) + 'px',
	    	"-moz-border-radius": (this.props.width/2) + 'px',
	    	"border-radius": (this.props.width/2) + 'px',
	    	"background-color": this.props.background_color
	    });

	    centerPoint.y = centerPoint.x = this.props.width * registrationPoint.xPer;	    
	}

	this.attachTo = function(parent) {
		$(el).appendTo(parent);
	}

	this.invalidate = function(props) {
		var _pos = {};
		this.props = $.extend(this.props, props);

		if (props.top || props.left) {
			this.moveTo(this.props);
		}
		
		if (props.width || props.height) {
			this.resize(this.props);
		}
	}

	this.moveTo = function(pos) {
		var _pos = {};
		this.props = $.extend(this.props, pos);

		_pos.left = this.props.left - centerPoint.x;
		_pos.top = this.props.top - centerPoint.y;
				
		el.css({
			'left': _pos.left + 'px',
			'top': _pos.top + 'px'
		});
	}

	this.resize = function(size) {
		this.props.height = this.props.width = size.width;
		
		centerPoint.y = centerPoint.x = this.props.width * registrationPoint.xPer;
		el.css({
			width: this.props.width + 'px',
			height: this.props.width + 'px',
			"-webkit-border-radius": (this.props.width/2) + 'px',
	    	"-moz-border-radius": (this.props.width/2) + 'px',
	    	"border-radius": (this.props.width/2) + 'px',
		});
	}

	this.getElement = function () {
		return el;
	}

	this.position = function() {
		return {left: this.props.left, top: this.props.top};
	}

	this.size = function() {
		return {width: this.props.width, height: this.props.height};
	}

	this.css = function(stylesheet) {

		$.extend(this.props, stylesheet);
		if (stylesheet.left && stylesheet.top) {
			this.moveTo({left: stylesheet.left, top: stylesheet.top});
		}
	}


}

Utils.extend(cs.com.Circle, cs.com.Shape);