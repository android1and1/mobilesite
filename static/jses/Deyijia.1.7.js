/* 
* DOMhelp version 2.6
* new invisit 2013/11
* author Alan Dershowitz fatman.fellow5.cn root@fatman.fellow5.cn
* distribution date 2012-12-14
* after join 3 methods:getElement,shake,fadeOut,version from 2.5 to 2.6 
* I notice that:in Windows and Linux,occurs a small trouble 
* during send file to another,
* always use 'unix2dos','dos2unix' transimite,it is boiling.
* a good idea is 'only' edit this sciprt in Eclipse 
* or something like editor,choice charset=utf8
* but a best way is use git-- a version control tool.
*/

DOMhelp = {
	debugWindowId : 'debugWindow',

	init : function() {
		if (!document.getElementById || !document.createTextNode) {
			return;
		}
	},

	lastSibling : function(node) {
		var tempObj = node.parentNode.lastChild;
		while (tempObj.nodeType != 1 && tempObj.previousSibling != null) {
			tempObj = tempObj.previousSibling;
		}
		return (tempObj.nodeType == 1) ? tempObj : false;
	},

	firstSibling : function(node) {
		var tempObj = node.parentNode.firstChild;
		while (tempObj.nodeType != 1 && tempObj.nextSibling != null) {
			tempObj = tempObj.nextSibling;
		}
		return (tempObj.nodeType == 1) ? tempObj : false;
	},

	getText : function(node) {
		if(node==null)
			return false; //add by lessDe.2012.05
		if (!node.hasChildNodes()) {
			return false;
		}
		var reg = /^\s+$/;
		var tempObj = node.firstChild;
		if(!tempObj)
			return false;//add by lessDe.2012.05
		while (tempObj.nodeType != 3 && tempObj.nextSibling != null
				|| reg.test(tempObj.nodeValue)) {
			tempObj = tempObj.nextSibling;
		}
		return tempObj.nodeType == 3 ? tempObj.nodeValue : false;
	},
	

	setText : function(node, txt) {
		if (!node.hasChildNodes()) {//
			return false;
		}
		var reg = /^\s+$/;
		var tempObj = node.firstChild;
		while (tempObj.nodeType != 3 && tempObj.nextSibling != null
				|| reg.test(tempObj.nodeValue)) {
			tempObj = tempObj.nextSibling;
		}
		if (tempObj.nodeType == 3) {
			tempObj.nodeValue = txt;
		} else {
			return false;
		}
	},

	createLink : function(to, txt) {
		var tempObj = document.createElement('a');
		tempObj.appendChild(document.createTextNode(txt));
		tempObj.setAttribute('href', to);
		return tempObj;
	},
	
	createTextElm : function(elm, txt) {
		var tempObj = document.createElement(elm);
		tempObj.appendChild(document.createTextNode(txt));
		return tempObj;
	},

	closestSibling : function(node, direction) {
		var tempObj;
		if (direction == -1 && node.previousSibling != null) {
			tempObj = node.previousSibling;
			while (tempObj.nodeType != 1 && tempObj.previousSibling != null) {
				tempObj = tempObj.previousSibling;
			}
		}
		else if(direction == 1 && node.nextSibling != null)
		{
			tempObj = node.nextSibling;
			while (tempObj.nodeType != 1 && tempObj.nextSibling != null) {
				tempObj = tempObj.nextSibling;
			}
		}
		return tempObj.nodeType == 1 ? tempObj : false;
	},

	initDebug : function() {
		if (DOMhelp.debug) {
			DOMhelp.stopDebug();
		}
		DOMhelp.debug = document.createElement('div');
		DOMhelp.debug.setAttribute('id', DOMhelp.debugWindowId);
		document.body.insertBefore(DOMhelp.debug, document.body.firstChild);
	},

	setDebug : function(bug) {
		if (!DOMhelp.debug) {
			DOMhelp.initDebug();
		}
		DOMhelp.debug.innerHTML += (bug + '\n');
	},

	stopDebug : function() {
		if (DOMhelp.debug) {
			DOMhelp.debug.parentNode.removeChild(DOMhelp.debug);
			DOMhelp.debug = null;
		}
	},

	getKey : function(e) {
		if (window.event) {//IE event
			var key = window.event.keyCode;
		} else if (e) {//Firefox,Safari,Opera,Chrome
			var key = e.keyCode;
		}
		return key;
	},

	getTarget : function(e) {
		
		var target = window.event ? window.event.srcElement : e ? e.target : null;
		if (!target) {
			return false;
		}
		while (target.nodeType != 1 && target.nodeName.toLowerCase() != 'body') {
			target = target.parentNode;
		}
		return target;
	},

	stopBubble : function(e) {
		if (window.event && window.event.cancelBubble) {
			window.event.cancelBubble = true;
		}
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
	},

	stopDefault : function(e) {
		if (window.event && window.event.returnValue) {
			window.event.returnValue = false;
		}
		if (e && e.preventDefault) {
			e.preventDefault();
		}
	},

	cancelClick : function(e) {
		if (window.event) {
			window.event.cancelBubble = true;
			//window.event.returnValue = false;
			window.event.preventDefault();
		}
		if (e && e.stopPropagation && e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
	},

	
	//Heilmann said this method was written by Scott Andrew
	addEvent : function(elm, evType, fn, useCapture) {
		if (elm.addEventListener) {
			elm.addEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.attachEvent) {
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		} else {
			elm['on' + evType] = fn;
		}
	},

	
	cssjs : function(a, o, c1, c2) {
		switch (a) {
		case 'swap':
			
			if (o.className != DOMhelp.cssjs('check', o, c1)) {
				o.className=o.className.replace(c2, c1);
			}else{
				o.className =o.className.replace(c1, c2);
			}
			break;
		case 'add':
			if (!DOMhelp.cssjs('check', o, c1)) {
				o.className += o.className ? (' ' + c1) : c1;
			}
			break;
		case 'remove':
			var rep = o.className.match(' ' + c1) ? (' ' + c1) : c1;
			o.className = o.className.replace(rep, '');
			break;
		case 'check':
			var found = false;
			var temparray = o.className.split(' ');
			for ( var i = 0; i < temparray.length; i++) {
				if (temparray[i] == c1) {
					found = true;
				}
			}
			return found;
			break;
		}
	},

	safariClickFix : function() {
		return false;
	},

	//two ways of DOMhelp.js now together
	//since 2012-05-12
	
	/* written by lessde 2012-05 */
	oddInTag:function(tagname){
		var gets = document.getElementsByTagName(tagname);
		//alert('DOMhelp says: '+gets.constructor);
		var result = new Array();
		for(index in gets){
			if(index%2==0)
				continue;
			result.push(gets[index]);
		}
	//	alert('DOMhelp.oddInTag says: '+gets.constructor);
		return result;
	},
	/* written by lessde 2012-05 */
	evenInTag:function(tagname){
		//var node_type_object;
		var gets = document.getElementsByTagName(tagname);
		var result = new Array();
		for(index in gets){
			if(index%2!=0)
				continue;
			result.push(gets[index]);
			//node_type_object = gets[index].cloneNode(true);
		//	result.push(node_type_object);
		}
		//for(index in result){alert(result[index].nodeName);}
		//alert(typeof(result));
		return result;
	},
	
	/* this method import from 'beginning JavaScript(edition3)' */
	whichBrowser:function(){
		var browser = "Unknown";
		var version = "0";
		//NN4+
		if(document.layers){
			browser="NN";
			version="4.0";
		}
		if(navigator.securityPolicy){
			version = "4.7+";
		}
		else if(document.all){
			browser = "IE";
			version ="4";
		}
		//IE5+
		if(window.clipboardData){
			browser = "IE";
			version = "5+";
		}
		//Firefox/NN6+
		else if(window.sidebar){
			browser = "Firefox";
			version = "9+";
		}
		else if(navigator.userAgent.indexOf("Opera")>=0){
			browser ="Opera";
			version = "9+";
		}
		else if(navigator.userAgent.indexOf("Safari")>=0){
			browser ="Safari";
			version = "3.0+";
		}
		return "browser is: " + browser + " version: " + version;
	},
	/**
	// written by David Flanagan
	// make(tagname,attributes,children):
	//   Create an element with specified tagname,attributes,and children
	// The attributes argument is a JavaScript object:the name and values of its
	
	// properties are taken as the names and values of the attributes to set.
	
	// If attributes is null,and children is an array or a string,the attributes 
	// can be omitted altogether and the children passed as the second argument.
	//
	// The children argument is normally an array of children to be added to 
	// the created element. If there are no children,this argument can be
	// omitted,If there is only a single child,it can be passed directly
	// instead of being enclosed in an array.(But if the children is not a string
	// and no attributes are specified,an array must be used.)
	//
	// Example: make("p",["This is a ",make("b","bold")," word."]);
	//
	// Inspired by the MochiKit library(http://mochikit.com)by Bob Ippolito
	
	 */
	make:function(tagname,attributes,children){		
		//If We were invoked with two arguments,the attributes argument is 
		//an array or string;it should really be the children arguments.
		if(arguments.length == 2 && 
				(attributes instanceof Array || typeof attributes == 'string')){
			children = attributes;
			attributes = null;
		}
		//Create the element
		var e = document.createElement(tagname);
		
		//Set attributes
		if(attributes){
			for(var name in attributes)e.setAttribute(name,attributes[name]);
		}
		
		//Add children,if any were specified.
		if(children != null){
				if(children instanceof Array){//If it really is an Array
					for(var i=0;i<children.length;i++){//Loop through kids
						var child = children[i];
						if(typeof child == 'string')//Handle text nodes
							child = document.createTextNode(child);
						e.appendChild(child);//Assume anything else is a Node
					}
				}
				else if(typeof children == 'string')//Handle single text child
					e.appendChild(document.createTextNode(children));
				else e.appendChild(children);//Handle any other single child
		}
		
		//Finally,return the element
		return e;
	},
	
	/**
	 * maker(tagname):return a function that calls make() for the specified tag.
	 * Example: var table = maker("table"),tr=maker("tr"),td=maker("td");
	 */
	maker:function(tag){
		return function(attrs,kids){
			if(arguments.length == 1)
				return make(tag,attrs);//if 'attrs' is empty,in define of 'make()'
			//it will 'return e;',DAVID is elegant.
			else return make(tag,attrs,kids);
		}
	},
	/**
	*  2012-12-14 add 3 funcs: getElements()/shake()/fadeOut()
	*  they are wiritten by David Flanagan.<Javascript:The Definitive Guide,Edition 6>
	*/
	getElements:function(){
		var elements = {};
		for(var i=0;i<arguments.length;i++){
			var idName = arguments[i];
			var elt = document.getElementById(arguments[i]);
			if(elt==null)throw new Error("Not Element Named " + idName);
			elements[idName]=elt;
		}
		return elements;
	},
	shake:function(e,oncomplete,distance,time){
		/* cadillac phone:15316994149 */
		if(!time)time=500;
		if(!distance)distance=5;
		var origin = e.style.cssText;
		e.style.position = "relative";
		var start = (new Date()).getTime();
		animate();
		function animate(){
			var now = (new Date()).getTime();
			var elapsed = now - start;
			var fraction = elapsed/time;
			if(fraction < 1){
				var x = distance * Math.sin(fraction*4*Math.PI);
				e.style.left = x + "px";
				setTimeout(animate,Math.min(25,time-elapsed));
			}else{
				e.style.cssText = origin;
				if(oncomplete)oncomplete(e);
			}
		}
	},

	fadeOut:function(e,oncomplete,time){
		if(typeof e==="string")e=document.getElementById(e);
		if(!time)time=500;
		var ease = Math.sqrt;
		var start = (new Date()).getTime();
		animate();
		function animate(){
			var elapsed = (new Date()).getTime() - start;
			var fraction = elapsed/time;
			if(fraction<1){
				var opacity = 1 - ease(fraction);
				//only IE not supported 'opacity' attr!
				if(navigator.appName!=='Microsoft Internet Explorer')
					e.style.opacity = String(opacity);
				else
					e.style.filter="alpha(opacity=" + opacity * 100 + ")";
				setTimeout(animate,Math.min(25,time-elapsed));
			}else{
				if(navigator.appName!=='Microsoft Internet Explorer')
					e.style.opcity="0";
				else
				{	e.style.filter="alpha(opacity=0)" ;e.style.display="none";}
				if(oncomplete)oncomplete(e);
			}
		}
	},

	//Notice that:
	//if getACookieValue('expires') will return a GMT time,you need transe it 
	//to locale time format.
	getACookieValue : function(key){
		var list = document.cookie.split(';');
		for(var i=0;i<list.length;i++){
			var pos = list[i].indexOf(key);
			if(pos!=-1)
				return decodeURIComponent(list[i].substr(pos+key.length+1));
		}
		return null;
	},

	//20131128 added:1,_setExpires,2,_addCookie,3,_getACookieValue
	setExpires : function(hours){
		var current = new Date();
	//3600=60min * 60sec;1000millisecs=1sec
		till = (new Date(current.getTime() + hours * 3600 * 1000)).toGMTString();
		document.cookie='expires='+till;	
	},
//Notice that,'expires' is a number means how many HOURS.
	addCookie : function(name,value,expires){
		if(expires>0)
			DOMhelp.setExpires(expires);
		document.cookie=name+'='+encodeURIComponent(value);
	},
	getWH:function(elm){
		//show width,height
		return {
			w:elm.clientWidth,
			h:elm.clientHeight
		}
	},
	getCoordinate:function(elm){
		ori_x = elm.offsetLeft;
		ori_y = elm.offsetTop;
		cur = elm.offsetParent;
		while(cur != null){
			ori_x += cur.offsetLeft;
			ori_y += cur.offsetTop;
			cur = cur.offsetParent;
		}
		return {
				left:ori_x,
				top:ori_y
			}
	},

	//check if window's cookie or sessionStorage contains USER info.
	//if not ,will goto login.html
	//login.html knows which page is query login,after authenicate,
	//login.html will return from page.
	checklogin : function(){
		var now = (new Date()).getTime();
		var user;
		if(!getUser()){
			var pat = new RegExp("^http://[^/]+/");
			// only fit test,if domain is register,must change below
			var url = document.URL.replace(pat,'http://192.168.0.110/');
			//var url = document.URL
			//Check Which Mechism Browser Support.
			if(document.cookie !== undefined){
				DOMhelp.addCookie('login_request_from',url);
			}
			else if(window.sessionStorage !== undefined){
				sessionStorage['login_request_from'] = url;
			}else{ alert('It Is Crazy Thing.')}

			//Go To Login Page
			document.location.replace('/static/login.html');
		}else{//case login SUCCESS.
			if(document.cookie!==undefined){
				user = DOMhelp.getACookieValue('user');
			}else if(window.sessionStorage!==undefined){
				user = sessionStorage['user'];
			}
			//store some login info in locale storage.
			if(window.localStorage !== undefined){
				var title = document.URL.substr(document.URL.lastIndexOf('/') + 1);
				localStorage['_' + title + '_' + now] = JSON.stringify({'page':document.URL,'user':user , 'login_time':now}); 
			}
		}
		function getUser(){
			//see if support cookie.
			if(document.cookie !== undefined){
				if(DOMhelp.getACookieValue('user')){
					return true;
				}else{
					return false;
				} 
			//browser not support cookie but support local storage/session.
			}else if(window.sessionStorage !== undefined){
				if(sessionStorage.getItem('user')){
					return true;
				}else{
					return false;
				}
			}else{
				user = 'no_login_user';
				alert('Your Browser Does Not Support Cookie Or Local Storage,So Some Operation Is Disable.');
				return true;
			}
		}//end of GETUSER()
	}//end of CHECKLOGIN()

}//end of DOMhelp module.

/*
* object HTTP
* thanks for David Flanagan 
*
* real name maybe is 'Ajax_functions' or 'Ajax_tools',currently 1.0
* This is a list of XMLHttpRequest creation factory function to try
* **** NOTICE **** 
* must check if browser support ajax or javascript.
* so do like this: var request = HTTP.newRequest();if(request){//code..}
*
*/

HTTP={};
HTTP._factories = [
	function(){return new XMLHttpRequest();},
	function(){return new ActiveXObject("Msxml2.XMLHTTP");},
	function(){return new ActiveXObject("Microsoft.XMLHTTP");}
];
//when we find a factory that works,store it here.
HTTP._factory = null;

//Create and return a new XMLHttpRequest object.
//
//The first time we are called.try the list of factory functions until
//we find one that returns a non-null value and does not throw an
//exception.Once we find a working factory,remember it for later use.
//
HTTP.newRequest = function(){
	if(HTTP._factory != null)return HTTP._factory();
	for(var i=0;i<HTTP._factories.length;i++){
		try{
			var factory = HTTP._factories[i];
			var request = factory();
			if(request != null){
				HTTP._factory = factory;
				return request;
			}
		}catch(e){
			continue;
		}
	}//for loop end.

	//If we get here,none of the factory candidates succeeded.
	//so throw an exception now and for all future calls.
	HTTP._factory = function(){
		throw new Error("XMLHttpRequest not supported.");
	}
	HTTP._factory();//throw an error.

}//function define end.


/*
* Use XMLHttpRequest to fetch the contents of the specified URL using
* an HTTP GET request. When the response arrives,pass it(a plain
* text ) to the specified callback function.
* this function does not block and has no return value.
*/
HTTP.getText = function(url,callback){
	var request = HTTP.newRequest();
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status== 200)
			callback(request.responseText);
	};
	request.open("GET",url);
	request.send(null);
};

