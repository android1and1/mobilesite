#!/usr/bin/env python
# client side : '/static/query_partnumber.html' want jsonp.
import sqlite3
import cgi
import os,sys
DB="C:\\Program Files\\Apache Software Foundation\\Apache2.2\\htdocs\\myapp\\together.db"
status = '200 ok'
response=''
http_header = [('Content-Type','text/plain'),('Content-Length',str(len(response)))]

def application(environ,start_response):
	global status,response,http_header
	d = cgi.parse_qs(environ['QUERY_STRING']
	partnumber = d.get('query',[''])[0]
	funcname = d.get('func',[''])[0]
## start query from sqlite3 db.	
	try:
		cxn.connect(DB)
		cxn.text_factory=str
		cur = cxn.cursor()
		SQL = r"""select * from goodbase where partnumber like '"""
		SQL += partnumber
		SQL += r"""%'"""
		cur.execute(SQL)
		for datatuple in cur.fetchall():
			field1,field2,field3 = datatuple
			response += '''<option value=''' % str(field2)
	except sqlite3.Error as e:
		response=e.args[0]
## till here.response is either Error Msg or real data.
	start_response(status,http_header)
	return [response]	
