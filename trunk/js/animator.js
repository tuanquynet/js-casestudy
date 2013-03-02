;Utils.ns('cs.com');
cs.com.Animator = cs.com.Animator || (function() {

	var inited = false;
	var elements;
	var container;
	var step = 0;
	var sequence = ['step1', 'step2', 'step3'];
	var speed = 0.05;

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);//60
	          };
	})();

	var render = function() {
		//console.log('render');
		//fade in at center
		var centerP = {},
			startP = {left:0, top:0}, 
			endP = {left:0, top:0},
			pos = {},
			props = {},
			startS,
			endS;
		var count = 0;
		centerP.left = container.width()/2;
		centerP.top = container.height()/2;

		endS = {width: container.width()*.1, height: container.height()*.1};

		startP =  elements[0].position();
		endP = $.extend(endP, centerP);
		startS = elements[0].size();
		props = timingFunction(startP, endP, startS, endS);
		elements[0].invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		//Move element 1 to top
		startP =  elements[1].position();
		endP = $.extend(endP,centerP);
		endP.top = 0;
		startS = elements[0].size();
		props = timingFunction(startP, endP, startS, endS);
		elements[1].invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		startP =  elements[2].position();
		endP = $.extend(endP, centerP);
		endP.top = centerP.top*2;
		startS = elements[0].size();
		props = timingFunction(startP, endP, startS, endS);
		elements[2].invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		startP =  elements[3].position();
		endP = $.extend(endP, centerP);
		endP.left = 0;
		startS = elements[0].size();		
		props = timingFunction(startP, endP, startS, endS);
		elements[3].invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		startP =  elements[4].position();
		endP = $.extend(endP, centerP);
		endP.left = centerP.left*2;
		startS = elements[0].size();
		props = timingFunction(startP, endP, startS, endS);
		elements[4].invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		if (count === 5 && step == 1) {
			step = 2;
		}
	}

	var timingFunction = function(startP, endP, startSize, endSize) {
		var props = {};
		if (startP && endP) {
			props.left = startP.left - (startP.left - endP.left)*speed;
			props.top = startP.top - (startP.top - endP.top)*speed;
		}

		if (startSize && endSize) {
			props.width = startSize.width - (startSize.width - endSize.width)*speed;
			props.height = startSize.height - (startSize.height - endSize.height)*speed;
		}
		
		return props;
	}

	var init = function() {
		if (inited) return;
		
		inited = true;

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