/*
* Use an HTTP HEAD request to  obtain the headers for the special url.
* When the headers arrive,parse them with HTTP.parseHeaders() and pass the
* resulting object to the specified callback function.If the server returns
* an error code,invoke the specified errorHandler function instead.If no
* error handler is specified,pass null to the callback function.
*/
HTTP.getHeaders=function(url,callback,errorHandler){
	var request = HTTP.newRequest();
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			callback(HTTP.parseHeaders(request));
		}else{
			if(errorHandler)errorHandler(request.status,request.statusText);
			else callback(null);
		}
	};
	request.open("HEAD",url);
	request.send(null);
};


/* 
* parse the response headers from an XMLHttpRequest object and return
* the header names and values as property names and values of a new object.
*/
HTTP.parseHeaders=function(request){
	var headerText = request.getAllResponseHeaders();//Text from server
	var headers = {};//This will be our return value.
	var ls = /^\s*/;  //Leading Space regular expression.
	var ts = /\s*$/; //Trailing Space regular expression.
	
	//Break the headers into lines.
	var lines = headerText.split('\n');
	// Loop through the lines.
	for(var i=0;i<lines.length;i++){
		var line = lines[i];
		if(line.length==0)continue; //skip empty lines.
		//Split each line at first colon,and trim whitespace way
		var pos = line.indexOf(":");
		var name = line.substring(0,pos).replace(ls,"").replace(ts,"");
		var value = line.substring(pos+1).replace(ls,"").replace(ts,"");
		//Store the header name/value pair in a JavaScript object.
		headers[name]=value;
	}//for loop
	return headers;
};


