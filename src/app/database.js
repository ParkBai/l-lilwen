const mysql2 = require('mysql2')
const config = require('../app/config')

const connections = mysql2.createPool({
  host: config.MYSQL_HOST,
  post: config.MYSQL_PORT,
  database:config.MYSQL_DATABASE,
  user:config.MYSQL_USER,
  password:config.MYSQL_PASSWD
})

connections.getConnection((err,conn)=>{
  conn.connect(err =>{
    if(err){
      console.log('DATABASE IS FAILED',err)
    }else{
      console.log('DATABASE IS SUCCEED')
    }
  })
})

module.exports = connections.promise()