use admin
db.createUser({user:"admin", pwd:"passw0rd", roles:[{ role:"userAdminAnyDatabase", db:"admin" }]})
db.auth("admin", "passw0rd")

use skynet
db.createUser({ user:"skynet", pwd:"passw0rd", roles:[ {role:"readWrite", db:"skynet"} ]})
db.auth("skynet", "passw0rd")

