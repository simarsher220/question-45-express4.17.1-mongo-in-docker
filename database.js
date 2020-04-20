use admin
db.createUser(
 {
     user: "root",
     pwd: "admin",
     roles: [
           { role: "userAdminAnyDatabase", db: "admin" },
           { role: "readWriteAnyDatabase", db: "admin" },
           { role: "dbAdminAnyDatabase", db: "admin" }
        ]
 })
use db