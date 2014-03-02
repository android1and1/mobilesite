#!/usr/bin/env python
# encoding=gbk
# original filename 'unicodeformoto.cgi'
# filename 'goodlist.cgi' 
# make a table of goods,each td's href will goto 'querydetails.cgi'
# written by Alan. 2013/11/12 evening.
# all mobiles can read zh_CN chars(contains motorola a1680).
# we will fetch some data from sqlite3 db.

# review 2013/11/23


import sys
import sqlite3
import os
sys.stdout=sys.stderr
def application(env,star):
	# declair some constants:html_header,
	html_header = '''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="initial-scale=1.0,width=device-width" /><title>hope A168 can see me.</title><link rel="stylesheet" href="/static/csses/wsgi.base.css" type="text/css" media="screen" /></head><body>'''
	status = '200 ok'
	response=''

	# connect sqlite3 db -- together.db -- dyj(table)
	try:
		conn = sqlite3.connect(os.path.dirname(os.path.realpath(__file__)) + '\\together.db')
		conn.text_factory=str
		cur = conn.cursor()
		#cur.execute(r'''select * from goodbase''')
		cur.execute(r'''select * from goodbase limit 10''')
		

## you can toggle between comment and code below,see
## how get the expected format for html page.
## if no table output,maybe you must define two css style for 'span','div'. 
		for data in cur.fetchall():
			#response += make_block(data,'p','span')
			response += make_block(data,'tr','td')
		response = '<table border="1">' + response + '</table>'
		cur.close()
		conn.close()
	except sqlite3.Error as e:
		response='<h1>DB ERROR:' + e.args[0] + '</h1>'
	# retrieve datas
	if response=='':
		response = '<h1>check</h1>'
	response = html_header + response + '</body></html>'  
	http_header = [('Content-Type','text/html'),('Content-Length',str(len(response)))]
	star(status,http_header)
	return [response]



def make_item(fetchdata,tagname):
	data=fetchdata
	if type(data).__name__ == 'int':
		data = str(fetchdata) 
	return ''.join(['<',tagname,'>',data,'</',tagname,'>'])

def make_block(items,parenttag,subtag):
	"""
		why I always get '<td><a href=...?partnumber=>item</a></td>???'
		must do a debug's variiable
	"""
	# items is a tuple. maybe.
	result = []
	# counter keep postion order,this case pos=2 is item_name
	counter = 1
	partnumber=''
	for item in items:
		if counter==1:
			partnumber=str(item)
		if counter==2:
			item = (r'''<a alt="detail of goodbase" href="/querydetails.cgi?partnumber=''' + partnumber + r'''">''' + item +  r'''</a>''')
		result.append(make_item(item,subtag))	
		
		counter += 1
	return make_item(''.join(result),parenttag)	
