var app = app || (function(){
	var _this = this;

	this.galleryProxy = new cs.com.GalleryProxy();

	this.start = function() {
		cs.com.Gallery.init({
			dataUrl:"data/gallery.json.txt", 
			templateId:"gallery-template",
			container:$("#container")
		});

		$(window).bind('resize', function() {
			$('.overlay').css({
				width: $(window).width(),
				height: $(window).height()
			});
		});

		$('.overlay').css({
			display: "none",
			width: $(window).width(),
			height: $(window).height()
		})
	}

	return this;
})();


jQuery(document).ready(function(){
	app.start();
})