#! C:\Python27\python.exe
# filename 'treat_upload.py'
import os
import cgi
import io

import msvcrt
msvcrt.setmode(0,os.O_BINARY) ## stdin = 0 
msvcrt.setmode(1,os.O_BINARY) ## stdout =1
def upload(environ):
	# A nested FieldStorage instance holds the file
	# fileitem = req.form['file']
	winput = environ['wsgi.input']
	params = cgi.FieldStorage(fp=io.StringIO(winput.read(int(env.get("CONTENT_LENGTH","0"))).decode("ISO-8559-1")),environ=environ,keep_blank_values=1)
	print(params["file"].name)
	print(params["file"].filename.encode("ISO-8859-1").decode("UTF-8"))
	print(params["file"].value.encode("ISO-8859-1"))
	message = ''
	open('E:/troubleshoot_dyj/uploaded','wb').write(data)
	message='The file was uploaded successfully'
	return ('<html><body><h1>' + message + '</h1></body><html>')

def application(environ,start_response):
	status = '200 ok'
	output = upload(environ)
	response_headers = [('Content-type','text/html'),
			('Content-Length',str(len(output)))]
	start_response(status,response_headers)
	return [output]
