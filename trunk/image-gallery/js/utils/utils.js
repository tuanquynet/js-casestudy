/* Collection of utility functions */
var Utils = (function () {


	var ns = function(namespace) {
		if (!namespace || namespace == '') return;
		var props = namespace.split('.');
		var l = props.length;
		var parent = window;
		var path;

		for(var i =0; i < l; i++) {
			path = props[i];
			parent[path] = parent[path] || {};
			parent = parent[path];
		}
	}

	var extend = function(subClass, superClass) {
		var parentInstance = new superClass();
		var oldProperties = subClass.prototype;
		subClass.prototype =  parentInstance;
		subClass.prototype.constructor = subClass;
		subClass.prototype.parent = {};
		subClass.prototype.parent.constructor = superClass;
		subClass.prototype.parent.instance = parentInstance;
		subClass.prototype.parent.proto = superClass.prototype;
		
		for(var prop in oldProperties) {
			subClass.prototype[prop] = oldProperties[prop]; 
		}

		
	};

	return {
		ns: ns,
		extend: extend
	}
})();

Utils.ns('Utils.Event');

Utils.Event.ObserverMixin = function() {
	
};


Utils.Event.ObserverMixin.prototype.addListener = function(eventName, listenerObj, functionName) {
	var listener = {};
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();
	}
	if (typeof this.eventListeners[eventName] == 'undefined') {
		this.eventListeners[eventName] = [];
	}
	listener.obj = listenerObj;
	listener.functionName = functionName;
	this.eventListeners[eventName].push(listener);
};

Utils.Event.ObserverMixin.prototype.removeListener = function(eventName, listenerObj) {
	var arrayLength = this.eventListeners[eventName].length;
	var i, foundIndex;
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();
	}
	if (arrayLength == 0) {
		return;
	}
	foundIndex = -1;
	for (i = 0; i < arrayLength; i++) {
		if (this.eventListeners[eventName][i].obj === listenerObj) {
			foundIndex = i;
			break;
		}
	}
	if (foundIndex >= 0) {
		this.eventListeners[eventName] = Array.remove(
				this.eventListeners[eventName], foundIndex);
	}
};

Utils.Event.ObserverMixin.prototype.removeAllListeners = function(event) {
	this.eventListeners[event] = [];
};

Utils.Event.ObserverMixin.prototype.fireEvent = function(eventName, eventDataObj) {
	var eventData = {};
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();		
	}
	if(typeof this.eventListeners[eventName]=='undefined') {
		return;	
	}
	eventData.sender = this;
	eventData.name = eventName;
	eventData.data = eventDataObj;	
	for (var listenerIterator in this.eventListeners[eventName]) {
		var listenerObj = this.eventListeners[eventName][listenerIterator];

		if (listenerObj && listenerObj.obj) {
			listenerObj.obj[listenerObj.functionName].apply(
					listenerObj.obj, [eventData]);
		}
	}
};

Utils.ns('Utils.data');


