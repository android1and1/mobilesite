#! C:\Python27\python.exe
from cgi import parse_qs,escape
def application(environ,start_response):
	try:
		request_body_size = int(environ.get('CONTENT_LENGTH',0))
	except(ValueError):
		request_body_size = 0
	request_body = environ['wsgi.input'].read(request_body_size)
	d=parse_qs(request_body)
# get age
	age = d.get('age',[''])[0] ## get first age
	age = escape(age)
# get checkbox's chioce(s?)
	hobbies = d.get('hobbies',[])	
	hobbies = [escape(hobby) for hobby in hobbies]
	
	status = '200 ok'
	output = '<html><body><h2>post age: %s</h2><h2>post hobbies: %s</h2></body></html>' % (age,','.join(hobbies)) 
	response_headers = [('Content-type','text/html'),
			('Content-Length',str(len(output)))]
	start_response(status,response_headers)
	return [output]
