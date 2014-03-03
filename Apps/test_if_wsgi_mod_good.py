#!/usr/bin/env python
# just test if wsgi_mod is work,offen after install this mod.
def application(environ,start_response):
	'''
		it is output for show module wsgi is work.
	'''
	status = '200 ok'
	output = 'Hello,Module' 
	response_headers = [('Content-type','text/html'),
			('Content-Length',str(len(output)))]
	start_response(status,response_headers)
	return [output]
