const Router = require('koa-router')
const {
  login,
  success
} = require ('../controller/autorizeController')

const {
  verifyLogin,
  verifyAuthorize
} = require ('../middleware/authorizeMiddleware')

const authorizeRouter = new Router()

authorizeRouter.post('/login', verifyLogin,login)
authorizeRouter.get('/test',verifyAuthorize,success)

module.exports = authorizeRouter