Utils.data.JSONParser = function() {
 	/**
	 * Parse JSON string to JSON object
	 * 
	 * @param {String} jsonString JSON string to parse 
	 *            
	 * @method parseData
	 * @return {JSON Object} JSON object
	 */
 	this.parseData = function(jsonString) {
 		if (typeof jsonString !== 'string') {
 			return jsonString;	
 		}
    	var jsonObject = JSON.parse(jsonString, function (key, value) {
        // Deserialize dates
        if (typeof value === 'string') {
	            var dateRegEx = new RegExp(/\/Date\(([\d]+)[\+]*([\d]*)\)\//gi),
	                match = dateRegEx.exec(value);
	
	            if (match)  // WCF Format
	            {
	                return new Date($.wcfDateToMilliseconds(match[1], match[2]));
	            }
	            else {      // UTC Format
	                var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
	                if (a)
	                    return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3] - 1, +a[4], +a[5], +a[6]));
	            }
	        }
	
	        return value;
	    });
	
	    return jsonObject;
 	};
 };
 /**
 * This class is used for parsing XML data from XML string
 * @class Utils.data.XmlParser
 * @module Utils.data
 */
 Utils.data.XmlParser = function() {

 	/**
	 * Parse XML string to XML Document object
	 * 
	 * @param {String} xmlString XML string to parse 
	 *            
	 * @method parseData
	 * @return {XML document} XML Document object
	 */
 	this.parseData = function(xmlString) {
 		var xmlDoc = $.parseXML(xmlString);
   		return $( xmlDoc );
 	};
 };

 /**
 * Wrapper class for calling web services in Ajax.
 * Implemented features on this class
 
 + Caching data (if enableCache = true, default value = false) - if you recall the request during the caching time, it will return data in cache.
 + If a request is calling, it will never be called again until the request is finished/failed.
 + In case the enableCache = false, it will put a random param into the GET request to disable caching
 in IE.
 + Parse returned data into XML Document object OR JSON object depends on the [format] param 
 + Allow to abort a pending request
 + Session error handling (server return 403 error code)
 
 	Example of creating this class:

	var webService = new Utils.data.WebService({format:'json', enableCache: true});
 * @class Utils.data.WebService
 * @module Utils.data
 * @constructor 
 * @param {Object} options params to pass into this function. Option object contains below
 * param options
	
	 + format: (xml|json)
	 + enableCache: allow caching data for GET request.
	 + sessionExpiredCallback: sessionExpiredCallBack function
	 + requestTimeout: request time out in seconds. Default: 60 seconds
	 + cacheExpiryinSeconds: cached expiration time in seconds. Default: 10 seconds.
 *
 */
