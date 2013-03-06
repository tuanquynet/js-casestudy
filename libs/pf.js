/** =============== Array utilities function ======== * */
// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

/**
 * The root namespace of Pyco JS Framework
 * 
 * @class PF
 * @module PF
 */
PF = (function() {
	var getClassInfo = function(className) {
		var parts = className.split('.');
		var metadata = {};
		metadata.className = className;
		var namespaceString = '';
		if (parts.length > 1) {
			metadata.className = parts.pop();
			namespaceString = parts.join('.');
			metadata.namespace = ns(namespaceString);
		} else {
			metadata.namespace = window;
		}
		return metadata;
	};
	var createBaseClass = function() {
		return function() {
			if (this.parent && this.parent.initialize) {
				this.parent.initialize.apply(this, arguments);
			}
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}
		};
	};
	var ns = function(nsString) {
		var parts = nsString.split('.');
		var parent = window;
		var currentPart = '';

		for (var i = 0, length = parts.length; i < length; i++) {
			currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}
		return parent;
	};
	var mixin = function(object, config) {
		var prop = 0;
		if (object && config) {
			if (typeof config === 'object') {
				for (prop in config) {
					object.prototype[prop] = config[prop];
				}
			} else if (typeof config === 'function') {
				
				for (prop in config.prototype) {
					object.prototype[prop] = config.prototype[prop];
				}
				for (prop in config) {
					object[prop] = config[prop];
				}
			}
		}
		return object;
	};
	var extend = function(subClass, superClass) {
		var parentInstance = new superClass();
		var oldProperties = subClass.prototype;
		subClass.prototype =  parentInstance;
		subClass.prototype.constructor = subClass;
		subClass.prototype.parent = [];
		subClass.prototype.parent.constructor = superClass;
		subClass.prototype.parent.instance = parentInstance;
		subClass.prototype.parent.proto = superClass.prototype;
		
		
		
		for(var prop in oldProperties) {
			subClass.prototype[prop] = oldProperties[prop]; 
		}

		
	};
	var createFuncFromLiteral = function(literal) {
		var F = function() {
			
		};
		mixin(F, literal);
		return F;
	};
	var createMixin = function(func, mixinOptions) {
		var mixinClassMetaData, mixinClass;
		var funcMixin;
		if (typeof mixinOptions == 'array') {
			
			for (var i = 0; i < mixinOptions.length; i++) {
				mixinClassMetaData = getClassInfo(mixinOptions[i]);
				mixinClass = mixinClassMetaData.namespace[mixinClassMetaData.className];
				funcMixin = new mixinClass();
				mixin(func, funcMixin);
			}
		} else if (typeof mixinOptions == 'string') {
			
			mixinClassMetaData = getClassInfo(mixinOptions);
			mixinClass = mixinClassMetaData.namespace[mixinClassMetaData.className];
			funcMixin = new mixinClass();
			mixin(func, funcMixin);
		}
	};
	return {
		/**
		 * Information of the framework (version, name, author, contacts)
		 * 
		 * @property info
		 * @type String
		 * 
		 */
		info : {
			version : '1.0',
			name : 'PycoJS Framework',
			author : 'Pyco F&M team',
			contacts : ['quy.tran@vn.pyramid-consulting.com',
					'cuong.vu@vn.pyramid-consulting.com',
					'khoa.tran@vn.pyramid-consulting.com']
		},
		/**
		 * Function to define a namespace
		 * @method namespace
		 * @param {String}  namespace Namespace string.
		 */
		namespace: ns,
		/**
		 * Function to implement the mixin pattern
		 * @method mixin
		 * @param {Function}  subClass Subclass function
		 * @param {Function}  mixinClass MixinClass function
		 */
		mixin: mixin,
		/**
		 * Function to extend a class
		 * @method extend
		 * @param {Function}  subClass Subclass function
		 * @param {Function}  superClass SuperClass function
		 */
		extend: extend,
		/**
		 * Function to define a class
		 
  		You have 2 styles to define a class
		  
		  Style 1: using function
		  
		  PF.def({
				type : 'pyco.app.People'
			}, function() {
				this.fullName = '';
				this.sayHello = function() {
					console.log('Hello World. My name is: ' + this.fullName);
				};
				this.initialize = function(name) {
					this.fullName = name;
				};

			});
		  
		  
		  Style 2: Literal style
		  
		  PF.def({
				type : 'pyco.app.People'
			}, {
				fullName : '',
				sayHello : function() {
					console.log('Hello World. My name is: ' + this.fullName);
				},
				initialize : function(name) {
					this.fullName = name;
				}
			});

		  
		  @method def
		  @param {object}  options Parameters to define a class.
		            
		  
		  In the options, you can define: 
		  
		  + type (String): Required. Full class name includes the namespace. 
		  
		  + extend (String): Optional. Full class name of the parent class that we want to extend.
		  
		  + mixin (String): Optional. Full class name of the Mixin class that we want to merge
		  (using Mixin pattern).		
		 * 
		 * @param {object/function} func Literal object OR function object - which implements
		 * features of the class.
		 * 
		 * @return {Function} The Javascript function that defines the "Class"
		 * 
		 */
		def : function(options, funcObj) {
			var extendClassMetaData;
			var extendClass;
			
			var metadata = getClassInfo(options.type);
			
			var F = null;
			var func = funcObj;
			if(typeof func == 'object') {
				func = createFuncFromLiteral(func);
			}
			if (options.extend) {
				if(func) {
					F = function() {
						func.call(this);
						if(this.initialize) {
							this.initialize.apply(this, arguments);	
						}
					};
				}
				else {
					F = function() {
						if (this.parent && this.parent.instance.initialize) {
							this.parent.instance.initialize.apply(this, arguments);
						}
					};
				}
				extendClassMetaData = getClassInfo(options.extend);
				extendClass = extendClassMetaData.namespace[extendClassMetaData.className];
				extend(F, extendClass);
			} else {
				F = createBaseClass();
				if (func) {
					extend(F, func);
				}
			}
			if (options.mixin) {
				
				createMixin(F, options.mixin);
			}
			
			metadata.namespace[metadata.className] = F;
			return metadata.namespace[metadata.className];
		}
	};
	
	
})();

