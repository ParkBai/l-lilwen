const Router = require('koa-router')
const {
  verifyAuthorize,
  verifyPermission
} = require('../middleware/authorizeMiddleware')

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/dynamicController')

const { verifyLabelExists } = require('../middleware/labelMiddleware')

const dynamicRouter = new Router({ prefix: '/dynamic' })

dynamicRouter.post('/', verifyAuthorize, create)
dynamicRouter.get('/:dynamicId', detail)
dynamicRouter.get('/',list)

// 1.用户必须登录 2.用户具备更改权限(patch)
dynamicRouter.patch('/:dynamicId', verifyAuthorize, verifyPermission, update);
dynamicRouter.delete('/:dynamicId', verifyAuthorize, verifyPermission, remove);

// 给动态添加标签
dynamicRouter.post('/:dynamicId/labels', verifyAuthorize, verifyPermission, verifyLabelExists, addLabels);

// 动态配图的服务
dynamicRouter.get('/images/:filename', fileInfo);

module.exports = dynamicRouter