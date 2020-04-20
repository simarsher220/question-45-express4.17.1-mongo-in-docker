#!/usr/bin/env bash
# Start mysql
#service mysql start
#ps aux | grep mysqld
mysqld_safe --skip-grant-tables &
sleep 2
mysql -e "FLUSH PRIVILEGES"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin'"
service mysql start
sleep 2
mysql -u root --password=admin -e "create database db"

# Start mongo
#/usr/bin/mongod --port 27017 --dbpath /data/db
/usr/bin/mongod --port 27017 --dbpath /data/db >/dev/null 2>&1 &
ps aux | grep mongo
sleep 5
mongo < database.js

# Start Server
npm start