/*
* Send an HTTP POST request to the specified URL,using the names and values
* of the properties of the values object as the body of the request.
* parse the server's response according to its content type and pass
* the resulting value to the callback().
* If an HTTP error occurs,call the specified errorHandler function or
* pass null to the callback function if no error Handler is specified.
*/
HTTP.post = function(url,values,callback,errorHandler){
	var request = HTTP.newRequest();
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			if(request.status == 200 ){
				callback(HTTP._getResponse(request));
			}else{
				if(errorHandler)errorHandler(request.status,
					request.statusText);
				else callback(null);
			}
		}
	};
	request.open("POST",url);
	//This header tells the server how to interpret the body of the request.
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	//encode the properties of the values object and send them as
	//the body of the request.
	request.send(HTTP.encodeFormData(values));
};

/*
* case server's content-type. 
*/
HTTP._getResponse = function(request){
	//Check the content type returned by the server.
	switch(request.getResponseHeader('Content-Type')){
		case "text/xml":
		//if it is an XML document.use the parsed Document object.
			return request.responseXML;
			break;
		case "text/json":
		case "text/javascript":
		case "application/javascript":
		case "application/x-javascript":
	//If the response is JavaScript code or a JSON-encoded value,
	//call eval() on the text to "parse" it to a JavaScript value,
	//Note:only do this if the JavaScript code is from a trusted Server!
	//Otherwise,treat the response as plain text and return as a string.
			return eval('(' + request.responseText + ')'); 
			break;
		default:
			return request.responseText;
			break;
	}//switch loop.
};

