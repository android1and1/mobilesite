#!/usr/bin/env python

############################################
############################################
#
# sample of Useage for 'CommandHandler.py' 
#
############################################
############################################

import os,sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

# after sys.path.append ,we now import our module. 
# will imported finish,we get 
# 1,CommandHandler.mobile_template
# 2,CommandHandler.App
# 3,CommandHandler.DB
import CommonHandler

import cgi
import sqlite3

class Bpp(CommonHandler.App):
	def giveForm(self,fieldName):
		return r'''<form name="form1" action="/myapp/demoOfCommonHandler.py" method="POST" >
			<p>login name: <input type="text" name="%s" /></p><p><input type="submit" /></form>
			''' % fieldName
	#@override
	# it is most important override-method --- app()
	# this method is special for each instance.
	def app(self):
		login_name = self.getValue('login_name')
		if login_name:
			db = CommonHandler.DB()
			db.execute('seeall',login_name)	
			response = self.tableify(db.getFieldNames(),db.cur.fetchall())
			self.write(CommonHandler.mobile_template % response)
			db.close()
		else:
			self.write(CommonHandler.mobile_template % self.giveForm('login_name'))

application = Bpp()
