var app = app || (function(){
	var _this = this;

	var createChildren = function() {
		var num = 5,
			circles = [];
		var container = $('#container');
		var settings = {
			width: 50,
			height: 50,
		}


		container.css({
			width: $(window).width(),
			height: $(window).height(),
			position: 'absolute',
			left: '0px',
			top: '0px'
		})
		for (var i = num - 1; i >= 0; i--) {
			var circle = new cs.com.Circle();
			circle.init(settings);
			circle.draw();
			circle.attachTo(container);
			circles.push(circle);
		};

		cs.com.Animator.setChildren(circles);
		cs.com.Animator.setContainer(container);
	}

	var start = function() {
		//create
		createChildren();
		cs.com.Animator.init();
	}

	return {
		start: start
	}
})();


jQuery(document).ready(function(){
	
	//init animator

	//create 5 circles
	app.start();

})