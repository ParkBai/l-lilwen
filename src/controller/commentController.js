const service = require('../service/commentService');

class CommentController {
  async create(ctx, next) {
    const { dynamicId, content } = ctx.request.body;
    const { id } = ctx.user;
    const result = await service.create(dynamicId, content, id);
    ctx.body = result;
  }

  async reply(ctx, next) {
    const { dynamicId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    const result = await service.reply(dynamicId, content, id, commentId);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await service.update(commentId, content);
    ctx.body = result;
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await service.remove(commentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    const { dynamicId } = ctx.query;
    const result = await service.getCommentsByDynamicId(dynamicId);
    ctx.body = result;
  }

}

module.exports = new CommentController();