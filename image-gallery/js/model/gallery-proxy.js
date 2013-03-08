/*
Gallery
cs stand for casestudy
*/
;Utils.ns('cs.com');

cs.com.GalleryProxy = cs.com.GalleryProxy || function() {
	var dataNS = Utils.data;
	var defaults = {};
	var webService = new dataNS.WebService({
		format : 'json',
		enableCache : false
	});

	this.getGallery = function(url, param, success, fail) {
		webService.getData(url, param, function(output) {
			
			if(success != undefined) {
				success(output);
			}			
		}, function(error) {
			if(fail != undefined) {
				fail();
			}
		});
	}

	
};
