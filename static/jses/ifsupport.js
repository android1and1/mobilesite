var report = {};
report.report = '<h1>report of this browser</h1>:';
report.tellw = function(msg){
	var info = '<p>' + msg.split(':').join('</p><p>') + '</p>';
	var repdiv = document.getElementById("deviceAttribute"); 
	repdiv.innerHTML = info;
}
report.speak = function(){
	//user agent
	report.report = navigator.userAgent + ':';
	//support applicationCache.
	if(!window.applicationCache)report.report += 'Not Support applicationCache:';
	else report.report += 'Support applicationCache:';
	//support JSON
	if(!window.JSON || !JSON.parse)report.report+='No Support Json:';
	else report.report += 'Support Json:';
	//test eventSource
	if(!window.EventSource)report.report += 'No Support EventSource:';
	else report.report += 'Support EventSource:';
	if(!window.XMLHttpRequest)report.report += 'No Support XMLHttpRequest:';
	else report.report += 'Support XMLHttpRequest:';
	//support DOM
	if(!document.createTextNode && !document.createElement)report.report += 'No Support Dom:';
	else report.report += 'Suport Dom:';
	if(!window.localStorage)report.report += 'No Support Local Storage:';
	else report.report += 'Support Local Storage:';
	//check sessionStorage
	if(!window.sessionStorage)report.report += 'No Support Session Storage:';
	else report.report += 'Support Session Storage:';
	//check viewport
	report.report += 'viewport\'s width is ' +  document.body.clientWidth + ':';
	//check cookie.
	if(typeof(document.cookie) == 'undefined')report.report += 'Not Support cookie.:';
	else report.report += 'Support cookie.:';
	//check Array.forEach
	if([1].forEach && [1].map)report.report += 'Support ECMAScript5.0.:';
	else report.report += 'Not Support ECMAScript5.0.:'; 
	
	report.tellw(report.report);
};
window.onload = report.speak;
