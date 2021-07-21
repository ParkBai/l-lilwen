const errorType = require('../constants/errorType')

const errorHandle = (error,ctx) =>{
  let status,message

  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400
      message = 'name or password is required'
      break;
    case errorType.NAME_IS_EXISTS:
      status = 409
      message = 'name does exists'
      break;
    case errorType.NAME_DOES_NOT_EXISTS:
      status = 400
      message = 'name does not exists'
      break;
    case errorType.PASSWORD_IS_INCORRENT:
      status = 400
      message = 'password is incorrent'
      break;
    case errorType.UNAUTHORIZATION:
      status = 401
      message = 'token is unauthorized'
      break;
    case errorType.UNPERMISSION:
      status = 401
      message = 'no operated power'
      break;
  
    default:
      status = 404
      message = 'NOT FOUND'
      break;
  }

  ctx.status = status
  ctx.body = message
}

module.exports = errorHandle