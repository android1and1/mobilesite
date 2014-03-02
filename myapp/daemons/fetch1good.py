#!/usr/bin/env python

import sys,os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

import sqlite3
import cgi
import json

#from ... import is better than import all or only namedspace:CommandHandler.
from CommonHandler import DB,App#,mobile_template

class Bpp(App):
	def app(self):
		# do sql
		db=DB()
		condition=self.getValue('condition')
		if condition:
			db.execute('see1',condition)
			response = json.dumps(db.cur.fetchone()) 
			db.close()
			self.write(response)
		else:
			self.write('Error:No Received Conditon.')

	def __call__(self,environ,start_response):
		return App.__call__(self,environ,start_response,"text/json")

application = Bpp()
