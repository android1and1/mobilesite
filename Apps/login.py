#!/usr/bin/env python

# client-side: /static/login.html
# written by Alan Dershowitz 2013/11/29
# NOTICE*** NOT implement from CommonHandler.App Class ***

# if all is right,response like: [stat=1;reason=;user=LOGIN_NAME]

# during edit this script,there is a story. 
# when main invoke other func in this file,must return func(XXXX)
# in this case,not simply invoke 'giveReason(sta,reason)' 
# but 'RETURN giveReason(sta,reason)'  !!!!!

import time
import os
import md5
import cgi
import sqlite3

def giveReason(sta,reason):
	sta('200 OK',[('Content-Type','text/plain')])
	return [r'stat=0;reason=' + reason]

def application(env,sta):

## get client-body.
	
	body_size = int(env['CONTENT_LENGTH']) 
	post_directory = cgi.parse_qs(env['wsgi.input'].read(body_size))
	if post_directory.has_key('client_time') is False or post_directory.has_key('login_name')  is False or post_directory.has_key('password') is False:
		reason = 'login_name or password field is empty'
		# not only "giveReason(sta,reason)" !
		# but "RETEUN giveReason(sta,reason)" !!
		return giveReason(sta,reason)
	login_name = cgi.escape(post_directory.get('login_name',[''])[0])
	password = cgi.escape(post_directory.get('password',[''])[0])
	client_time = cgi.escape(post_directory.get('client_time',[''])[0])
	
	if password=='' or login_name=='':
		reason = 'login_name or password field is empty'
		return giveReason(sta,reason)
	
## make md5sum to 'password' field.

	client_post_password_md5sum = md5.md5(password).hexdigest() 
	md5_sum_from_table = ''  

## query "workerbase" table.
	DB=os.path.join(os.path.dirname(__file__),"together.db")
	try:	
		conn = sqlite3.connect(DB)
		conn.text_factory = str
		cur = conn.cursor()
		sql = r'''select password from "workerbase" where "login_name" = ?'''
		cur.execute(sql,(login_name,))
		returnTuple = cur.fetchone()	
		if returnTuple != None :
			md5_sum_from_table = returnTuple[0]  
		else:
			return giveReason(sta,'no this user')

	except sqlite3.Error as e:
		return giveReason(sta,'Error:' + e.args[0])	
## response
	 
	if md5_sum_from_table == client_post_password_md5sum :
		#calculate servertime-clienttime
		#client_time is got already.it is base on 'second' not default 'millisecond'.
		server_time = int(time.time()) # transfer to int type.
		client_time = int(client_time) # transfer to int type
		diff_time = abs(server_time - client_time)

		response = r'stat=1;reason=;user=' + login_name + ';diff_time=' + str(diff_time)
#insert this login event into table `login`:
# NOTICE:time.time() get a UNIX TIME,NOT localetime.
		cur.execute('insert into login (login_name,login_time,last_active,diff_time,mac) values (?,?,?,?,?)',(login_name,time.time(),'',str(diff_time),''))
		conn.commit()
	else:
		response = r'stat=0;reason=loginname/password no match'
#close all.
	cur.close()
	conn.close()

	sta('200 ok',[
		('Content-Type','text/plain'),
		('Content-Length',str(len(response)))
		]
		)
	return [response]
