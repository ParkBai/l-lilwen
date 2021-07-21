const app = require('./app/index')
const config = require('./app/config')
require('./app/database')

app.listen(config.APP_PORT,()=>{
  console.log(`SERVICE IS SUCCEED ON ${config.APP_PORT} PORT`)
})