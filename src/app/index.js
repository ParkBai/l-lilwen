const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const useRoutes = require('../router')
const errorHandle = require('./errorHandle')


const app = new Koa()

//隐式绑定
app.useRoutes = useRoutes

app.use(bodyParser())
app.useRoutes()
app.on('error',errorHandle)

module.exports = app