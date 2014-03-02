#!/usr/bin/env python

# MODULE NAME: CommondHandler
# VERSION 1.91
# (modify App class,add 'cgi.escape()')
# ALAN DERSHOWITZ 2013/12/19

# this version is special for MVC,after client request,application parse post
# data,then invoke sqlite3(DB is special),and give response by self.write(),
# and response is made within app(),so app(name) is special.
# i hope it can most common at next time.
# so far,some client of this module like 'imp*.py'
# and you can play with this module from ipython or python-shell
# just >>>import CommondHandler

# contains :
# 1,class DB 
# 2,class App 
# 3,Variable mobile_templae
# 4,Variable DB_PATH

# Useage:
#       from CommandHandler import DB,App
#	db = DB()
#	class Bpp(App):
#		def app(self) //override parent's app
#			//do real thing.
#	application = Bpp()

# if it nessary override DB,just do it!

import os
import string  #need string.maketrans() method.
import time
import cgi
import cgitb;cgitb.enable()
import sqlite3

# If You Change 'Site-Package' ,remark below line(ROOTDIR)!
ROOTDIR = '/var/WWW/'
APPDIR = ROOTDIR + 'myapp/'
# execute file,then get env['mobile_template']
execfile(APPDIR + 'mobile.template')

# db info:path
DB_PATH = APPDIR + 'together.db'

class DB(object):
	def __init__(self,path=DB_PATH):
		self.path = path
		self.cxn = None
		self.cur = None
		self.error = {} 
		self.connect()
	def connect(self):
		try:
			self.cxn = sqlite3.connect(self.path)
			self.cur = self.cxn.cursor()
			self.cxn.text_factory = str
		except sqlite3.Error as e:
			self.error['connect_error'] = e.args[0]	

	def close(self):
		try:
			self.cur.close()
			self.cxn.close()
		except sqlite3.Error as e:
			self.error['close_error'] = e.args[0]	

	def getFieldNames(self):
		'''
		another func which invoke this must check if self.cur is None.
		'''
		fieldNames = []
		for i in self.cur.description:
			fieldNames.append(i[0])
		return fieldNames 

	def execute(self,command,condition=None):
		if len(self.error) > 0:
			return
		sql =  self._translate(command,condition)
		if sql is not None:
			try:
				self.cur.execute(sql)	
			except sqlite3.Error as e:
				self.error['execute_error'] = e.args[0]

	def _translate(self,command,condition):
		commandDictionary = {
			'statlogin':r'''select login_name,datetime(login_time,"unixepoch","localtime"),mac,diff_time  from login where login_name="%s" order by login_time desc limit 10''' % condition ,
			'see1':r'select * from goodbase where old_id="' + condition + r'" or item_name="' + condition + r'"',
			'see5':'select pancun_id,partnumber,store_pos,count,login_name,record_time from pancun where login_name="%s"' % condition + ' order by record_time desc limit 5', 
			'seeall':'select partnumber,store_pos,count,datetime(record_time,"unixepoch"),login_name from pancun where login_name="%s" order by record_time desc' % condition,
			'match':r'''select id,old_id,item_name,contains from goodbase where old_id like "''' + condition  + r'''%" or item_name like "''' + condition + r'''%"''',  
			}
		for i in commandDictionary: 
			if i == command:
				return commandDictionary[i]
		return None
	
		
class App(object):
	def __init__(self):
		self.response = '' 
		self.db = None 
		self.request = None

	def write(self,response):
		self.response = response 

	def getRequest(self,environ):
		try:
			bodysize = int(environ['CONTENT_LENGTH'])
			dict = cgi.parse_qs(environ['wsgi.input'].read(bodysize))
			self.request = dict 
		except Exception:
			self.request = None
	def getValue(self,name):
		# return value maybe 1 of 3:
		# 1, None
		# 2, ''
		# 3, real value.
		# so it is nesscary that check in function which invoke this.

		if self.request is not None:
			value = self.request.get(name,[''])[0]
			value = cgi.escape(value)
			tabl = string.maketrans('','')
			return value.translate(tabl,r"""'%;|^,""")
		else:
			return None

	#@override
	def giveForm(self,fieldName):
		'''
			sub instance will override it.
			give a form to client.the form's action is self.__file__
		'''
		pass

	def tableify(self,tableheads,resultset):
		'''
			I think:'resultset' must check,and transfor if
			item is not a string.
		'''	
		response = '<table border="1">'
		response += '<thead><tr><th>' +  '</th><th>'.join(tableheads) + '</th></tr></thead>'
		response += '<tbody>' 
		for i in resultset:
			response += '<tr><td>' + '</td><td>'.join([str(x) for x in i]) + '</td></tr>'
		response += '</tbody></table>'
		return response

	#@override
	def app(self):
		"""
			app is empty,sub class's instance must override it.
		"""
		pass 

	def __call__(self,environ,start_response,contenttype='text/html'):
		'''
			instead directly call application.
			sub class's instance inherit .
			first pass post-data to self,then execute app(real).
		'''
		self.getRequest(environ)
		self.app()

		status = '200 ok'
		headers = [('content-type',contenttype),
			('content-length',str(len(self.response)))]
		start_response(status,headers)
		return [self.response]
