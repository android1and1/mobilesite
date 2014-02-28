/**
 ************************* OVERVIEW *******************
 *
 *[HHFfso Version2.2]
 *[2012-05]
 *[wiriten by alan dershowitz]
 *
 * ATTRIBUTE:
 * 1)base //make our project effective.use setBase(after)can change or init this attr.
 * 2)fso //it is a FileSystemObject.
 * 3)ForReading //equals 1
 * 4)ForWriting//equals 2 * notes that NOT forWritting
 * 5)ForAppending//equals 8 
 * 6)stream //keep a handler
 * 
 * 
 * METHOD
 * 1)init
 * 2)setBase
 * 3)getStream //before we write or read,invoke this first.
 * 4)showFileInfo
 * 5)createTextFile//wrapper original fso.createTextFile,they are little difference
 * 6)createFolder 
 * 7)copyFile
 * 8)deleteFile
 * 9)getSubFolders //*new 
 * 10)getSubFiles   //*new
 * 
 * WHAT'S NEW
 * 1)[getStream] method,add case when file is not exists.old version(1.0)can not handler
 * this case.
 * 2)[getSubFiles],Version1.1 must invoke 'HHFfos.init();',Version2.2 can do 
 * this work with no 'init();';
 * 3)so as [getSubFolders].
 * IMORTANT
 * 1)FileSystemObject only be supported by IE & ActiveXObject,
 * 		So if you want disable in other browse,before use HHFfos,
 * 		do a test,like this:
 * 				if(!window.ActiveXObject)
 * 					return;
 * 				else
 * 					//import HHFfso
 * 
 *
 *      [HHFfso] is a wrapper about FileSystemObject,the most difference between 
 *      both is it's io-write/read base on TextStream.
 *		example:
 *            HHFfso.init();
 *            HHFfso.fso.DO FSO DEFAULT METHOD
 */