Utils.data.WebService = function(options) {
 	this.sessionExpiredCallback = null;
 	this.requestTimeout = 10000;
    this.requests = {};
    this.dataCache = {};
    this.webServiceType = null;
    this.enableCache = false;
    this.cacheExpiryinSeconds = 10;
	
 	this.initialize = function(options) {
 		
 		this.sessionExpiredCallback = options.sessionExpiredCallback;
 		this.webServiceType = options.format;
 		this.requestTimeout = options.requestTimeout? options.requestTimeout: 60;
 		this.enableCache =  options.enableCache?options.enableCache:false;
 		this.cacheExpiryinSeconds = options.cacheExpiryinSeconds?options.cacheExpiryinSeconds:10;
 	};
 	
 	/**
	 * Call GET service
	
	Example of using this function:

		var webService = new Utils.data.WebService({format:'json', enableCache: true});
		webService.getData('data.json', {username:'nguyenvannam',
		password: '123'}, 
		function(data) {
			console.log(data);
		},
		function(error) {
			console.log(error);
		});
		
 
	 * @param {String} url URL of the service
	 * @param {object} params paramerters to pass
	 * @param {function} onSuccess success call back function
	 * @param {function} onFail failed call back function
	 * @param {boolean} forceRefresh True if you want to force refresh
	 *		 
	 * @method getData
	 */
 	this.getData = function (url, params, onSuccess, onFail, refresh, settings) {
	    var that = this;
		var forceRefresh = refresh? refresh: false;
	    var validCacheCutoff = new Date();
	    
	    validCacheCutoff.setSeconds(validCacheCutoff.getSeconds() - this.cacheExpiryinSeconds);
	
	    // first try to retrieve from the cache
	    var cacheEntry = null;
	    cacheEntry = that.dataCache[url];
	    if (this.enableCache==true && cacheEntry && cacheEntry.data && 
	    !forceRefresh && cacheEntry.lastUpdated > validCacheCutoff) {
	        if (onSuccess) {
	        	
	            onSuccess(cacheEntry.data);
	        }
	        return;
	    }
	    
	
	    // otherwise call our webservice
	    this._callService(url, params, 'GET', function (data) {
	    	//console.log(data);
	    	if(that.enableCache) {
		        that.dataCache[url] = {
		            lastUpdated: new Date(),
		            data: data
		        };
	    	}
	    	 if (onSuccess) {
	            onSuccess(data);
	        }
			
	    }, onFail, settings);
	};
	/**
	 *  Call POST service
		
		Example of using this function:

		var webService = new Utils.data.WebService({format:'json', enableCache: true});
		webService.postData('data.json', {username:'nguyenvannam',
		password: '123'}, 
		function(data) {
			console.log(data);
		},
		function(error) {
			console.log(error);
		});
		
	 
 
 
	 * @param {String} url URL of the service
	 * @param {object} params paramerters to pass
	 * @param {function} onSuccess success call back function
	 * @param {function} onFail failed call back function
	 * @method postData
	 */
	this.postData = function (url, params, onSuccess, onFail, settings) {
	    this._callService(url, params, 'POST', onSuccess, onFail, settings);
	};
	
	this.abortRequest = function (url) {
	    this._abortRequest(url);
	};
	
	this.abortAllRequests = function () {
	    var that = this;
	    $(that.requests).each(function () {
	        this._abortRequest(this.dataName);
	    });
	};
	
	this.clearCache = function (url) {
	    if (url) {
	        delete this.dataCache[url];
	    }
	    else {
	        this.dataCache = {};
	    }
	};
	
	
	this.createRequest = function(serviceType, url, params, verb, successCallback, errorCallback, settings) {
		var errorMessage;
		var getOrPost = (verb) ? verb : "GET"; // Default to get.
		 // Create a queue reference object
	    var request = {
	        dataName: url,
	        successCallback: successCallback,
	        errorCallback: errorCallback
	    };
		var contentType = 'application/json';
		var dataType = 'html';
        console.log("===call service url " + url);
		var onSuccess = (function(_request, thisObj) {
			
			return function (data) {
                //console.log("==onSuccess  data " + data);
				var resultObject = null;
		        try {
		            _deleteRequest(_request, thisObj);
		            //console.log("===jqXHR.status " + data);
		            
		            var dataParser = null;
		            if(thisObj.webServiceType=='xml') {
		            	dataParser = new Utils.data.XmlParser();
		            }
		            else if(thisObj.webServiceType=='json') {
		            	dataParser = new Utils.data.JSONParser();
		            }
		            
		            resultObject = dataParser.parseData(data);
					
		        }
		        catch (ex) {
		            errorMessage = {
		                status: 'fail',
		                message: 'Invalid returned data format',
		                url: _request.dataName
		            };
		
		            if (_request.errorCallback) {
		                _request.errorCallback(errorMessage);
		            }
		        }
		        successCallback(resultObject);
		        /*
		        try {
		        	successCallback(resultObject);	
		        }
		        catch(ex) {
		        	console.log("===catch");
		        	errorMessage = {
		                status: 'fail',
		                message: 'Failed in callback function processing',
		                error: ex,
		                url: _request.dataName
		            };
		
		            if (_request.errorCallback) {
		                _request.errorCallback(errorMessage);
		            }
		        }
		        */
		        
		        
		    };
		})(request, this);
		
		var onFailed = (function(_request, thisObj) {
			
			return function (jqXHR, error, data) {
				console.log("===onFailed " + data + " / " + jqXHR + "/ " + error);
		        try {
		            _deleteRequest(_request, thisObj);
		            
		            // Check the return code
		            switch (jqXHR.status) {
		                case 0:     // Aborted
		                    if (!_request.wasForcedAborted) {
		                        var errorMessage = {
		                            status: 'timeout',
		                            message: 'The server could not be reached. This may be due to poor network access. Please try again later'
		                        };
		
		                        if (errorCallback) {
		                            errorCallback(errorMessage);
		                        }
		                    }
		                    break;
		                case 403:   // Session timed out
		                    if (this.sessionExpiredCallback)
		                        this.sessionExpiredCallback();
		                    break;
		                default:    // General Error
		                    var errorMessage = {
		                        status: 'fail',
		                        message: 'An unexpected error has occurred. Please try again later.'
		                    };
		
		                    // NOTE: This is NOT a bug. If the success callback exists, we force an error callback.
		                    if (_request.successCallback)
		                        _request.errorCallback(errorMessage);
		                    break;
		            }
		        }
		        catch (ex) {
		            var errorMessage = {
		                status: 'fail',
		                message: 'An unexpected error has occurred. Please try again later.'
		            };
		
		            if (_request.errorCallback) {
		                _request.errorCallback(errorMessage);
		            }
		        }
		    };
		
		})(request, this);
		
		if(getOrPost == "GET" && !this.enableCache) {
			if(params !== undefined && params !== null)
				params.time = new Date().getTime();	
		}
		
		var urlTemp = null;
		if(url !== undefined && url !== null)
			urlTemp = url.toLowerCase();
		var ajaxSetting = {
	        url: urlTemp,
	        data: params,//(getOrPost.toUpperCase() === 'POST') ? JSON.stringify({ data: JSON.stringify(params) }) : params,
	        type: getOrPost,
	        //contentType: contentType,
	        dataType: dataType,
	        success: onSuccess,
	        error: onFailed
	    }
	    
	    if (settings) $.extend(ajaxSetting, settings);
	    
	    // Make the request
        request.serviceCall = $.ajax(ajaxSetting);
        
	    return request;
	};
	
	this._callService = function (url, params, verb, successCallback, errorCallback, settings) {
	    var that = this;
		var request = this.createRequest(this.serviceType, url, params, verb, successCallback, errorCallback, settings);
	    // If there is a request in progress, highjack it
	    if (that.requests[url]) {
	        that.requests[url].successCallback = successCallback;
	        that.requests[url].errorCallback = errorCallback;
	        return;
	    }
	
	   
	
	    // Add the request to our dictionary.
	    that.requests[request.dataName] = request;
	};
	this._abortRequest = function (dataName) {
	    var that = this;
	
	    if (dataName && that.requests && that.requests[dataName]) {
	        var request = that.requests[dataName];
	        request.wasForcedAborted = true;
	        request.serviceCall.abort();
	    }
	};
	var _deleteRequest = function (request, thisObj) {
	   
	    if (request && request.dataName) {
	        delete thisObj.requests[request.dataName];
	    }
	};
	this.initialize(options);
};
 
