#!/usr/bin/env python
# coding=gbk

#// filename 'querydetails_static.cgi'
#// client-side : '/static/ano.html'

import cgi
import sqlite3
import os
import json

abspath = os.path.dirname(os.path.abspath(__file__))
DB = abspath + '\\together.db'
status = '200 ok'

def application(environ,start_response):
	# get 'partnumber' from url.
	d=cgi.parse_qs(environ['QUERY_STRING'])
#	partnumber = d.get('partnumber',[''])[0]
	desc = d.get('desc',[''])[0]
	if desc == '':
		response=json.dumps({'msg':'no record.'})
		http_header = [('Content-Type','text/json'),
			('Content-Length',str(len(response)))]
		start_response(status,http_header)
		return [response]
	response=''
	try:	
		cxn = sqlite3.connect(DB)
		cxn.text_factory=str # it needs.
		cur = cxn.cursor()
		sql = """select id,img_url,desc,origin_price,price,modify_time from gooddetails where desc like '%s%%' """ % desc 
		cur.execute(sql)
		result = cur.fetchone()
		if result:
			response = json.dumps(result)
		else:
			response = json.dumps({'msg':'no found'})
		cur.close()
		cxn.close()
		
	except sqlite3.Error as e:
		response=json.dumps({'msg':'db error'}) 
	http_header = [('Content-Type','text/json'),
		('Content-Length',str(len(response)))]
	start_response(status,http_header)
	return [response]