var HHFfso = {
	base : '',
	fso : null,
	ForReading:1,
	ForWriting:2,
	ForAppending:8,
	stream:null,
	
	init : function() {
		try {
			HHFfso.fso = new ActiveXObject('Scripting.FileSystemObject');
		} catch (e) {
			throw new Error('can not create ActiveXObject!');
		}
		if(HHFfso.stream)
			HHFfso.stream.close();
	},
	
	//change base if base not exists,or init base.
	setBase:function(pathname){
		HHFfso.base=pathname;
	},

	
	//version2.1
	//add case that when find a no-exists file,in version1.X,it will be an error.
	//but it is neccessary that adjust this.add an argument named 'force'
	// 'force' is a optional,when it omitted,means if file is not exists
	//method make an error,as Version1.X
	//but if argument 'force' given,while the file is not exists,create a new.
	getStream : function(filename,iomode,force) {
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		var file;
		try{
			file = HHFfso.fso.getFile(filename);
			HHFfso.stream=file.openAsTextStream(iomode);
		}catch(e){
			try{
				if(force){
					HHFfso.stream = HHFfso.fso.createTextFile(filename,true);
				}
			}catch(e2){
				throw new Error(e2.message);
			}
		}
		if(!HHFfso.stream)
			return false;
		return true;
	},
	
	showFileInfo : function(filespec) {
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		var f, s;
		try{
			f = HHFfso.fso.GetFile(filespec);
		}catch(e){
			throw new Error(e.message);
		}
		s = "<br />完整路径: " + f.Path + "<br />";
		var size;
		if (f.size > 1024 * 1024)
			size = f.size / 1024 / 1024 + 'MBs';
		else if (f.size > 1024)
			size = f.size / 1024 + 'KBs';
		else
			size = f.size + 'Bytes';
		s += "文件大小: " + size + "<br />";
		var c = new Date(f.dateCreated);
		var cTime = c.toLocaleTimeString();
		var cDate = c.toLocaleDateString();
		var a = new Date(f.dateLastAccessed);
		var m = new Date(f.dateLastModified);
		var aTime = a.toLocaleTimeString();
		var aDate = a.toLocaleDateString();
		var mTime = m.toLocaleTimeString();
		var mDate = m.toLocaleDateString();
		s += "创建时间: " + cDate + ' ' + cTime + "<br>";
		s += "上一次访问时间: " + aDate + ' ' + aTime + "<br>";
		s += "上一次修改时间: " + mDate + ' ' + mTime + "<br />";
		return (s);
	},
	
	//in version2.1 , getStream method contains an case that :
	//when you invoke getStream and filename(is an argument)is not exists,
	//case this state,getStream() method will create new one if you give an
	//'true' argument tailing.
	//so,perhaps ,createTextFile is not nessary except you want create some
	//empty files.
	createTextFile:function(filename,overWrite){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		//in original fso.createTextFile method(in API)
		//the 'handler' is useful,you can find file's attributes
		//but it be forbidden in my own 'createTextFile',it will
		//occurs some trouble.
		//if you want to check file's attributes
		//instead of 'HHFfso.showFileInfo' or 'HHFfso.fso.getFile'
		var handler=HHFfso.fso.createTextFile(filename,overWrite);
		if(!handler)
			return false;
		return true;
	},
	
	//as 'createTextFile,we can createFolder
	//only one thing is difference:no 'overWrite' argument.
	createFolder:function(foldername){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		var handler=HHFfso.fso.createFolder(foldername);
		if(!handler)
			return false;
		return true;
	},
	
	//fso.copyFile is equals file.copy
	//source can use a wildcard filename,like 'path/*.txt'
	//destination can not use wildcard.
	//overwrite is optional,it is a boolean make func force overwrite or 
	//protect original file.
	//two interesting thing exists this method:
	//1,the wildcard only be allowed use in the last part of pathname,
	//example:it be allowed :
	//fso.CopyFile ("c:\\mydocuments\\letters\\*.doc", "c:\\tempfolder\\")
	//but it be forbidden:
	//fso.CopyFile ("c:\\mydocuments\\*\\R1???97.xls", "c:\\tempfolder")
	//2,if argument named destination ending with'\',
	//the method will treat destination as a folder,therefor put all source into here.
	//else,method will make 1 result of 3 available state. A)if destination not exists
	//will copy successful;B)if destination exists and 'overwrite' value is false,
	//it will create an error,if 'overwrite' value is true,will successful;
	//C)if destination is not a file but it is a folder,whenever 'overwrite' value is 
	//any,it will create an error.
	copyFile:function(source,destination,overwrite){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		HHFfso.fso.copyFile(source, destination, overwrite);
	},

	//I just use 'deleteFile' with a wildcard '*.txt',
	//it deleted all *.txt,it works too hard!!
	deleteFile:function(file,force){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		if(arguments.length==2 && force==true)
			HHFfso.fso.deleteFile(file,true);
		else
			HHFfso.fso.deleteFile(file);
		return true;
	},

	//listFolds handler when a folder contains subfolder,it will list all 
	//folders under their mother,but it can not PHP.
	//in fact listFolders(and listFiles)transi a set to a array.
	getSubFolders:function(folder){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		try{
			var folderHandler = HHFfso.fso.getFolder(folder);
		}catch(e){
			throw new Error(e.message);
		}
		 var enumerator = new Enumerator(folderHandler.SubFolders);
		 var result = new Array();
		 for (;!enumerator.atEnd(); enumerator.moveNext()){
		        result.push(enumerator.item());
		 }
		 return(result);
	},
	
	getSubFiles:function(folder){
		if (!HHFfso.fso)
			HHFfso.init();
		if (!HHFfso.fso)
			return false;
		if(HHFfso.stream)
			HHFfso.stream.close();
		try{
			var fileHandler = HHFfso.fso.getFolder(folder);
		}catch(e){
			throw new Error(e.message);
		}
		 var enumerator = new Enumerator(fileHandler.files);
		 var result = new Array();
		 for (;!enumerator.atEnd(); enumerator.moveNext()){
		        result.push(enumerator.item());
		 }
		 return(result);
	}
};