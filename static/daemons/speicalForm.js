/* Common Form Instance 
*
* 2013/11/23 wrriten by Alan Dershowitz.
*/

var anlyobj = {};
var elts = DOMhelp.getElements("input_item_name","input_amount","suggest","item_name_ensure","amount_ensure","add1","sub1","add10");

anlyobj.suggest=elts['suggest'];
anlyobj.input_item_name = elts['input_item_name'] //it is input widget.
anlyobj.input_amount = elts['input_amount'] //it is input widget.
anlyobj.item_name_ensure=elts['item_name_ensure'];//will raise form.
anlyobj.amount_ensure=elts['amount_ensure'];//will raise form.
anlyobj.add1=elts['add1'];
anlyobj.add10=elts['add10'];
anlyobj.sub1 = elts['sub1'];


//add event listener
DOMhelp.addEvent(anlyobj.input_item_name,'change',anlyobj.onchange_check,false);
DOMhelp.addEvent(anlyobj.item_name_ensure,'click',anlyobj.onensure,false);
DOMhelp.addEvent(anlyobj.amount_ensure,'click',anlyobj.onensure,false);
DOMhelp.addEvent(anlyobj.add1,'click',anlyobj.adjust,false);
DOMhelp.addEvent(anlyobj.add10,'click',anlyobj.adjust,false);
DOMhelp.addEvent(anlyobj.sub1,'click',anlyobj.adjust,false);



//data is global variable!!!!

anlyobj.data=['数据库错误或网络连接错误'];

anlyobj.onPageLoad = function(){
	HTTP.getTextWithScript('select id,old_id,item_name from pregood',anlyobj.callback,'/give_data.py');
}

anlyobj.callback = function(server_data){
	anlyobj.data=eval('(' + server_data + ')');
};


anlyobj.onchange_check = function(e){
	var t = DOMhelp.getTarget(e);
	if(t.value.length >= 3){
		anlyobj.show(anlyobj.check(t.value,data));
	}else{
		var notice = DOMhelp.make('H3','*需要大于两个字符.');
		document.f1.insertBefore(notice,document.f1.lastElementChild);
		DOMhelp.shake(t);
		function delself(e){
			e.parentNode.removeChild(e);
		}
		DOMhelp.fadeOut(notice,delself,2000);
	}
}

//valid method
anlyobj.showwarnning(msg,parentElm){
	var newElm = DOMhelp.createTextElm('SPAN','*' + msg);	
	newElm.className = 'warinning';
	parentElm.parentNode.insertBefore(newElm,parentElm);
	function oncomplete(itself){
		itself.parentNode.removeChild(itself);
	}
	DOMhelp.fadeOut(newElm,oncomplete,2500);
}
anlyobj.valid_name = function(data,parentElm){
	if(!data){
		anlyobj.showwarnning('empty value.');
		return;
	}
	name_format = /^[\u4e0-\u9fa5]+[_-]?$/;
	if(name_format.test(data) == false)
		anlyobj.showwarnning('contains invalid char(s).',parentElm);	
	
}
anlyobj.valid_amount = function(data,parentElm){
	if(!data){
		anlyobj.showwarnning('empty value.');
		return;
	}
	digit_format = /^\d+$/; 
	if(digit_format.test(data)==false)
		anlyobj.showwarnning('contains invalid char(s).',parentElm);
}

//NOTICE:check() :do link wrap data going here:
function anlyobj.check(input,source_data){
	var check_result=[];
	for(var i in source_data){
		if(source_data[i].toLowerCase().indexOf(input.toLowerCase())!=-1){
//NOTICE:do link wrap data going here:
			//var tip = source_data[i].split(':')[2].link('/localehost/query_via_item_name?table=pregood&id=' + source_data[i].split(':')[0]);		
			var tip = source_data[i].split(":")[2];
			check_result.push(tip);
		}// endif.
	}//end for.
	return check_result;
}

anlyobj.show = function(check_result){
	//first,need clear all childs. always forgot!!
	//wd do this with desc order,because we want keep elements index.
	if(suggest.childNodes){
		for(var i=suggest.childNodes.length-1;i>=0;i--){
			suggest.removeChild(suggest.childNodes[i]);
		}
	}
	if(check_result && check_result.length!=0){
		for(var i in check_result){
			var element = DOMhelp.make('span',check_result[i]); 
			suggest.appendChild(element);
			DOMhelp.addEvent(element,'click',anlyobj.tipReplace,false);	
		}
	}
}
anlyobj.tipReplace=  function(e){
	var source = DOMhelp.getTarget(e);
	anlyobj.input_item_name.value = source.textContent;	
	//return to form1:input_item_name
	document.location.hash='#f1';
}

//on ensure button is clicked
anlyobj.onensure = function(e){
	var t = DOMhelp.getTarget(e);
	switch(t.id){
		case "item_name_ensure":
			//document.location.hash = '#f2'; 
			document.location.href = '#f2'; 
			break;
		case "amount_ensure":
			review();	
			//document.location.hash = '#f3';
			document.location.hash = '#f3';
			break;
		default:
			break;
	}
	function review(){
		var record = DOMhelp.make('P',{'id':'counter' + (++anlyobj.commit_counter)},'提交数据 ' + anlyobj.commit_counter + ': ' + anlyobj.input_item_name.value + ' , ' + anlyobj.input_amount.value);
		var commit_button = DOMhelp.make('button',{'id':'combut'+ anlyobj.commit_counter,'onclick':'commit()'},'提交');
		var cancel_button = DOMhelp.make('button',{'id':'canbut'+ anlyobj.commit_counter,'onclick':'anlyobj.cancel()'},'取消');
		var gototop_button = DOMhelp.make('button',{'id':'gototop' + anlyobj.commit_counter,'onclick':'anlyobj.gototop()'},'GO TOP');
		document.f3.appendChild(record);
		document.f3.appendChild(DOMhelp.createTextElm('P','--- --- ---'));
		document.f3.appendChild(commit_button);
		document.f3.appendChild(cancel_button);
		document.f3.appendChild(gototop_button);
	}
}
anlyobj.commit = function(){
	var combut = document.getElementById('combut' + anlyobj.commit_counter);
	combut.parentNode.removeChild(combut);
	var canbut = document.getElementById('canbut' + anlyobj.commit_counter);
	canbut.parentNode.removeChild(canbut);
	var gototop = document.getElementById('gototop' + anlyobj.commit_counter);
	gototop.parentNode.removeChild(gototop);
	alert('提交完成');
}
anlyobj.cancel = function(){
	var record = document.getElementById('counter' + commit_counter);
	record.parentNode.removeChild(record);
	document.f1.reset();
	anlyobj.show(null);//for clear tips if exists.
	document.f2.reset();
	document.location.href='#f1';
	var combut = document.getElementById('combut' + anlyobj.commit_counter);
	combut.parentNode.removeChild(combut);
	var canbut = document.getElementById('canbut' + anlyobj.commit_counter);
	canbut.parentNode.removeChild(canbut);
	var gototop = document.getElementById('gototop' + anlyobj.commit_counter);
	gototop.parentNode.removeChild(gototop);
}

anlyobj.adjust = function(e){
	var t=DOMhelp.getTarget(e);
	anlyobj.input_amount.value = (parseInt(anlyobj.input_amount.value)) + parseInt(t.value); 	
	DOMhelp.stopDefault(e);	
}
anlyobj.gototop(){
	document.location.hash='f1';
}
anlyobj.input_item_name.focus();
anlyobj.commit_counter = 0;
window.onload = onPageLoad;
</script>

</body>
</html>
