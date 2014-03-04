#! E:\Python27\python.exe
# this script check login stat.

import sqlite3
import cgi
import os,sys
parentdir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(parentdir)
import CommonHandler
template = CommonHandler.mobile_template

class Bpp(CommonHandler.App):
	def giveForm(self,keyword):
		return r'''
		<form action="/myapp/imp3.py" method="post" name="form_login_stat">
		<h2>check login stat </h2>
		<label>input your login name: <input type="text" name="%s" /></lable><p>
		<input type="submit" />
		</form>
		''' % keyword
	def app(self):
		''' add command:check login stat.named 'statlogin'
		'''
		login_name = self.getValue('login_name')
		if login_name:
			db = CommonHandler.DB()
			db.execute('statlogin',login_name)
			self.write(template % self.tableify(db.getFieldNames(),db.cur.fetchall()))
			db.close()	
		else:
			self.write(template % self.giveForm('login_name'))
		
application = Bpp()
