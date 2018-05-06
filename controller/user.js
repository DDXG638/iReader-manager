const UserService = require('../service/user');

module.exports = {
    register: async(ctx, next) => {
        let {username, password, nickname} = ctx.request.body;
        let res = await UserService.register({username, password, nickname});
        ctx.send(res);
    },
    checkedUser: async(ctx, next) => {
        let {username} = ctx.request.body;
        let res = await UserService.checkedUser(username);
        ctx.send(res);
    },
    login: async(ctx, next) => {
        let {username, password} = ctx.request.body;
        let res = await UserService.login(username, password);
        ctx.send(res);
    },
    /*getNum: async(ctx, next) => {
        let {userid} = ctx.request.body;
        let collectsNum = getUserCollectsNum
        if (!userid) {
            ctx.send({
                code: 1003,
                data: '',
                msg: '参数错误'
            });
            return;
        }
        let res = await UserService.getNum(userid);
        if (res.code === 0) {
            if (rdata && rdata === 'allnum') {
                ctx.send({
                    code: 0,
                    data: {
                        collectnum: res.data.collectIds.length,
                        plnum: res.data.comments.length
                    },
                    msg: ''
                });
            } else {
                ctx.send({
                    code: 0,
                    data: res.data.collectIds,
                    msg: ''
                });
            }
        } else {
            ctx.send(res);
        }
    },*/
    // 添加收藏新闻
    addCollect: async (ctx, next) => {
        let {wdata, userid, id, datafrom} = ctx.request.body;
        // console.log(ctx.request.query);
        if (!userid) {
            ctx.send({
                code: 1003,
                data: '',
                msg: '未登录'
            });
            return;
        }

        if (wdata === 'collect') {
            // 收藏
            let res = await UserService.addCollect(userid, id);
            // console.log(res);
            if (res.nModified > 0) {
                ctx.send({
                    code: 0,
                    data: {},
                    msg: '收藏成功！'
                });
            } else {
                ctx.send({
                    code: 0,
                    data: {},
                    msg: '收藏失败！'
                });
            }

        } else if (wdata === 'giveup') {
            // 点赞
            ctx.send({
                code: 0,
                data: {},
                msg: '点赞成功！'
            });
        } else {
            ctx.send({
                code: 0,
                data: {},
                msg: '不明的指令'
            });
        }
    },
    // 后台管理-获取所有用户信息
    getUsersAll: async (ctx, next) => {
        let {page = 1, pageCount = 10} = ctx.request.body;
        let pageNum = parseInt(page),
            pageCountNum = parseInt(pageCount),
            skipNum = (pageNum - 1) * pageCountNum;
        let res = await UserService.getUsersAll(skipNum, pageCountNum);
        if (res.data) {
            ctx.send({
                code: 0,
                data: res.data,
                msg: '',
                total: res.total
            });
        } else {
            ctx.send({
                code: 1006,
                data: res,
                msg: '数据返回异常！'
            });
        }
    },
    // 后台管理-设置/取消用户为管理员
    setUserManager: async (ctx, next) => {
        let {username, isManager = '0'} = ctx.request.body;
        if (username && username.length > 2) {
            let res = await UserService.setUserManager(username, isManager);
            ctx.send(res);
        } else {
            ctx.send({
                code: 1003,
                data: '',
                msg: '参数错误'
            });
        }
    }
};
