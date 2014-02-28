/* comment */
Mobile={
	getWH : function() {
		var w=(window.innerWidth)?window.innerWidth:(document.documentElement && document.documentElement.clientWidth)?document.documentElement.clientWidth:document.body.offsetWidth;
		var h=(window.innerHeight)?window.innerHeight:(document.documentElement && document.documentElement.clientHeight)?document.documentElement.clientHeight:document.body.offsetHeight;
		return {w:w,h:h};
	},
	version:"1.0"
}; 
