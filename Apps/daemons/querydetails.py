#!E:\Python27\python.exe
# coding:gbk

#// filename 'querydetails.py'
# version 1.1
# override version.2014/2/11
#// query goodbase's details via partnumber

import string
import sys,os
sys.path.append(os.path.dirname(__file__))
from CommonHandler import DB,App,mobile_template

class Bpp(App):
	def giveForm(self,fieldname):
		return r'''
			<form action="%s" method="post" name="form1">
			<h2> search via good's partnumber</h2>
			<p><input type="text" placeholder="input partnumber" name="%s" /></p>
			<p><input type="submit" value="Submit" /></p>
			</form>
			''' % ('/myapp/querydetails.py',fieldname)

	def app(self):
		partnumber = self.getValue('partnumber')
		if not partnumber:
			self.write(mobile_template % self.giveForm('partnumber'))
		else:
			# escape 'partnumber'
#			tabl = string.maketrans('','')
#			partnumber = partnumber.translate(tabl,'&%')
			db = DB()
			db.execute('match',condition=partnumber)
			output = '<p>QUERY IS: ' + partnumber + '</p>'	
			output += self.tableify(db.getFieldNames(),db.cur.fetchall())
			db.close()
			self.write(mobile_template % output)	
			

application = Bpp()