/*
* Encode the property name/value pairs of an object as if they were from
* an HTML form,using application/x-www-form-urlencoded format.
*/
HTTP.encodeFormData = function(data){
	var pairs = [];
	var regexp = /%20/g;//A regular expression to match an encoded data.
	
	for(var name in data){
		var value = data[name].toString();
		//Create a name/value pair,but encode name and value first.
		//the global function encodeURIComponent does almost what want
		//but it enodes space as %20 instend of "+",we have to
		//fix that with String.replace()
		var pair = encodeURIComponent(name).replace(regexp,"+") +
				"=" + encodeURIComponent(value).replace(regexp,
				"+");
		pairs.push(pair);
	}
	//Concatenate all the name/value pairs,separating them with &
	return pairs.join('&');
};


/*
* HTTP.getTextWithScript()
* if don't want or can not use Ajax,another way is use JOSNP way:below.
* edited from David Flanagan's HTTP.getTextWithScript(
* <<JavaScript:The Definitive Guide(Edition 6)>> P498-499),thanks David.
* change arguments from 'url,callback' to 'query,callback,serverUrl'
* 2013/11/14 
*/
HTTP.getTextWithScript=function(query,callback,serverUrl){
	//Create a new script as element and add it to the document.
	var script = document.createElement('script');
	document.body.appendChild(script);
	
	//Get a unique function name.
	var funcname = "func" + HTTP.getTextWithScript.counter++;

	//Define a function with that name,using this function as a 
	//convenient namespace.The script generated on the server
	//invokes this function.
	HTTP.getTextWithScript[funcname]=function(text){
	//Pass the text to the callback function
	callback(text);

	//clean up the script tag and the generated function.
	document.body.removeChild(script);
	delete HTTP.getTextWithScript[funcname];
	}
	//Encode the URL we want to fetch and the name of the function
	//as arguments to the jsquoter.php server-side script.Set the src
	//property of the script tag to fetch the URL.
	script.src = serverUrl + "?query=" + encodeURIComponent(query) + "&func=" + encodeURIComponent("HTTP.getTextWithScript."+funcname);
}
// we use this to generate unique function callback names in case there
// is more than one request pending at a time.
HTTP.getTextWithScript.counter = 0;

