'use strict';

const Koa = require("koa");
// 注意 require('koa-router') 返回的是函数:
const router = require("./router");
const middleware = require("./middleware");
const app = new Koa();

middleware(app);

router(app);

app.listen(3333, () => {
    console.log("正在监听3333端口");
});
