;Utils.ns('cs.com');

cs.com.Gallery = cs.com.Gallery || (function() {
	var dataNS = Utils.data,
		ns = cs.com;
	var container = null,
		settings = {
			dataUrl: ""
		},
		data,
		shortDescTimeout,
		shortDesc,
		seletedIndex = -1,
		relatedIndex = 0;


	var successHandler = function(output) {
		
		data = output;
		render();
	}

	var failHandler = function(error) {
		
	}

	var render = function() {
		
		var html = dataNS.templateManager.renderTemplate(settings.templateId, {data: data.data});
        $(container).append(html);
        invalidate();
	}

	var invalidate = function() {
		bindEvents();
	}

	var init = function(_settings) {
		settings = $.extend(settings, _settings);
		container = settings.container;
		shortDesc = $('.short-desc');
		loadData();
		//test
		seletedIndex = 1;
	}

	var loadData = function() {
		app.galleryProxy.getGallery(settings.dataUrl, {}, successHandler, failHandler);

	}

	var bindEvents = function() {
		$('.gallery li').unbind('mouseover').bind('mouseover', function() {
			showShortDesc($(this).index(), this);
		});

		$('.gallery li > a' ).bind('mouseout', function() {
			//alert("mouseout");
			shortDescTimeout = setTimeout(hideShortDesc, 100);
		});

		shortDesc.unbind('click').bind('click', function() {
			relatedIndex = 0;
			showFullDetail(seletedIndex);
		})

		shortDesc.unbind('mouseover').bind('mouseover', function() {
			if (shortDescTimeout) clearTimeout(shortDescTimeout);
		})

		shortDesc.unbind('mouseout').bind('mouseout', function() {
			shortDescTimeout = setTimeout(hideShortDesc, 100);
		})

		$('.full-detail .close-button').unbind('click').bind('click', function() {
			hideFullDetail();
		});

		$('.full-detail .slide-bar .next').unbind('click').bind('click', function() {
			var l = data.data[seletedIndex].relatedPhotos.length;
			relatedIndex++;
			relatedIndex = Math.min(l - 1, relatedIndex);
			showFullDetail(seletedIndex);
		});

		$('.full-detail .slide-bar .prev').unbind('click').bind('click', function() {
			relatedIndex--;
			relatedIndex = Math.max(0, relatedIndex);
			showFullDetail(seletedIndex);
		});

		$(window).bind('resize scroll', function() {
			if ($('.full-detail:hidden').size() == 0) showFullDetail(seletedIndex);
		});
	}

	var showFullDetail = function(index) {
		var css = {left:0, top: 0};
		var s = {width: $(window).width(), height: $(window).height()};
		var value = data.data[index].relatedPhotos[relatedIndex];

		css.left = parseInt((s.width - $('.full-detail').width())/2);
		css.top = parseInt((s.height - $('.full-detail').height())/2 + $(window).scrollTop());

		hideShortDesc();
		$('.full-detail').css(css);
		$(".full-detail .related-photo img").attr('src', value.photoUrl);
		$(".full-detail .content .title").text(value.description.title);
		$(".full-detail .content .detail").text(value.description.content);
		$(".full-detail .number-text").text((relatedIndex + 1) + ' of ' + data.data[index].relatedPhotos.length);
		$(".full-detail").show();
		$('.overlay').css("top", $(window).scrollTop());
		$('.overlay').show();
	}

	var hideFullDetail = function() {
		$('.full-detail').hide();
		$('.overlay').hide();
	}

	var showShortDesc = function(index, el) {
		var css = $(el).position(),
			top = 0,
			value;
		css.top += $('.gallery').position().top;
		top = css.top - (shortDesc.height() - $(el).height())/2;
		
		css.display = "block";
		css.top = top;
		shortDesc.css(css);
		seletedIndex = parseInt($(el).attr('index'));
		value = data.data[seletedIndex];

		shortDesc.find('.image-container img').attr('src', value.photoUrl);
		shortDesc.find('.image-container .tittle').html(value.shortTitle);
		shortDesc.find('.image-container .detail').html(value.shortDesc);
		if (shortDescTimeout) clearTimeout(shortDescTimeout);
	}

	var hideShortDesc = function() {
		var css = {};
		css.display = "none";

		shortDesc.css(css);
	}


	return {
		init: init
	}
	
})();