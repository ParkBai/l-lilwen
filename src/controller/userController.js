const fs = require('fs')

const { create } = require("../service/userService")
const { AVATAR_PATH } = require ('../constants/filePath')
const fileService = require('../service/fileService')

class UserController {
  async create(ctx,next){
    // 获取用户请求传递的参数
    const user = ctx.request.body
    // 查询数据
    const result = await create(user)

    // 返回数据
    ctx.body = result
  }

  async avatarInfo(ctx, next) {
    // 1.用户的头像是哪一个文件呢?
    const { userId } = ctx.params;
    const avatarInfo = await fileService.getAvatarByUserId(userId);

    // 2.提供图像信息
    ctx.response.set('content-type', avatarInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController()