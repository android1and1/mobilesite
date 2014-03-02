# this sh script turn windows platform's py files to linux platfrom
# first of Windows'platform
#	#!"C:\Python27\python.exe"
# in Linux's platform
#	#!/usr/bin/env python
# or
#	#!/usr/bin/python

# cd py files directory
# 

#override it with REALPATH.
# check if each py file's first line start with '#!'(shellbang tag)
# cd *py file's dir first.
 
for i in *py
do
	sed -n '1p' $i | grep -e '^#!' 
	if [ $? -eq 0 ] #means it is valid(good)
	then
		echo good "$i" is begin with "#!(shellbang)" 
	else
		echo "$i" is not begin with "#!(shellbang)" 
	fi
done
		
for i in *py
do
	grep "/usr/" $i
	if [ $? -eq 0 ]	#means it is linux's platform already,do nothing!
	then
		echo "$i" is already linux py file
	else
		echo "$i" need changed its first line
		sed -i "1c#!/usr/bin/env python" $i
	fi
done
echo "done" 