/**
 * The singleton object of the PF.View.TemplateManager in the framework.
 * 
 * @property templateManager
 * @type PF.View.TemplateManager
 * 
 */
PF.templateManager = null;
/**
 * The singleton object of the PF.Event.EventManager in the framework.
 * 
 * @property eventManager
 * @type PF.Event.EventManager
 * 
 */

PF.eventManager = null;

PF.namespace('PF.Event');
/**
 * ObserverMixin class. This class is used as an mixin object that you can put
 * into mixin syntax when defining a class. Using ObserverMixin, your class can
 * use methods of Observer pattern (addListener, fireEvent)
 * 
 * @class PF.Event.ObserverMixin
 * @module PF.Event
 */

PF.Event.ObserverMixin = function() {
	if(typeof this.eventListeners == 'undefined') {
		this.eventListeners = new Array();
	}
};

/**
 * Add a listener to listen a specific event.
 * 
 * @param {String} eventName Event name
 *            
 * @param {object} listenerObj Listener object
 *            
 * @param {String} functionName name of listener object which is used
 * to catch the event.
 *            
 * @method addListener
 */
PF.Event.ObserverMixin.prototype.addListener = function(eventName, listenerObj, functionName) {
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

/**
 * Remove a listener object out of the listener queue of an
 * event.
 * 
 * @param {String} eventName Event name
 * @param {object} listenerObj Listener object
 * @method removeListener
 */
PF.Event.ObserverMixin.prototype.removeListener = function(eventName, listenerObj) {
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
		Array.remove(this.eventListeners[eventName], foundIndex);
	}
};
/**
 * Remove all listener objects of an event
 * event.
 * 
 * @param {String} eventName Event name
 *            
 * @method removeAllListeners
 */
PF.Event.ObserverMixin.prototype.removeAllListeners = function(event) {
	this.eventListeners[event] = [];
};
/**
 * Fire the event.
 * 
 * @param {String} event event name
 *            
 * @param {object} eventDataObj data of the event
 *            
 * @method fireEvent
 */

