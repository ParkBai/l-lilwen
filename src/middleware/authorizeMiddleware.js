const jwt = require('jsonwebtoken')

const errorType = require('../constants/errorType')
const { getUserByName } = require ('../service/userService')
const md5password = require('../utils/passwordHandle')
const { PUBLIC_KEY } =require ('../app/config')
const authorizeService =require('../service/authorizeService')


const verifyLogin = async (ctx,next) =>{
  // 获取用户名密码
  const { name,password } = ctx.request.body

  // 判断用户和密码是否为空
  if(!name || !password){
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error,ctx)
  }

  // 判断用户名是否存在
  const result = await getUserByName(name)
  const user = result[0]
  if(!user){
    const error = new Error(errorType.NAME_DOES_NOT_EXISTS)
    return ctx.app.emit('error',error,ctx)
  }

  // 判断密码是否一致
  if(md5password(password) !== user.password){
    const error = new Error(errorType.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  ctx.user = user
  await next()

}

const verifyAuthorize = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');

  // 2.验证token(id/name/iat/exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }

}

/**
 * 1.很多的内容都需要验证权限: 修改/删除动态, 修改/删除评论
 * 2.接口: 业务接口系统/后端管理系统
 *  一对一: user -> role
 *  多对多: role -> menu(删除动态/修改动态)
 */
const verifyPermission = async (ctx, next) => {

  // 1.获取参数 { commentId: '1' }
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const { id } = ctx.user;

  // 2.查询是否具备权限
  try {
    const isPermission = await authorizeService.checkResource(tableName, resourceId, id);
    if (!isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
}


module.exports = {
  verifyLogin,
  verifyAuthorize,
  verifyPermission
}