/*
* Send an HTTP GET request for the specified URL.
* If a successful response is received,it is converted to an object
* based on the Content-Type header and passed to the specified callback func.
* Additional arguments may be specified as properties of the options object.
* 
* If an error response is received (e.g. a 404 Not Found Error.),
* the status code and message are passed to the options.errorHandler func.
* If no errorHandler func,the callback func is called instead with a null arg.
*
* If the options.parameters object is specified,its properties are
* taken as the names and values of request parameters.They are
* converted to a URL-encoded string with HTTP.encodeFormData() and
* are appended to the URL following with a '?'.
*
* If an options.timeout value is specified , the XMLHttpRequest
* is aborted if it has not completed before the specified number
* of milliseconds have elapsed.If the timeout elapses and an
* options.timeoutHandler is specified,that function is called with
* the requested URL as its argument.

*/
HTTP.get = function(url,callback,options){
	var request = HTTP.newRequest();
	var n=0;
	var timer;
	if(options.timeout){
		timer = setTimeout(function(){
					request.abort();
					if(options.timeoutHandler)options.timeoutHandler(url);
				},
				options.timeout);
	}
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			if(timer)clearTimeout(timer);
			if(request.status==200){
				callback(HTTP._getResponse(request));
			}else{
				if(options.errorHandler)
					options.errorHandler(request.status,
						request.statusText);
				else
					callback(null);
			}

		}else if(options.progressHandler){
			options.progressHandler(++n);
		}
	};
	
	var target = url;
	if(options.parameters)
		target+="?" + HTTP.encodeFormData(options.parameters);
	request.open("GET",target);
	request.send(null);
};

