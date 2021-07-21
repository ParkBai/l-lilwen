const Router = require('koa-router');

const {
  verifyAuthorize
} = require('../middleware/authorizeMiddleware');
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleware/fileMiddleware');

const {
  saveAvatarInfo,
  savePictureInfo
} = require('../controller/fileController');

const fileRouter = new Router({ prefix: '/upload' });

fileRouter.post('/avatar', verifyAuthorize, avatarHandler, saveAvatarInfo);
fileRouter.post('/picture', verifyAuthorize, pictureHandler, pictureResize,savePictureInfo);

module.exports = fileRouter;