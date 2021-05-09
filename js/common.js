var $ = (function() {

	/*
	    GC-1756
	    The very simple jquery `like` module that only support following methods:

	    * $(function() {})
	    * $.trim()
	    * $.ajax()
	    * $.parseXML()
	    * $.parseJSON()
	    * $.extend()
	    * $("#id").appendTo(document.body)
	    * $("#id").remove()
	    * $.noop
	*/

	//XmlHttpRequest with cross browser support
	function sendRequest(url, method, data, onsuccess, onerror, timeout, retries) {
		if (timeout && typeof timeout === 'string')
			timeout = parseInt(timeout);
		if (retries && typeof retries === 'string')
			retries = parseInt(retries);

		function send() {
			var retry = function(callback) {
				if (typeof retries !== 'number' || retries < 1) {
					if (typeof callback === 'function')
						callback();
				} else {
					retries--;
					send();
				}
			}
			var req = createXMLHTTPObject();
			if (!req)
				return;
			req.open(method, url, true);
			if (timeout)
				req.timeout = timeout;
			if (data)
				req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.onreadystatechange = function(event) {
				var xhr = event.target;
				if (req.readyState != 4)
					return;
				if (req.status !== 200 && req.status !== 304) {
					retry(function() {
						if (typeof onerror === 'function')
							onerror(xhr, req.status);
					});
				} else {
					if (typeof onsuccess === 'function')
						onsuccess(req.responseXML, req.status, xhr);
				}
			}
			if (req.readyState === 4) return;
			req.send(data);
		}
		send();
	}

	var XMLHttpFactories = [
		function() {
			return new XMLHttpRequest()
		},
		function() {
			return new ActiveXObject('Msxml2.XMLHTTP')
		},
		function() {
			return new ActiveXObject('Msxml3.XMLHTTP')
		},
		function() {
			return new ActiveXObject('Microsoft.XMLHTTP')
		}
	];

	function createXMLHTTPObject() {
		var xmlhttp = false;
		for (var i = 0; i < XMLHttpFactories.length; i++) {
			try {
				xmlhttp = XMLHttpFactories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		return xmlhttp;
	}

	function ajax(e) {
		var url = e.url;
		var data = e.data || null;
		var method = e.type || (e.data ? 'POST' : 'GET');
		sendRequest(e.url, method, data, e.success, e.error, e.timeout, e.retries);
	}

	function trim(e) {
		if (typeof e === 'string')
			return e.trim();
		return '';
	}

	function ready(callback) {
		document.addEventListener('DOMContentLoaded', callback, false);
	}

	function extend() {
		for (var i = 1; i < arguments.length; i++)
			for (var key in arguments[i])
				if (arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	}

	function noop() {
		//do nothing
	}

	function parseJSON(e) {
		return JSON.parse(e);
	}

	function parseXML(e) {
		if (window.DOMParser) {
			return new DOMParser().parseFromString(e, "text/xml");
		} else { // IE
			var xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = "false";
			xml.loadXML(e);
		}
	}

	var selector = function(e) {
		if (!e)
			return;
		this.element = null;
		if (e.indexOf('#') !== -1) {
			this.element = document.getElementById(e.replace('#', ''));
		} else {
			this.elementHtml = e;
		}
	}

	selector.prototype.appendTo = function(target) {
		if (target && this.elementHtml) {
			var tmpDiv = document.createElement('div');
			tmpDiv.innerHTML = this.elementHtml;
			target.appendChild(tmpDiv.childNodes[0]);
		}
	}

	selector.prototype.remove = function() {
		if (this.element)
			this.element.remove();
	}

	var module = function(e) {
		if (typeof e === 'function') {
			ready(e);
		} else if (typeof e === 'string') {
			return new selector(e);
		}
	}

	return {
		ajax: ajax,
		trim: trim,
		extend: extend,
		noop: noop,
		parseJSON: parseJSON,
		parseXML: parseXML
	});

	return module;
});