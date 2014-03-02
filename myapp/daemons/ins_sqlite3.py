#!/usr/bin/env python
#coding=utf-8

# script name : ins_sqlite3.py (version 1.3)
# object: from html page's form get 2 field's value:1,partnumber;2,item_name
# then,store it to db(sqlite3 type),and reponse client it is ok.
# Tue Nov 12 10:20:41 2013 written by aLAN dERSHOWITZ.

import sqlite3
import cgi
import sys
import os
sys.stdout=sys.stderr 

def application(environ,start_response):
	try:
		request_body_size = int(environ.get("CONTENT_LENGTH",0))
	except(ValueError):
		request_body_size = 0
	
	# get body(content)
	request_body = environ['wsgi.input'].read(request_body_size)
	content = cgi.parse_qs(request_body)
	
	#parse to 2 fields
	partnumber = content.get('partnumber')[0]
	item_name = content.get('item_name')[0]

	# let all file desc a abs path.
	dirname = os.path.dirname(os.path.realpath(__file__))

	DB=os.path.join(dirname,'together.db')	# db's abs-path
	HTTP_HEADER=open(os.path.join(dirname,'HTTP_HEADER'),'r').read()
	HTTP_FOOTER=open(os.path.join(dirname,'HTTP_FOOTER'),'r').read()
	HTTP_BODY=''
	# start connect db,and store field-partnumber,field-item_name.
	try:
		cxn = sqlite3.connect(DB)
		cxn.text_factory=str
		cur = cxn.cursor()
		SQL = r'''insert into goodbase(partnumber,item_name) values(?,?)'''
		#cur.executemany(SQL , [(partnumber,'"'+ item_name +'"')])
		cur.executemany(SQL , [(partnumber,item_name)])
		cxn.commit() 	# !important 
	# close all
		cur.close()
		cxn.close()
	except sqlite3.Error as e:
		HTTP_BODY = '''<h3>Sorry,DB ERROR:  %s</h3>''' % e.args[0]	

	if HTTP_BODY=='':	
		HTTP_BODY = '''<h1>store record: partnumber=%s,item_name=%s</h1>''' % (partnumber,item_name)
	# prepare response.
	response=''.join([HTTP_HEADER,HTTP_BODY,HTTP_FOOTER])
	status='200 ok'
	response_header=[('Content-Type','text/html'),
			('Content-Length',str(len(response)))
			]
	start_response(status,response_header)
	return [response]	
