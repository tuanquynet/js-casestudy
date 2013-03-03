;Utils.ns('cs.com');

cs.com.Animator = cs.com.Animator || (function() {
	var ns = cs.com;
	var inited = false,
		elements,
		container,
		step = 0,
		sequence = ['step1', 'step2', 'step3'],
		speed = 0.05,
		state = ns.AnimatorState.PAUSE,
		endPoints = [],
		endSize = [],
		maxRatio = 0.1;

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	var render = function() {		
		//fade in at center
		var centerP = {},
			startP = {left:0, top:0}, 
			endP = {left:0, top:0},
			pos = {},
			props = {},
			startS,
			endS,
			el;
		var count = 0;
		

		endS = endSize[0];

		el = elements[0];
		startP =  el.position();
		endP = endPoints[0];
		startS = el.size();
		props = timingFunction(startP, endP, startS, endS);
		el.invalidate(props);
		var threshold = 0.1;
		if (Math.abs(startP.left - endP.left) < threshold && Math.abs(startP.top - endP.top) < threshold) {
			count++;
		}

		//Move element 1 to top
		el = elements[1];
		startP =  el.position();
		endP = endPoints[1];		
		startS = el.size();
		props = timingFunction(startP, endP, startS, endS);
		el.invalidate(props);
		if (Math.abs(startP.left - endP.left) < threshold && Math.abs(startP.top - endP.top) < threshold) {
			count++;
		}

		el = elements[2];
		startP =  el.position();
		endP = endPoints[2];
		startS = el.size();
		props = timingFunction(startP, endP, startS, endS);
		el.invalidate(props);
		if (Math.abs(startP.left - endP.left) < threshold && Math.abs(startP.top - endP.top) < threshold) {
			count++;
		}

		el = elements[3];
		startP =  el.position();
		endP = endPoints[3];
		startS = el.size();		
		props = timingFunction(startP, endP, startS, endS);
		el.invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		el = elements[4];
		startP =  el.position();
		endP = endPoints[4];
		startS = el.size();
		props = timingFunction(startP, endP, startS, endS);
		el.invalidate(props);
		if (Math.abs(startP.left - endP.left) < 0.01 && Math.abs(startP.top - endP.top) < 0.01) {
			count++;
		}

		if (count === 5 && step == 1) {
			step = 2;
			//state = ns.AnimatorState.PAUSE;
			nextStep();
		}
	}

	var calculatEndPoint = function() {
		var el;

		for (var i = 0; i < elements.length; i++) {
			el = elements[i];
			endPoints[i] = getCornerPos(el.snapedPoint);
			endSize[i] = {width: container.width()*maxRatio, height: container.height()*maxRatio};
		}
		
	}

	var getCornerPos = function(cornerPos) {
		switch (cornerPos) {
			case ns.CornerEnum.TL:
				return {left: 0, top: 0};
				break;
			case ns.CornerEnum.TM:
				return {left: container.width()/2, top: 0};
				break;
			case  ns.CornerEnum.TR:
				return {left: container.width(), top: 0};
				break;
			case ns.CornerEnum.ML:
				return {left: 0, top: container.height()/2};
				break;
			case  ns.CornerEnum.MM:
				return {left: container.width()/2, top: container.height()/2};
				break;
			case ns.CornerEnum.MR:
				return {left: container.width(), top: container.height()/2};
				break;
			case  ns.CornerEnum.BL:
				return {left: 0, top: container.height()};
				break;
			case  ns.CornerEnum.BM:
				return {left: container.width()/2, top: container.height()};
				break;
			case  ns.CornerEnum.BR:
				return {left: container.width(), top: container.height()};
				break;
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
		var initEndPoint = [ns.CornerEnum.MM, ns.CornerEnum.TM, ns.CornerEnum.BM, ns.CornerEnum.ML, ns.CornerEnum.MR];
		$(elements).each(function(index) {
			
			el = elements[index];
			el.snapedPoint = initEndPoint[index];
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
		calculatEndPoint();

		//bind resize

	}

	var enterframe = function() {
		if (state == ns.AnimatorState.PLAYING) {
			requestAnimFrame(enterframe);
			render();
		}
	}

	var nextStep = function() {
		switch(sequence[step]) {
			case 'step2':
				state = ns.AnimatorState.PLAYING;
				enterframe();
				break;
			case 'step3':
				state = ns.AnimatorState.PLAYING;
				enableInteraction();
				enterframe();
				break;
		}
	}	

	var pause = function() {
		state = ns.AnimatorState.PAUSE;
	}

	var resume = function() {
		state = ns.AnimatorState.PLAYING;
		enterframe();
	}

	var enableInteraction = function() {

		$(elements).each(function(index){
			if (index == 0) return;
			
			$(elements[index].getElement()).unbind('mouseover').bind('mouseover', function(){
				
				var el = elements[index];
				el.snapToEdge = true;
				switch (index) {
					case 0:
						el.snapedPoint = ns.CornerEnum.MID;
						break;
					case 1:
						el.snapedPoint = (el.snapedPoint == ns.CornerEnum.TR) ? ns.CornerEnum.TL : ns.CornerEnum.TR;
						break;
					case 2:
						el.snapedPoint = (el.snapedPoint == ns.CornerEnum.BL) ? ns.CornerEnum.BR : ns.CornerEnum.BL;
						break;
					case 3:
						el.snapedPoint = (el.snapedPoint == ns.CornerEnum.TL) ? ns.CornerEnum.BL : ns.CornerEnum.TL;
						break;
					case 4:
						el.snapedPoint = (el.snapedPoint == ns.CornerEnum.BR) ? ns.CornerEnum.TR : ns.CornerEnum.BR;
						break;
				}
				calculatEndPoint();
			});
		});
		//$(elements).unbind('mouseover').bind('mouseover', function(){});
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
		},
		resize: function() {			
			calculatEndPoint();
		}
	}
})();

Utils.extend(cs.com.Animator, Utils.Event.ObserverMixin);