/*
* Widget is a wrapper of HTML-FORM-CONTROL-ELEMENT 
* it can wrapp <input> <select> <button> <textarea>
* written by Alan Dershowitz 2013/12/ 
*
*/
function Widget(tagName,fieldName,widget_type){
	this.tagName = tagName.toLowerCase();
	this.fieldName = fieldName.toLowerCase();
	if(widget_type)
		this.widget_type=widget_type.toLowerCase();
	else this.widget_type='';
	if(this.widget_type==='checkbox' || this.widget_type==='radio'){
		this.domNode = document.createElement('div');
	}else{
		this.domNode = document.createElement(tagName);
		this.domNode.name = this.fieldName;	
		this.domNode.type=widget_type;
	}
};

Widget.prototype = {
	boundFunc:function(eventType,func){
		DOMhelp.addEvent(this.domNode,eventType,func,false);
	},
	boundDesc:function(descText,descTagName){
		if(descTagName){
			var descElm = document.createElement(descTagName);
			descElm.appendChild(document.createTextNode(descText));
			descElm.appendChild(this.domNode);
//wonderful,look below 2 lines!it raise origial domNode to its wrapper ! 
			this.domNode = descElm;
			this.tagName = descTagName;
		}else{//it is button widget.
			if(this.tagName!=='button')return;
			this.domNode.appendChild(document.createTextNode(descText));
		}
		
	},
//content is options when its type is Array,
//content is value when its type is string.
	boundContent:function(content,defaultIndex){
		if(content instanceof Array === false)
			content=[content];
		switch(this.tagName){
			case 'select':
				for(var i=0;i<content.length;i++){ 
					if(defaultIndex===i)
						this.domNode.options.add(new Option(content[i],content[i],true,true));
					else
						this.domNode.options.add(new Option(content[i],content[i]));
					
				}
				break;
				
			case 'input':
				switch(this.widget_type){
					case 'checkbox':
					case 'radio':
						for(var i=0;i<content.length;i++){ 
							var element = document.createElement('input');
							element.name=this.fieldName;
							element.value=content[i];
							element.type=this.widget_type;
							if(defaultIndex!==null){
								if(i===defaultIndex){
									element.checked="checked";}
							}
							this.domNode.appendChild(element);
							this.domNode.appendChild(document.createTextNode(content[i]));
						}
						break;
					case 'button':
					case 'submit':
					case 'reset':
					case 'text':
						this.domNode.value=content.join("");
						break;
					
					default:
						break;
				}//inner switch block (end)
				break;
			case 'button':
				this.domNode.value=content.join("");
				break;
			case 'textarea':
				this.domNode.value = content;
				break;
			default:
				break;
		}//switch block end.	
	},
//case <input> ,must invoke setDomNodeAttrs first than this.boundDesc.
	setDomNodeAttrs : function(attrs){
		for(var i in attrs){
			this.domNode.setAttribute(i,attrs[i]);	
		}	
	},
//styles is a obj(in python it is diction.
//styleName must obey rules of css-api.
	setDomNodeStyles:function(styles){
		for(var i in styles){
			//not to do that: this.domNode.style.i (will ignore)
			this.domNode.style[i]=styles[i];
		}	
	}	
};
/*
* written by Alan Dershowitz 2013/12
*
* class CommonTale 
* class CommonArticle 
* class CommonGallary(not implement)
*
************************************************
*** CommonTable Usage: ***
************************************************
* 1,HTML-CODE
* <script src="something.js"></script><!-- table data(CSV FORMAT) -->
* <div id="tablearea"> </div>
* 2,JS-CODE
*	var table = new CommonTable(data);
*	table.init(containerId,thead_desc);
*	//pageNav (limit==20,total==100)
*	table.pageShow(20,100);
*	//full show
*	//table.fullShow();
*
************************************************
*** CommonArticle Usage: ***
************************************************
* 1,HTML-CODE
*	<script src="aarticle.js"></script><!-- article content -->
*	<div id="container"></div>  <!-- which places article -->
* 2,JS-CODE
*	var article  = new CommonArticle(data);
* article.init("container",30);//limit 1 line contains less than 30 char
*	//paged show
* article.pageShow(100);//limit 1 page contains less than 100 lines.
*
*/
function CommonArticle(data){//data is 'Plain'.
	//for mobile
	this.data = data;
	this.ps=[];
	this.container = null;
	this.box = null;
	this.buttonArea = null;
}
CommonArticle.prototype = {
//init let article has solid width(by limit chars each line.).
	init:function(containerId,limitChars){
	//get container.
		this.container = document.getElementById(containerId);
		this.container.style.cssText = "position:relative;top:0px;left:0px;width:319px;text-align:justify;height:470px;font-size:1.1em;color:silver;background:maroon;padding:.75em;margin-top:1.8em;margin-bottom:1.8em;line-height:1.3em;";

		this.box = document.createElement('DIV');
		this.box.style.height = "88%";
	//button setup
		this.buttonArea = document.createElement('DIV');
		this.buttonArea.style.cssText = "position:relative;bottom:2px%;text-align:center;padding:.9em;";


	//prepare lines(limited)
		this.createps(limitChars);//for zh_CN.


	//append All	
		this.container.appendChild(this.box);
		this.container.appendChild(this.buttonArea);
	},

	//pagedArticle transer orginal data to an Array
	//orginal data maybe is string or array.
	createps:function(limit){
//this time,i only check the recusionSubstr,this--recusionSplice need check!
		function recusionSplice(data,limit,result){
			if(data.length<=limit){
				result.unshift(data);
				return;
			}else{
				result.push(data.splice(limit,limit));
				recusionSplice(data,limit,result);
			}
		}
		function recusionSubstr(data,limit,result){
			if(data.length <= limit){
				result.push(data);
				return;
			}else{
				result.push(data.slice(0,limit));
				recusionSubstr(data.substr(limit),limit,result);
			}
		}
	//keep translated data.
		if(typeof this.data == 'string')
			recusionSubstr(this.data,limit,this.ps);
		else if(typeof this.data === 'object')
			recusionSplice(this.data,limit,this.ps);
		else
			;
	},
//start lineno,end lineno.
	_show:function(start,end){
		this.box.innerHTML = '';
		var line;
		for(var i=start;i<end;i++){
			line = (this.ps)[i]
				.replace('<','&lt;')
				.replace('>','&gt;')
				.replace('\n','<br />');
			line = (this.ps)[i];
			this.box.innerHTML += line; 
		}
	},
	fullShow:function(){
		this._show(0,this.ps.length);	
	},
	pageShow:function(limitLines){
		var CURRENT = 0;
		var previousButton = document.createElement('BUTTON');
		var nextButton = document.createElement('BUTTON');
		previousButton.appendChild(document.createTextNode('Previous'));
		nextButton.appendChild(document.createTextNode('Next'));
//append into DOM tree.
		this.buttonArea.appendChild(previousButton);
		this.buttonArea.appendChild(nextButton);
		this._show(0,limitLines);


		DOMhelp.addEvent(previousButton,'click',slide,false);	
		DOMhelp.addEvent(nextButton,'click',slide,false);	
//keep this's env.
		keepthis = this;

		function slide(e){
			var target = DOMhelp.getTarget(e);
			if(target.textContent === 'Next'){			
				var another = target.previousElementSibling;
				if(CURRENT <= (keepthis.ps.length - 2*limitLines)){
					if(CURRENT==keepthis.ps.length - limitLines)
						target.style.backgroundColor='gray';
					keepthis._show(CURRENT+limitLines,CURRENT+2*limitLines);
					CURRENT += limitLines;
				}else{
					target.style.backgroundColor='gray';
				}
				if(CURRENT>=2*limitLines){
					another.style.backgroundColor='white';
				}
			}else if(target.textContent === 'Previous'){
				var another = target.nextElementSibling;
				if(CURRENT>=2*limitLines){
					if(CURRENT==limitLines)
						target.style.backgroundColor='gray';	
					keepthis._show(CURRENT-2*limitLines,CURRENT - limitLines);
					CURRENT -= limitLines;
				}else{
					target.style.backgroundColor='gray';
				}
				if(CURRENT <= (keepthis.ps.length - 2*limitLines)){
					another.style.backgroundColor='white';
				}
			}
		}
	}
};//end of CommonArticle's prototype.


