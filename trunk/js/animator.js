;Utils.ns('cs.com');
cs.com.Animator = cs.com.Animator || (function() {

	var inited = false;
	var elements;
	var container;
	var step = 0;
	var sequence = ['step1', 'step2', 'step3'];
	var speed = 0.005;

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 10);//60
	          };
	})();

	var render = function() {
		//console.log('render');
		//fade in at center
		var centerP = {},
			startP = {}, 
			endP = {},
			pos = {};
		centerP.left = container.width()/2;
		centerP.top = container.height()/2;

		//elements[0].moveTo(centerP);
		//Move element 1 to top
		startP.left =  elements[1].position().left;
		startP.top =  elements[1].position().top;

		endP = centerP;
		endP.top = 0;

		console.log('endP ' + endP.top + ' ' + endP.left);
		console.log('render ' + startP.top + ' ' + startP.left);
		pos.left = startP.left - (startP.left - endP.left)*speed;
		pos.top = startP.top - (startP.top - endP.top)*speed;
		console.log('render ' + pos.top + ' ' + pos.left);
		elements[1].moveTo(pos);

	}

	var init = function() {
		if (inited) return;
		console.log('inited');
		inited = true;
		// (function animloop(){
		//   requestAnimFrame(animloop);
		//   render();
		// })();
		var pos = {};

		pos.left = container.width()/2;
		pos.top = container.height()/2;

		//circles = $('.circle', container);
		$(elements).each(function(index) {
			this.moveTo(pos);
			jQuery(this.getElement()).css('opacity', 0);
			jQuery(this.getElement()).animate({
				opacity: 1
			},2000, 'linear', function() {
				if (index != 0) return;
				step++;
				nextStep();
			});
		});

		
	}

	var enterframe = function() {
		requestAnimFrame(enterframe);
		render();
	}

	var nextStep = function() {
		switch(sequence[step]) {
			case 'step2':
				enterframe();	
				break;
			case 'step3':
				break;
		}
	}

	var pause = function() {

	}

	var resume = function() {

	}


	return {
		init: init,
		pause: pause,
		resume: resume,
		setChildren: function(list) {
			elements = list;
		},
		setContainer: function(obj) {
			container = obj;
		}
	}
})();

Utils.extend(cs.com.Animator, Utils.Event.ObserverMixin);