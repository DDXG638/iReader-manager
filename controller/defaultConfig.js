const DefaultConfig = require("../service/defaultConfig");
const InfoService = require('../service/info');

module.exports = {
    // 广告图片
    ad: async(ctx, next) => {
        let {userid, starttime, type} = ctx.request.body;
        // console.log(userid+'--'+starttime+'-'+type)
        let res = await DefaultConfig.getAd();
        // console.log(res);
        if (res) {
            ctx.send({
                code: 0,
                data: {
                    openPageUrl: res[0].openPageUrl,
                    openPageRouter: res[0].openPageRouter
                },
                msg: ''
            });
        } else {
            ctx.send({
                code: 1003,
                data: '',
                msg: '获取广告图片失败'
            });
        }
    },
    addConfig: async (ctx, next) => {
        let {openPageUrl, openPageRouter, searchTip} = ctx.request.query;
        // console.log(ctx.request.query);
        let config = {
            openPageUrl,
            openPageRouter,
            searchTip
        };
        let res = await DefaultConfig.save(config);
        ctx.send(res);
    },
    search: async(ctx, next) => {
        let {type, key, page = 1, count = 10} = ctx.request.body;
        // 获取热点标题数据
        if (type && type === 'topic') {
            // console.log(type);
            let res = await DefaultConfig.getHotTopic();
            let data = res[0];
            if (data.searchTip) {
                ctx.send({
                    code: 0,
                    data: data.searchTip,
                    msg: ''
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: '',
                    msg: '数据库返回异常！'
                });
            }
            // console.log(res);

        } else if (key && page) {
            // 获取搜索数据
            // console.log(key+"-"+page);
            let pageNum = parseInt(page);
            let countNum = parseInt(count);
            let skipNum = (pageNum - 1) * countNum;
            let res = await InfoService.searchNews(key, skipNum, countNum);
            if (res) {
                ctx.send({
                    code: 0,
                    data: res,
                    msg: ''
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: '',
                    msg: '数据库返回异常！'
                });
            }


        } else {
            // 获取热点数据
            let res = await DefaultConfig.getHotNewsLists();
            if (res) {
                ctx.send({
                    code: 0,
                    data: res,
                    msg: ''
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: '',
                    msg: '数据库返回异常！'
                });
            }
        }
    },
    addHotNewsDetail: async (ctx, next) => {
        let {newsDetailId} = ctx.request.body;
        let res = await DefaultConfig.addHotNewsDetail(newsDetailId);
        // console.log(res);
        if (res.ok === 1 && res.nModified === 1) {
            ctx.send({
                code: 0,
                data: '',
                mas: '添加推荐新闻成功！'
            });
        } else {
            ctx.send({
                code: 1003,
                data: '',
                mas: '添加推荐新闻失败！'
            });
        }
    },
    // 管理后台-获取默认配置信息
    getDefaultConfig: async (ctx, next) => {
        let res = await DefaultConfig.getDefaultConfig();
        if (res) {
            ctx.send({
                code: 0,
                data: res,
                msg: ''
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '数据库返回异常！'
            });
        }
    },
    // 后台管理-删除推荐新闻
    deleteConfig: async (ctx, next) => {
        let {newsDetail_id} = ctx.request.body;
        if (newsDetail_id) {
            let res = await DefaultConfig.deleteConfig(newsDetail_id);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
    },
    changeConfig: async (ctx, next) => {
        let {openPageUrl, openPageRouter, searchTip} = ctx.request.body;
        if (openPageUrl) {
            let res = await DefaultConfig.changeConfig(openPageUrl, openPageRouter, searchTip);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '必须要有开屏页！'
            });
        }
    }

}