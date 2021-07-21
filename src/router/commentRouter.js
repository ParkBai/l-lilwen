const Router = require('koa-router');

const {
  verifyAuthorize,
  verifyPermission
} = require('../middleware/authorizeMiddleware');
const {
  create,
  reply,
  update,
  remove,
  list
} = require('../controller/commentController')

const commentRouter = new Router({ prefix: '/comment' });

// 发表评论
commentRouter.post('/', verifyAuthorize, create);
commentRouter.post('/:commentId/reply', verifyAuthorize, reply);

// 修改评论
commentRouter.patch('/:commentId', verifyAuthorize,verifyPermission ,update);

// 删除评论
commentRouter.delete('/:commentId', verifyAuthorize, verifyPermission, remove);

// 获取评论列表
commentRouter.get('/', list);

module.exports = commentRouter;