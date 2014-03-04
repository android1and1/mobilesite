#! C:\Python27\python.exe
#coding=utf-8

# client-side /static/pancun.html 
# Response top10 records (select * from pancun limit 10 where user=?) 
# 1 pancun_id
# 2 partnumber
# 3 count
# 4 store_pos
# 5 offline
# 6 record_time
# 7 login_name

import sqlite3
import json
import cgi
import sys
import os
#from straight import straight

def application(environ,start_response):
	def straight(response):
		start_response('200 ok',[('Content-Type','text/plain'),('Content-Length',str(len(response)))])
		return [response]
	SQL = None
	request_body_size = int(environ.get("CONTENT_LENGTH",0))
	response = '' 
	
	# get body(content)
	request_body = environ['wsgi.input'].read(request_body_size)
	d = cgi.parse_qs(request_body)
	query  = d.get('query',[''])[0] 	
	user = d.get('user',[''])[0]
	if query == 'TOP10' and user != '' :
		SQL = 'select pancun_id,partnumber,count,store_pos,offline,record_time,login_name from pancun where login_name="' + user + '" order by record_time desc limit 10';

	if SQL == None:
		return straight('post data is invalid.')
		
			
	# let all file desc a abs path.
	dirname = os.path.dirname(os.path.realpath(__file__))
	DB=os.path.join(dirname,'together.db')	# db's abs-path

	# start connect db,and store field-partnumber,field-item_name.
	try:
		cxn = sqlite3.connect(DB)
		cxn.text_factory=str #need.
		cur = cxn.cursor()
		cur.execute(SQL)
		for i in cur.fetchall():
			response += (','.join([str(x) for x in list(i)]) + '\n')	
	# close all
		cur.close()
		cxn.close()
	except sqlite3.Error as e:
		return straight('db error: ' + e.args[0])	

	# prepare response.
	return straight(response.strip())
	
