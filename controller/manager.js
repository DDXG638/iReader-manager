const http = require('http');
const qs = require('querystring');
const iconv = require('iconv-lite');
const InfoService = require('../service/info');
const uuidV1 = require('uuid/v1');
const utils = require('../utils/utils');
const qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
// const ACCESS_KEY = 'OIyjPaJoskgqUyO4Bw6EdDlhcYZZxGIYikaN3gpo';
// const SECRET_KEY = 'rFikDPG1Z285iIRVhKxWJfrL4SXoJYhGFEHYqRqm';
//
// const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

// qiniu.conf.ACCESS_KEY = 'OIyjPaJoskgqUyO4Bw6EdDlhcYZZxGIYikaN3gpo';
// qiniu.conf.SECRET_KEY = 'rFikDPG1Z285iIRVhKxWJfrL4SXoJYhGFEHYqRqm';

//要上传的空间


module.exports = {
    // 爬取今日头条的新闻信息
    getNewsInfo: async (ctx, next) => {
        let tagName = ctx.request.query.tag || '';
        if (tagName.length < 1) {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
            return;
        }

        let tags = {
            '__all__': "10",
            'news_hot': '11',
            'news_society': '12',
            'news_entertainment': '13',
            'news_military': '14',
            'news_tech': '15',
            'news_sports': '16',
            'news_finance': '17',
            'news_world': '18',
            'news_fashion': '19',
            'news_game': '20',
            'news_baby': '21',
            'news_travel': '22',
            'news_history': '23',
            'news_discovery': '24',
            'news_food': '25',
            'news_story': '26',
            'news_regimen': '27',
            'news_essay': '28',
        };

        let dataArr = await fetchNewsListsData(tagName);
        // 记录成功插入的新闻id
        let sucInsert = [];
        // 记录没有插入的新闻id
        let errInsert = [];

        for (let item of dataArr) {
            let id = item.item_id;

            if (item.article_type === 0 && !item.video_id) {

                // 获取详情页面的数据
                let detailData = await fetchNewsDetailData(id);

                let p1 = item.image_list[0] && item.image_list[0].url;
                let p2 = item.image_list[1] && item.image_list[1].url;
                let p3 = item.image_list[2] && item.image_list[2].url;

                let newItem = {
                    id: item.item_id,
                    classid: tags[tagName],
                    time: item.datetime,
                    plnum: item.comment_count,
                    title: item.title || '',
                    newstime: item.cursor,
                    onclick: "",
                    befrom: item.media_name,
                    isgood: item.digg_count,
                    firsttitle: item.hot,
                    playtime: "",
                    titlepic: p1 || '',
                    nlist: item.label,
                    titlepic2: p2 || '',
                    titlepic3: p3 || '',
                    datafrom: "news2",
                    ptitlepic: p3  || '',
                    playonlineurl: "",
                    titleurl: "",

                    giveupnum: 0,
                    collectnum: 0,
                    newstext: detailData.content || "",
                    infotags: "",
                    giveup: "",
                    collect: ""
                };

                let res = await InfoService.saveNewsDetail(newItem.id, newItem);
                if (res.code === 0) {
                    sucInsert.push(id);
                } else {
                    errInsert.push(id);
                }
            } else {
                errInsert.push(id);
            }
        }

        ctx.send({
            code: 0,
            data: {
                successInsert: sucInsert
            },
            msg: '未成功插入的新闻：' + errInsert.join(",")
        });

    },
    getNewsDetailInfo: async (ctx, next) => {
        let id = '6533074985936749069';
        let params = qs.stringify({
            _signature: 'dW6T8xAYL9C7BRUhGl4AhXVuk-',
            i: id
        });
        let options = {
            protocol : 'http:',
            host: "m.toutiao.com",
            port: 80,
            method: 'GET',
            path: `/i${id}/info/?_signature=dW6T8xAYL9C7BRUhGl4AhXVuk-&i=${id}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-Length': Buffer.byteLength(params)
            }
        };

        // 获取新闻详情页面的数据
        let body = await fetch(options, params);

        let json = JSON.parse(body);

        let detailData = json.data;

        let newDetialItem = {
            id: id,
            classid: '6533074985936749069',
            plnum: detailData.comment_count || 0,
            giveupnum: 0,
            collectnum: 0,
            datafrom: "news2",
            newstext: detailData.content || "",
            infotags: "",
            title: detailData.title,
            titlepic: detailData.url || "",
            playonlineurl: "",
            newstime: detailData.publish_time || Date.now(),
            onclick: "",
            befrom: detailData.detail_source || "今日头条",
            giveup: "",
            collect: ""
        };

        let res = await InfoService.saveNewsDetail(newDetialItem.id, newDetialItem.classid, newDetialItem);

        ctx.send(res);

    },
    addNewsTags: async (ctx, next) => {
        let {classid, classname, classpath, showclass} = ctx.request.body;
        if (classid && classname && classpath && showclass) {
            let res = await InfoService.addTagsList(classid, ctx.request.body);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
    },
    editNewsTags: async (ctx, next) => {
        let {classid, classname, showclass} = ctx.request.body;
        if (classid && classname && showclass) {
            let res = await InfoService.editNewsTags(classid, classname, showclass);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
    },
    deleteTags: async (ctx, next) => {
        let {classid} = ctx.request.body;
        if (classid) {
            let res = await InfoService.deleteTags(classid);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
    },
    saveNewsDetail: async (ctx, next) => {
        let {classid, title, befrom, newstext, titlepic, titlepic2, titlepic3, ptitlepic} = ctx.request.body;
        let id = uuidV1();
        let timechuo = Math.round(new Date() / 1000);
        let newstime = timechuo + '';
        let time = utils.formatTime('Y-m-d H:i:s', timechuo);

        let newItem = {
            id,
            classid,
            time,
            title,
            newstime,
            befrom,
            titlepic,
            titlepic2,
            titlepic3,
            ptitlepic,
            newstext,
        };

        let res = await InfoService.saveNewsDetail(newItem.id, newItem);
        ctx.send(res);
    },
    removeNews: async (ctx, next) => {
        let {id} = ctx.request.body;

        if (id) {
            let res = await InfoService.removeNews(id);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }
    },
    // 获取新闻详情数据
    getNewsDetail: async (ctx, next) => {
        let {id} = ctx.request.body;
        let res = await InfoService.getNewsDetailManager(id);
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
                msg: '未获取到数据！'
            });
        }
    },
    // 编辑新闻数据
    editNewsDetail: async (ctx, next) => {
        let { id, classid, title, befrom, newstext, titlepic, titlepic2, titlepic3, ptitlepic } = ctx.request.body;
        if (id && classid) {
            let res = await InfoService.editNewsDetail(id, classid, title, befrom, newstext, titlepic, titlepic2, titlepic3, ptitlepic);
            ctx.send(res);
        } else {
            ctx.send({
                cond: 1003,
                data: {},
                msg: '参数错误！'
            });
        }

    },
    // 获取七牛的key 和 token
    getQiNiuInfo: (ctx, next) => {
        let accessKey = 'OIyjPaJoskgqUyO4Bw6EdDlhcYZZxGIYikaN3gpo';
        let secretKey = 'rFikDPG1Z285iIRVhKxWJfrL4SXoJYhGFEHYqRqm';
        let bucket = 'ireader2';
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let options = {
            scope: bucket
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);
        ctx.send({
            code: 0,
            data: uploadToken,
            msg: ''
        });
    },
    changeData: async (ctx, next) => {
        let {classid} = ctx.request.query;
        let res = await InfoService.changeData(classid);
        ctx.send({
            code: 0,
            data: res,
            msg: ''
        });
    },
    // 后台管理-获取评论信息 type:1 新闻评论；type:2 用户评论 userId, newsDetailId
    getCommentLists: async (ctx, next) => {
        let {type = 1, userId, newsDetailId, page = 1, count = 10} = ctx.request.body;
        if (userId && type === '2') {
            // 获取用户评论
            let res = await InfoService.getCommentLists(userId);
            let result = [];
            if (res) {
                // 对返回的数据进行封装
                for (let newsItem of res) {
                    for (let item of newsItem.comments) {
                        if (item.fromUser._id == userId) {
                            let resultItem = {
                                _id: newsItem._id,
                                classid: newsItem.classid,
                                title: newsItem.title,
                                befrom: newsItem.befrom,
                                content: item.content,
                                time: item.time,
                                headimgurl: item.fromUser.headimgurl,
                                nickname: item.fromUser.nickname,
                                username: item.fromUser.username,
                                userId: userId,
                                commentId: item._id,
                                likeNum: item.likeNum
                            };
                            result.push(resultItem);
                        }
                    }
                }
                ctx.send({
                    code: 0,
                    data: result,
                    msg: '',
                    total: result.length
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: '',
                    msg: '获取用户评论列表失败'
                });
            }
        } else if (newsDetailId && type === '1') {
            let res = await InfoService.getNewsCommentLists(newsDetailId);
            let result = [];
            if (res) {
                for(let item of res.comments) {
                    let resultItem = {
                        _id: res._id,
                        classid: res.classid,
                        title: res.title,
                        befrom: res.befrom,
                        content: item.content,
                        time: item.time,
                        headimgurl: item.fromUser.headimgurl,
                        nickname: item.fromUser.nickname,
                        username: item.fromUser.username,
                        userId: item.fromUser._id,
                        commentId: item._id,
                        likeNum: item.likeNum
                    };
                    result.push(resultItem);
                }
                ctx.send({
                    code: 0,
                    data: result,
                    msg: '',
                    total: result.length
                });
            } else {
                ctx.send({
                    code: 1006,
                    data: '',
                    msg: '获取新闻评论列表失败'
                });
            }
        } else {
            ctx.send({
                code: 1003,
                data: '',
                mas: '参数错误！'
            });
        }

    },
    // 后台管理-删除评论 userId、newsDetailId
    deleteComment: async (ctx, next) => {
        let {newsDetailId, commentId} = ctx.request.body;
        if (commentId && newsDetailId) {
            let res = await InfoService.deleteComment(commentId, newsDetailId);
            ctx.send(res);
        } else {
            ctx.send({
                code: 1003,
                data: '',
                mas: '参数错误！'
            });
        }

    }
}

function fetch(options = {}, payload = '') {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const client = http.request(options, (res) => {

            res.on('data', (chunk) => {
                // 分次将 buff 数据存入 chunks
                chunks.push(chunk);
            })
            res.on('end', () => {
                // 合并数组生成 buff 对象
                let buff = Buffer.concat(chunks),
                    headers = res.headers;
                // 从响应头中提取 charset
                //let charset = headers['content-type'].match(/(?:charset=)(\w+)/)[1] || 'utf8';
                let charset = 'gbk';
                // 转编码，保持跟响应一致
                let body = iconv.decode(buff, charset);
                resolve(body);
            })
        });
        client.on('error', (err) => {
            console.log('problem with request: ' + err.message);
            reject(err);
        });
        client.write(payload);
        client.end();
    });
}

// 获取新闻列表
async function fetchNewsListsData(tagName) {
    let params = qs.stringify({

    });
    let options = {
        protocol : 'http:',
        host: "m.toutiao.com",
        port: 80,
        method: 'GET',
        path: `/list/?tag=${tagName}&ac=wap&count=20&format=json_raw&as=A1750AFA93BD457&cp=5AA3997ED97F8E1&min_behot_time=0`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Content-Length': Buffer.byteLength(params),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': 'UM_distinctid=1620ed2966d34e-047b2f6dc4894f-3c604504-1fa400-1620ed2966e43f; tt_webid=6531215512046536206; csrftoken=94b052ea800277ab73312ec6c6558687; _ba=BA0.2-20180310-51225-EHDzJLWxfHTLOb7p11Y8; _ga=GA1.2.60490855.1520670139; uuid="w:bbf84da18f0841c49c276af6b52db1bb"; tt_track_id=500b4ac28a14bf6433d1e6c57d1dc3cd; _gid=GA1.2.1354047228.1521018917; bottom-banner-hide-status=true; W2atIF=1',
            'Host': 'm.toutiao.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
    };

    // let body = await fetch(getOptions("/list/?tag=__all__&ac=wap&count=20&format=json_raw&as=A1459A1AE981F1B&cp=5AA9216F217B0E1&min_behot_time=0"), {});
    let body = await fetch(options, params);
    let json = JSON.parse(body);

    return json.data;
}

// 获取新闻详情
async function fetchNewsDetailData(id) {
    let params = qs.stringify({
        _signature: 'BVDVpBAfX6fLO1N2Xnc.1QVQ1b',
        i: id
    });
    let options = {
        protocol : 'http:',
        host: "m.toutiao.com",
        port: 80,
        method: 'GET',
        path: `/i${id}/info/`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Content-Length': Buffer.byteLength(params),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8',
            'Cache-Control': 'no-cache',
            'Host': 'm.toutiao.com',
            'pragma': 'no-cache',
            'Cookie': 'UM_distinctid=1620ed2966d34e-047b2f6dc4894f-3c604504-1fa400-1620ed2966e43f; tt_webid=6531215512046536206; csrftoken=94b052ea800277ab73312ec6c6558687; _ba=BA0.2-20180310-51225-EHDzJLWxfHTLOb7p11Y8; _ga=GA1.2.60490855.1520670139; uuid="w:bbf84da18f0841c49c276af6b52db1bb"; W2atIF=1; __tasessionId=2hjprw0r31525788728712',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        }
    };
    let body = await fetch(options, params);
    let detailJson = JSON.parse(body);
    return detailJson.data;
}

