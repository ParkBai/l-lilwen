const fs = require('fs')
const dynamicService = require('../service/dynamicService')
const fileService = require ('../service/fileService')
const { PICTURE_PATH } = require('../constants/filePath')

class dynamicController{
  async create(ctx,next){
    // 1.获取数据(user_id, content)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 2.将数据插入到数据库
    const result = await dynamicService.create(userId, content);
    ctx.body = result;
  }

  async detail(ctx, next) {
    // 1.获取数据(dynamictId)
    const dynamicId = ctx.params.dynamicId;

    // 2.根据id去查询这条数据
    const result = await dynamicService.getDynamicById(dynamicId);
    ctx.body = result;
  }

  async list(ctx, next) {
    // 1.获取数据(offset/size)
    const { offset, size } = ctx.query;

    // 2.查询列表
    const result = await dynamicService.getdynamicList(offset, size);
    ctx.body = result;
  }

  async update(ctx, next) {
    // 1.获取参数
    const { dynamicId } = ctx.params;
    const { content } = ctx.request.body;

    // 2.修改内容
    const result = await dynamicService.update(content, dynamicId);
    ctx.body = result;
  }

  async remove(ctx, next) {
    // 1.获取dynamicId
    const { dynamicId } = ctx.params;

    // 2.删除内容
    const result = await dynamicService.remove(dynamicId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1.获取标签和动态id
    const { labels } = ctx;
    const { dynamicId } = ctx.params;

    // 2.添加所有的标签
    for (let label of labels) {
      // 2.1.判断标签是否已经和动态有关系
      const isExist = await dynamicService.hasLabel(dynamicId, label.id);
      if (!isExist) {
        await dynamicService.addLabel(dynamicId, label.id);
      }
    }

    ctx.body = "给动态添加标签成功~";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if (types.some(item => item === type)) {
      filename = filename + '-' + type;
    }

    ctx.response.set('content-type', fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }


}

module.exports = new dynamicController()