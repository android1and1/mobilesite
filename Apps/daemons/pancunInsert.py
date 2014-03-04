#! E:\Python27\python.exe
#coding=utf-8

# script name : pancunServer.py (version 1.1)
# client-side /static/pancun.html 
# posted data is parse to a dict.{'partnumber':?,'login_name':?,'store_pos':?
# ,'offline':?,'count':?} total 5 fields.
# 2013/12/9 14:20:00
import sqlite3
import json
import cgi
import sys
import os

def application(environ,start_response):
	response = None
	try:
		request_body_size = int(environ.get("CONTENT_LENGTH",0))
	except(ValueError):
		request_body_size = 0
	
	# get body(content)
	request_body = environ['wsgi.input'].read(request_body_size)
	content = cgi.parse_qs(request_body)
	
	#parse 5 fields
	partnumber = int(content.get('partnumber')[0])
	login_name = content.get('login_name')[0] 
	store_pos = content.get('store_pos')[0]
	count = int(content.get('count')[0])
	offline = int(content.get('offline')[0])

	# let all file desc a abs path.
	dirname = os.path.dirname(os.path.realpath(__file__))

	DB=os.path.join(dirname,'together.db')	# db's abs-path
	# start connect db,and store field-partnumber,field-item_name.
	try:
		cxn = sqlite3.connect(DB)
		cxn.text_factory=str #need.
		cur = cxn.cursor()
		SQL = r'''insert into pancun(partnumber,login_name,store_pos,count,offline) values(?,?,?,?,?)'''
		cur.execute(SQL , (partnumber,login_name,store_pos,count,offline))
		cxn.commit() 	# !important 
	# close all
		cur.close()
		cxn.close()
	except sqlite3.Error as e:
		response = {'stat':0,'reason':e.args[0]}	

	if response == None:
		response = json.dumps({'stat':1,'reason':''})		
	# prepare response.
	status='200 ok'
	response_header=[('Content-Type','text/json'),
			('Content-Length',str(len(response)))
			]
	start_response(status,response_header)
	return [response]	
