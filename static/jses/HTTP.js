/* thanks for David Flanagan */
/*
*
* real name maybe is 'Ajax_functions' or 'Ajax_tools',currently 1.0
* This is a list of XMLHttpRequest creation factory function to try
* **** NOTICE **** 
* must check if browser support ajax or javascript.
* so do like this:  var request = HTTP.newRequest();if(request){//code..}
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
