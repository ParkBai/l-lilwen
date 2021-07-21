const errorType = require('../constants/errorType')
const { getUserByName } = require('../service/userService')
const md5password = require('../utils/passwordHandle')

const verifyUser = async (ctx,next) =>{
  // 获取用户名密码
  const { name,password } = ctx.request.body

  // 判断用户名密码不能为空
  if(!name || !password){
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error,ctx)
  }

  // 判断用户名是否已被注册
  const result = await getUserByName(name)
  if(result.length){
    const error = new Error(errorType.NAME_IS_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  await next()

}

const handlePassword = async (ctx,next) =>{
  const { password } =ctx.request.body
  ctx.request.body.password = md5password(password)

  await next()
}

module.exports = {
  verifyUser,
  handlePassword
}