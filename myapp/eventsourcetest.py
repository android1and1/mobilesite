#! C:\Python27\python.exe
# test if eventSource is support?
import time
import os
def application(env,sta):
# prepare file content
	status = '200 ok'
	types = [
	('Content-Type','text/event-stream'),
	('Control-Cache','no-cache'),
	]

	sta(status,types)
#	yield 'retry: 120000\n'
	yield '\n'
	while True:
		yield 'data: ' + '1' + '\n' 
		time.sleep(10)
		
		
			
	
