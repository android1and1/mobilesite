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
		this.box = document.createElement('DIV');
		this.box.style.height = "88%";
		this.buttonArea = document.createElement('DIV');
		this.buttonArea.style.cssText = "position:relative;bottom:5px%;text-align:center;padding:.9em;";


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
};//end of prototype.

function CommonTable(data){//need data is 'CSV' format.
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
		this._show(0,data.length);	
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
};//prototype end
