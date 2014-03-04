#!"E:\Python27\python.exe"
import os,sys
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

# import our module. 
import CommonHandler

import cgi
import sqlite3

mobile_template = CommonHandler.mobile_template


class Bpp(CommonHandler.App):
	def giveForm(self,fieldName):
		return r'''<form name="form1" action="/myapp/imp2.py" method="POST" >
			<p>login name: <input type="text" name="%s" /></p><p><input type="submit" /></form>
			''' % fieldName
	def app(self):
		login_name = self.getValue('login_name')
		if login_name:
			db = CommonHandler.DB()
			db.execute('seeall',login_name)	
			response = self.tableify(db.getFieldNames(),db.cur.fetchall())
			self.write(mobile_template % response)
			db.close()
		else:
			self.write(mobile_template % self.giveForm('login_name'))

application = Bpp()
