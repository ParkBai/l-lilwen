const Router = require('koa-router')
const { create,avatarInfo } = require('../controller/userController')
const { verifyUser, handlePassword } = require('../middleware/userMiddleware')


const userRouter = new Router({ prefix: '/users' })

userRouter.post('/',verifyUser,handlePassword,create)

userRouter.get('/:userId/avatar', avatarInfo);

module.exports = userRouter