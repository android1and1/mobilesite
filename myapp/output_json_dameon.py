#!/usr/bin/env python
# reference (client) static/ajax.html
json_data = {"flag":"server-2013","passwd":"1234567","article":"server environ args"}

import json
def application(a1,a2):
	global json_data
	json_data['env-keys'] = a1.keys()
	for i in a1:
		if type(a1[i])!=type('a'):
			continue
		else:
			json_data[i] = a1[i]
	
	response = json.dumps(sorted(json_data.iteritems(),key=lambda x:x[0]))
	http_h = [('Content-Type','text/json'),
			('Content-Length',str(len(response)))
		]
	a2('200 ok',http_h)
	return [response]
