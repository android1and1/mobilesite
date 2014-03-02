/* 
* version 2.6
* new invisit 2013/11
* author Alan Dershowitz fatman.fellow5.cn root@fatman.fellow5.cn
* distribution date 2012-12-14
* after join 3 methods:getElement,shake,fadeOut,version from 2.5 to 2.6 
* i notice that:in Windows and Linux,occurs a small trouble 
* during send file to another,
* always use 'unix2dos','dos2unix' transimite,it is boiling.
* a good idea is 'only' edit this sciprt in Eclipse or something like editor,choice charset=utf8
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
			window.event.returnValue = false;
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
	}
}
