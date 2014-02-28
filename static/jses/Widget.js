/*
* Widget is a wrapper of HTML-FORM-CONTROL-ELEMENT 
* it can wrapp <input> <select> <button> <textarea>
* 
* 
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
		if(defaultIndex==null)
			defaultIndex=0;	
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
							if(i===defaultIndex)
								element.checked="checked";
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
