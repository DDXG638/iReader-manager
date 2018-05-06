'use strict';

// 集中处理中间件
const path = require("path");
const bodyParser = require("koa-bodyparser");
const nunjucks = require("koa-nunjucks-2");
const staticFiles = require("koa-static");
const miSend = require("./mi-send");
const miHttpError = require('./mi-http-error');
const cors = require("koa2-cors");

module.exports = (app) => {
    app.use(miSend());
    app.use(bodyParser());
    // 指定 public目录为静态资源目录，用来存放 js css images 等
    app.use(staticFiles(path.resolve(__dirname, "../public")));
    app.use(miHttpError({
        errorPageFolder: path.resolve(__dirname, "../errorPage")
    }));
    app.use(nunjucks({
        ext: 'html',
        path: path.join(__dirname, '../view'),// 指定视图目录
        nunjucksConfig: {
            trimBlocks: true // 开启转义 防Xss
        }
    }));

    // 设置跨域问题
    app.use(cors({
        origin: (ctx) => {
            /*if (ctx.url.substr(0, 8) === '/manager') {
                return 'http://localhost:8080';
            }*/
            // return ctx.header.origin;
            return "*";
            // return 'http://localhost:8084';
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    }))

    // 增加错误的监听处理
    app.on("error", (err, ctx) => {
        if (ctx && !ctx.headerSent && ctx.status < 500) {
            ctx.status = 500
        }
        /*if (ctx && ctx.log && ctx.log.error) {
            if (!ctx.state.logged) {
                ctx.log.error(err.stack)
            }
        }*/
    })
};