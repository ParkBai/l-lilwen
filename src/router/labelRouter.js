const Router = require('koa-router');

const {
  verifyAuthorize
} = require('../middleware/authorizeMiddleware');
const {
  create,
  list
} = require('../controller/labelController')

const labelRouter = new Router({ prefix: '/label' });

labelRouter.post('/', verifyAuthorize, create);
labelRouter.get('/', list);

module.exports = labelRouter;