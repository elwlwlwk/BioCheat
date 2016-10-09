import pymysql.cursors
import config

DB_CONN= pymysql.connect(host= 'localhost',
		user= config.DB_USER,
		passwd= config.DB_PASS,
		db= 'biocheat',
		charset= 'utf8',
		cursorclass=pymysql.cursors.DictCursor)
