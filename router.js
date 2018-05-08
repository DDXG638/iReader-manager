'use strict';

const router = require("koa-router")();
const HomeController = require("./controller/home");
const ApiController = require('./controller/api');
const ManagerController = require('./controller/manager');
const UserController = require('./controller/user');
const WeatherController = require('./controller/weather');
const DefaultConfigController = require('./controller/defaultConfig');

module.exports = (app) => {
    // 设置路由
    router.get("/", HomeController.index);

    // 获取get请求连接中的参数
    router.get("/main", HomeController.main);

    router.get("/home/:id/:name", HomeController.homeParams);

    router.get('/user', HomeController.user);

    // post提交获取数据
    // router.post("/user/register", HomeController.register);

    router.get("/404", HomeController.errorPage);

    // 获取广告图片
    router.post("/defaultConfig/getAd", DefaultConfigController.ad);
    // 获取搜索框的数据
    router.post("/api/getSearchInfo", DefaultConfigController.search);

    // 获取新闻栏目的分类
    router.post("/api/getTagsList", ApiController.getTagsList);

    // 获取列表数据
    router.post("/api/getNewsList", ApiController.getNewsList);

    // 获取新闻详情页面数据
    router.post("/api/getNewsDetail", ApiController.getNewsDetail);

    // 用户-注册
    router.post("/user/register", UserController.register);
    // 用户-登陆
    router.post("/user/login", UserController.login);
    // 用户-检验用户名是否存在
    router.post("/user/checkedUser", UserController.checkedUser);
    // 用户-修改用户信息
    router.post("/user/setUserInfo", UserController.setUserInfo);
    // 用户-点赞、收藏、评论
    router.post("/user/operation", ApiController.UserOperation);
    // 根据新闻获取点赞的用户信息
    // router.get("/user/getLikeUsers", ApiController.getLikeUsers);
    // 根据用户获取点赞的新闻
    // router.get("/newsDetail/getLikeNews", ApiController.getLikeNews);
    // 获取新闻评论列表
    router.post("/newsDetail/getComment", ApiController.getComment);
    // 获取用户收藏列表
    router.post("/newsDetail/getUserCollect", ApiController.getUserCollects);
    // 获取用户评论列表
    router.post("/newsDetail/getUserComment", ApiController.getUserComment);
    // 删除删除评论 userId、newsDetailId
    router.post("/comment/deleteComment", ManagerController.deleteComment);


    // 获取评论数和收藏列表
    router.post("/user/getNum", ApiController.getNum);

    // 添加收藏新闻、点赞
    router.post("/user/addCollect", UserController.addCollect);

    // 获取及时天气信息
    router.post("/weather/getNowWeather", WeatherController.getNowWeather);
    // 获取三天的天气信息
    router.post("/weather/getThreeWeather", WeatherController.getThreeWeather);


    // 后台管理系统的接口
    // 获取分类信息
    router.post("/manager/getTagsList", ApiController.getTagsListAll);
    // 添加新闻栏目分类
    router.post("/manager/addNewsTags", ManagerController.addNewsTags);
    // 修改新闻分类信息（分类名称和是否展示）
    router.post("/manager/editNewsTags", ManagerController.editNewsTags);
    // 删除新闻分类信息
    router.post("/manager/deleteTags", ManagerController.deleteTags);

    // 获取用户信息
    router.post("/manager/getUsersAll", UserController.getUsersAll);

    // 设置用户为管理员
    router.post("/manager/setUserManager", UserController.setUserManager);

    // 爬取今日头条的新闻数据
    router.get("/manager/getNewsInfo", ManagerController.getNewsInfo);

    // 后台管理-获取新闻信息数据
    router.post("/manager/getNewsLists", ApiController.getNewsListManager);
    // 后台管理-添加新闻信息
    router.post("/manager/saveNewsDetail", ManagerController.saveNewsDetail);
    // 后天管理-删除新闻
    router.post("/manager/removeNews", ManagerController.removeNews);
    // 管理后台-获取新闻详情
    router.post("/manager/getNewsDetail", ManagerController.getNewsDetail);
    // 后台管理-编辑新闻数据
    router.post("/manager/editNewsDetail", ManagerController.editNewsDetail);


    // 后台管理-获取评论信息 type:1 新闻评论；type:2 用户评论 userId, newsDetailId
    router.post("/manager/getCommentLists", ManagerController.getCommentLists);
    // 后台管理-删除评论 userId、newsDetailId comment
    router.post("/manager/deleteComment", ManagerController.deleteComment);

    // 获取七牛的key 和 token
    router.post("/manager/getQiNiuInfo", ManagerController.getQiNiuInfo);

    // 改变schema后更新新闻数据
    router.get("/manager/changeData", ManagerController.changeData);

    // 添加默认配置信息
    router.get("/manager/addDefaultConfig", DefaultConfigController.addConfig);

    // 管理后台-获取默认配置信息
    router.post("/manager/getDefaultConfig", DefaultConfigController.getDefaultConfig);
    // 后台管理-删除推荐新闻
    router.post("/manager/deleteConfig", DefaultConfigController.deleteConfig);
    // 后台管理-添加推荐新闻（搜索框管理）
    router.post("/manager/addHotNewsDetail", DefaultConfigController.addHotNewsDetail);
    // 后台管理-修改配置薪资 {openPageUrl, openPageRouter, searchTip}
    router.post("/manager/changeConfig", DefaultConfigController.changeConfig);


    // 调用路由中间件
    app.use(router.routes());
};