/* constructor of CommonTable
* need data is 'CSV' formate Class 
* for mobile device,table must few field,in my mind,it is must less than 4.
* if a multi-info data-format,better is do it as CommonArticle.
*/
function CommonTable(data){
	this.data = data;
	this.table = null;//Dom Node.
	this.tbody = null;
	this.thead_desc = null;
}

CommonTable.prototype = {
	setTableHead:function(thead_desc){
		if(thead_desc instanceof Array != true){
			alert('thead argument is invalid.');
			return;
		}
		else{
			this.thead_desc = thead_desc;
		}
	},
	init : function(containerId,thead_desc){//thead is 'field1,field2...'(string)
		container = document.getElementById(containerId);
		this.setTableHead(thead_desc);
		if(!container || !this.thead_desc)return false;
		//setup thead.
		this.table = document.createElement('TABLE');
		this.table.border="1";
		thead = document.createElement('THEAD');
		thead.innerHTML = '<thead><tr><th>' + this.thead_desc.join('</th><th>') + '</th></tr></thead>';
		this.table.appendChild(thead);	
		this.tbody = document.createElement('TBODY');
		this.table.appendChild(this.tbody);

		//append in DOM tree.
		container.appendChild(this.table);
		return true;
	},
	_show:function(start,end){//need data is 'CSV' format.
		this.tbody.innerHTML = '';
		for(var i=start;i<end;i++){
			if(i<0 || i>this.data.length)break;
			this.tbody.innerHTML += '<tr><td>' + this.data[i].split(',').join('</td><td>') + '</td></tr>';  
		}	
	},
	fullShow:function(){
		this._show(0,this.data.length);	
	},	
	pageShow:function(LIMIT,TOTAL){
		var CURRENT = 0;
		var nextButton = document.createElement('BUTTON');
		nextButton.appendChild(document.createTextNode('Next'));
		var previousButton = document.createElement('BUTTON');
		previousButton.appendChild(document.createTextNode('Previous'));
		this.table.parentNode.appendChild(previousButton);
		this.table.parentNode.appendChild(nextButton);
		DOMhelp.addEvent(previousButton,'click',slide,false);
		DOMhelp.addEvent(nextButton,'click',slide,false);
		this._show(0,LIMIT);
		var thisInstance = this;
		function slide(e){
			var theButton = DOMhelp.getTarget(e);
			var anotherButton;	
			if(theButton.textContent==='Next'){
				//get another button:previous.
				anotherButton = theButton.previousElementSibling;
				if(CURRENT>=TOTAL-2*LIMIT){
					theButton.style.backgroundColor='grey';
				}else{
					thisInstance._show(CURRENT+LIMIT,CURRENT+ 2*LIMIT);				
					CURRENT+=LIMIT;
				}
				if(CURRENT>2*LIMIT)
					anotherButton.style.backgroundColor='white';
			}else if(theButton.textContent==='Previous'){
				//get closestSibling(next button)
				anotherButton = theButton.nextElementSibling;
				if(CURRENT>=2*LIMIT){
					if(CURRENT==LIMIT)
						theButton.style.backgroundColor='grey';
					thisInstance._show(CURRENT-2*LIMIT,CURRENT-LIMIT);
					CURRENT-=LIMIT;
				}else{
					theButton.style.backgroundColor='grey';
				}
				if(CURRENT<TOTAL-2*LIMIT)
					anotherButton.style.backgroundColor='white';
			}else{
				alert('invalid argument.');
			}
		}//end of innerFunc --- slide()
	}
};// CommonTable's prototype end
