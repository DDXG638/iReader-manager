const InfoService = require('../service/info');

module.exports = {
    // 广告图片
    ad: async(ctx, next) => {
        let {userid, starttime, type} = ctx.request.body
        // console.log(userid+'--'+starttime+'-'+type)
        ctx.send({
            code: 0,
            data: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2446012481,3517952708&fm=27&gp=0.jpg',
            msg: ''
        })
    },
    getTagsList: async(ctx, next) => {
        // console.log(ctx);
        let {channel} = ctx.request.body;
        //console.log('dd',channel);
        let res = null;
        if (channel && channel === 'channel') {
            res = await InfoService.getTagsList("0");
        } else {
            res = await InfoService.getTagsList("1");
        }

        // console.log(res);

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
                msg: '数据库返回异常'
            });
        }
    },
    getTagsListAll: async(ctx, next) => {
        let res = await InfoService.getTagsListAll();
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
                msg: '数据库返回异常'
            });
        }
    },
    getNewsList: async(ctx, next) => {
        let {classid, page, userid, firsttime, count, time} = ctx.request.body;
        // console.log(ctx.request.query);
        let countNum = parseInt(count),
            pageNum = parseInt(page),
            skipNum = (pageNum - 1) * countNum;
        let res = await InfoService.getNewsList(classid, skipNum, countNum);

        if (res && res.length > 0) {
            ctx.send({
                code: 0,
                data: res,
                msg: ''
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '没有更多数据了！'
            });
        }
    },
    // 获取新闻详情页面的数据
    getNewsDetail: async(ctx, next) => {
        let {userid = '', id = '', datafrom} = ctx.request.body;
        // console.log(ctx.request.body);

        let res = await InfoService.getNewsDetail(id);
        if (res) {
            let plnum = res.comments.length;
            let collectnum = res.collectIds.length;
            let giveupnum = res.userLikes.length;
            let collect = ''; // 是否收藏标识
            let giveup = ''; // 是否点赞标识
            if (collectnum > 0 && res.collectIds.indexOf(userid) > -1) {
                collect = userid;
            }
            if (giveupnum > 0 && res.userLikes.indexOf(userid) > -1) {
                giveup = userid;
            }
            res.plnum = plnum;
            res.collectnum = collectnum;
            res.giveupnum = giveupnum;
            res.collect = collect;
            res.giveup = giveup;
            ctx.send({
                code: 0,
                data: res,
                msg: ''
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '未获取到数据！'
            });
        }
    },
    getNewsListManager: async (ctx, next) => {
        let {classid, page, count} = ctx.request.body;
        // console.log(ctx.request.query);
        let countNum = parseInt(count),
            pageNum = parseInt(page),
            skipNum = (pageNum - 1) * countNum;
        let res = await InfoService.getNewsListManager(classid, skipNum, countNum);

        if (res.data && res.data.length > 0) {
            ctx.send({
                code: 0,
                data: res.data,
                msg: '',
                total: res.total
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '没有更多数据了！'
            });
        }
    },
    // 用户点赞
    UserOperation: async (ctx, next) => {
        // type:1 点赞，type:2 收藏，3：评论
        let {user_id, newsDetail_id, type, content} = ctx.request.body;
        let res = null;
        if (type === '1') {
            res = await InfoService.addLike(user_id, newsDetail_id);
            if (res.nModified > 0) {
                ctx.send({
                    code: 0,
                    data: {},
                    msg: '点赞成功！'
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: {},
                    msg: '点赞失败！'
                });
            }
        } else if (type === '2') {
            res = await InfoService.addCollect(user_id, newsDetail_id);
            if (res.nModified > 0) {
                ctx.send({
                    code: 0,
                    data: {},
                    msg: '收藏成功！'
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: {},
                    msg: '收藏失败！'
                });
            }
        } else if (type === '3') {
            res = await InfoService.addComment(user_id, newsDetail_id, content);
            // console.log(res);
            if (res.nModified > 0) {
                ctx.send({
                    code: 0,
                    data: {},
                    msg: '评论成功！'
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: {},
                    msg: '评论失败！'
                });
            }
        } else {
            ctx.send({
                code: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
        // console.log('点赞', res);
    },
    // 获取点赞用户
    getLikeUsers: async (ctx, next) => {
        let {newsDetail_id} = ctx.request.query;
        let res = await InfoService.getLikeUsers(newsDetail_id);
        // console.log(res);
        ctx.send({
            code: 0,
            data: res,
            msg: ''
        });
    },
    // 获取用户点赞的新闻
    getLikeNews: async (ctx, next) => {
        let {user_id} = ctx.request.query;
        let res = await InfoService.getLikeNews(user_id);
        // console.log(res);
        ctx.send({
            code: 0,
            data: res,
            msg: ''
        });
    },
    // 获取新闻评论列表
    getComment: async (ctx, next) => {
        let {newsDetail_id, user_id} = ctx.request.body;
        let res = await InfoService.getComment(newsDetail_id);
        if (res) {
            let selfComments = [];
            let allComments = [];
            for (let item of res.comments) {
                if (item.fromUser._id == user_id) {
                    selfComments.push(item);
                } else {
                    allComments.push(item);
                }
            }
            console.log(selfComments);
            ctx.send({
                code: 0,
                data: {allComments, selfComments},
                msg: ''
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '获取新闻评论列表失败'
            });
        }
    },
    // 获取用户收藏列表
    getUserCollects: async (ctx, next) => {
        let {userid} = ctx.request.body;
        let res = await InfoService.getUserCollects(userid);
        // console.log(res);
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
                msg: '获取用户收藏列表失败'
            });
        }
    },
    // 获取用户评论列表
    getUserComment: async (ctx, next) => {
        let {user_id, page} = ctx.request.body;
        if (page > 1) {
            ctx.send({
                code: 1,
                data: [],
                msg: ''
            });
            return;
        }
        let res = await InfoService.getUserComment(user_id);
        let result = [];
        if (res) {
            // 对返回的数据进行封装
            for (let newsItem of res) {
                for (let item of newsItem.comments) {
                    if (item.fromUser._id == user_id) {
                        let resultItem = {
                            _id: newsItem._id,
                            id: newsItem.id,
                            classid: newsItem.classid,
                            title: newsItem.title,
                            titlepic: newsItem.titlepic || newsItem.ptitlepic || '',
                            content: item.content,
                            time: item.time,
                            headimgurl: item.fromUser.headimgurl,
                            nickname: item.fromUser.nickname,
                            username: item.fromUser.username,
                            commentId: item._id
                        };
                        result.push(resultItem);
                    }
                }
            }
            ctx.send({
                code: 0,
                data: result,
                msg: ''
            });
        } else {
            ctx.send({
                code: 1006,
                data: '',
                msg: '获取用户评论列表失败'
            });
        }
    },
    // 获取用户收藏数和评论数
    getNum: async (ctx, next) => {
        let {userid} = ctx.request.body;
        //console.log(userid);
        if (userid) {
            let collectNum = await InfoService.getUserCollectsNum(userid);
            let commentNum = await InfoService.getUserCommentNum(userid);
            //console.log(collectNum +'---'+ commentNum);
            ctx.send({
                code: 0,
                data: {
                    collectnum: collectNum,
                    plnum: commentNum
                },
                msg: '参数错误！'
            });
        } else {
            ctx.send({
                code: 1003,
                data: {},
                msg: '参数错误！'
            });
        }


    }
}