/**
 * Template Manager class. The code is based on
 * http://ejohn.org/blog/javascript-micro-templating/
 * 
 * @class PF.Template.TemplateManager
 * @module PF.Template
 */
Utils.data.templateManager = (function() {
	/**
	 * render HTML from template and params
	 * 
	 * @param {String}  templateId templateID of the template in the
	 * current document
	 *            
	 * @param {object} data params to put into the template
	 *            
	 * @method renderTemplate
	 * @return the generated HTML output from the template
	 */
	var renderTemplate = function(templateId, data) {
		var str = document.getElementById(templateId).innerHTML;
		var fn =
		// Generate a reusable function that will serve as a
		// template generator
		new Function("obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};"
						+

						// Introduce the data as local variables
						// using with(){}
						"with(obj){p.push('"
						+

						// Convert the template into pure JavaScript
						str.replace(/[\r\t\n]/g, " ").split("<#")
								.join("\t")
								.replace(/\/\/.*\n/g,"")
								.replace(/((^|#>)[^\t]*)'/g, "$1\r")
								.replace(/\t=(.*?)#>/g, "',$1,'")
								.split("\t").join("');")
								.split("#>").join("p.push('")
								.split("\r").join("\\'")
						+ "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};

	return {
		renderTemplate: renderTemplate
	};
})();