PF.Event.ObserverMixin.prototype.fireEvent = function(eventName, eventDataObj) {
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

/**
 * EventManager class. This class is used for the event subscribing pattern.
 * In most of case, we access instance of this class via: PF.eventManager
 
Example of using EventManager

			
			PF.def({
				type : 'pyco.app.Man',
			}, {
				raiseSalary : function(salary) {
					console.log('I have been raised 1$ this month');
					PF.eventManager.fireEvent(this, 'RaiseSalary', salary);
				}
			});

			PF.def({
				type : 'pyco.app.Woman',
			}, {
				knowHusbandSalary : function(eventData) {
					console.log('I know that my husband getting raised for ' + eventData.data + "$");
				},
				initialize : function() {
					PF.eventManager.subscribe('RaiseSalary', this, 'knowHusbandSalary');
				}
			});

			var cuong = new pyco.app.Man('Cuong');
			var cuongWife = new pyco.app.Woman('Cuong-Wife');
			cuong.raiseSalary(1);
 
 
 
 
 * @class PF.Event.EventManager
 * @module PF.Event
 */
PF.Event.EventManager = function() {
	this.eventListeners = new Array();
};
/**
 * Unsubscribe the event. Remove object from the listener queue
 * of an event
 * 
 * @param {String}  event Event name
 * @param {object} listenerObj Listener object
 * @method unsubscribe
 */
PF.Event.EventManager.prototype.unsubscribe = function(event, listenerObj) {
	var arrayLength = this.eventListeners[event].length;
	var i, foundIndex;
	if (arrayLength == 0)
		return;
	foundIndex = -1;
	for (i = 0; i < arrayLength; i++) {
		if (this.eventListeners[event][i].obj === listenerObj) {
			foundIndex = i;
			break;
		}
	}
	if (foundIndex >= 0) {
		Array.remove(this.eventListeners[event], foundIndex);
	}
};


/**
 * Remove all listener objects of an event.
 * @param {String} eventName Event name
 * @method removeAllListeners
 */
PF.Event.EventManager.prototype.removeAllListeners = function(event) {
	this.eventListeners[event] = [];
};
/**
 * Fire the event.
	
	Example of using this method:
		 
	PF.def({
		type : 'pyco.app.Man',
	}, {
		raiseSalary : function(salary) {
			console.log('I have been raised 1$ this month');
			PF.eventManager.fireEvent(this, 'RaiseSalary', salary);
		}
	});

 * @param {object} sender the object which raised the event
 * @param {String} event event name
 * @param {object} data data of the event
 *            
 * @method fireEvent
 */
PF.Event.EventManager.prototype.fireEvent = function (sender, event, data) {
    var eventData = {};
    eventData.sender = this;
    eventData.name = event;
    eventData.data = data;


    if (this.eventListeners == undefined) {
        this.eventListeners = new Array();
    }

    if (this.eventListeners[event] == undefined) {
        return;
    }    
    
    for (var listenerIterator in this.eventListeners[event]) {
        var listenerObj = this.eventListeners[event][listenerIterator];
        if (listenerObj && listenerObj.obj) {            
            listenerObj.obj[listenerObj.functionName].apply(
					listenerObj.obj, [eventData]);
        }
    }
};
/**
 * Subscribe the event
 
Example of using this method:
 
PF.def({
	type : 'pyco.app.Woman',
}, {
	knowHusbandSalary : function(eventData) {
		console.log('I know that my husband getting raised for ' + eventData.data + "$");
	},
	initialize : function() {
		PF.eventManager.subscribe('RaiseSalary', this, 'knowHusbandSalary');
	}
});
 
 * @param {object} listenerObj Listener object
 * @param {String} event Event name to raise
 * @param {String} functionName name of listener object which is used
 * to catch the event.
 *            
 * @method subscribe
 */
PF.Event.EventManager.prototype.subscribe = function (listenerObj, event, functionName) {
    var listener = {};
    if (typeof this.eventListeners[event] == 'undefined') {
        this.eventListeners[event] = [];
    }

    listener.obj = listenerObj;
    listener.functionName = functionName;
    this.eventListeners[event].push(listener);
};


PF.eventManager = new PF.Event.EventManager();

PF.namespace('PF.Template');
/**
 * Template Manager class. The code is based on
 * http://ejohn.org/blog/javascript-micro-templating/
 * 
 * @class PF.Template.TemplateManager
 * @module PF.Template
 */
PF.Template.TemplateManager = function() {
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
	this.renderTemplate = function(templateId, data) {
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

};

PF.templateManager = new PF.Template.TemplateManager();


PF.namespace('PF.Util');
PF.Util.createDelegate = function(object, method)
{
	 var delegateMehod =  function()
	 {                  
	    return method.apply(object, arguments);
	 };
	 return delegateMehod;
};



PF.namespace('PF.Data');
 /**
 * This class is used for parsing JSON data from JSON string
 * @class PF.Data.JSONParser
 * @module PF.Data
 */

PF.Data.JSONParser = function() {
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
 * @class PF.Data.XmlParser
 * @module PF.Data
 */
 PF.Data.XmlParser = function() {

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

	var webService = new PF.Data.WebService({format:'json', enableCache: true});
 * @class PF.Data.WebService
 * @module PF.Data
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
 PF.Data.WebService = function(options) {
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

		var webService = new PF.Data.WebService({format:'json', enableCache: true});
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

		var webService = new PF.Data.WebService({format:'json', enableCache: true});
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
		            	dataParser = new PF.Data.XmlParser();
		            }
		            else if(thisObj.webServiceType=='json') {
		            	dataParser = new PF.Data.JSONParser();
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
	    
	    ajaxSetting.beforeSend = function(xhr) {
	    		var base64 = '';
	    		var auth = PF.Data.WebService.globalSettings.authInfo;
				var base64 = $.base64.encode(auth.username + ":" + auth.password);
				
				xhr.setRequestHeader("Authorization", "Basic " + base64);
		}
	    
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
 
PF.Data.WebService.globalSettings = {authInfo: {}};