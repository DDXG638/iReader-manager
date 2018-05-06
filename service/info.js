'use strict';

const mongoose = require('mongoose');
const NewsListsSchema  = require("../models/newsLists");
const NewsLists = mongoose.model("NewsLists", NewsListsSchema);
const NewsDetailSchema = require('../models/newsDetail');
const NewsDetail = mongoose.model("NewsDetail", NewsDetailSchema);
const TagsSchema = require('../models/tags');
const Tags = mongoose.model("Tags", TagsSchema);
const UserSchema = require('../models/user');
const User = mongoose.model('User', UserSchema);

module.exports = {
    saveNewsListsItem: async(id = '', json = {}) => {
        if (await NewsLists.findOne({id})) {
            return {
                code: 1001,
                data: {},
                msg: '已经存在该条信息'
            };
        } else {
            let _newsLists = new NewsLists(json);

            try {
                _newsLists = await _newsLists.save();
            } catch (err) {
                return {
                    cond: 1002,
                    data: err,
                    msg: '插入新闻列表信息失败！'
                };
            }

            return {
                code: 0,
                data: _newsLists,
                msg: '插入新闻列表数据成功！'
            };
        }
    },
    saveNewsDetail: async(id, item) => {
        if (await NewsDetail.findOne({id})) {
            return {
                code: 1001,
                data: {},
                msg: '已经存在该条新闻信息'
            };
        } else {
            let _newsDetial = new NewsDetail(item);

            try {
                _newsDetial = _newsDetial.save();
            } catch (err) {
                return {
                    cond: 1002,
                    data: err,
                    msg: '插入新闻列表信息失败！'
                };
            }

            return {
                code: 0,
                data: _newsDetial,
                msg: '插入新闻列表数据成功！'
            };
        }
    },
    addTagsList: async(classid, item) => {
        // 获取tag列表
        if (await Tags.findOne({classid})) {
            return {
                code: 1001,
                data: {},
                msg: '已经存在该分类'
            };
        } else {
            let _tags = new Tags(item);

            try {
                _tags = _tags.save();
            } catch (err) {
                return {
                    cond: 1002,
                    data: err,
                    msg: '插入新闻分类失败！'
                };
            }
            // console.log(_tags);
            return {
                code: 0,
                data: _tags,
                msg: '插入新闻分类成功！'
            };
        }
    },
    getTagsList: async (showclass) => {
        let result = await Tags.find({showclass, classid: {$ne: '10'}}, '-_id -__v');
        return result;
    },
    getTagsListAll: async () => {
        let result = await Tags.find({}, '-_id -__v');
        return result;
    },
    getNewsList: async (classid, skipNum, count) => {
        let res = await NewsDetail.find({classid}, '-__v -giveupnum -collectnum -newstext -infotags -giveup -collect').sort({newstime: '-1'}).skip(skipNum).limit(count);
        // let res = await NewsDetail.findOne({_id: newsDetail_id}).populate({path:'comments.fromUser'});
        return res;
    },
    // 用户点赞
    addLike: async (user_id, newsDetail_id) => {
        let res = await NewsDetail.update({_id: newsDetail_id}, {$push: {userLikes: {_id: user_id}}});
        // console.log("点赞", res);
        return res;
    },
    // 收藏操作
    addCollect: async (user_id, newsDetail_id) => {
        let res = await NewsDetail.update({_id: newsDetail_id}, {$push: {collectIds: {_id: user_id}}});
        // console.log("点赞", res);
        return res;
    },
    // 评论操作
    addComment: async (user_id, newsDetail_id, content) => {
        let res = await NewsDetail.update({_id: newsDetail_id}, {$push: {comments: {fromUser: user_id, content}}});
        // console.log("点赞", res);
        return res;
    },
    // 获取点赞用户将信息
    getLikeUsers: async (newsDetail_id) => {
        let res = await NewsDetail.findOne({_id: newsDetail_id}, 'userLikes').populate({path:'userLikes'});
        // let res = await NewsDetail.aggregate().unwind('comments').match({_id:newsDetail_id}).populate({path:'comments.newsDetail'}).group({_id:null});
        return res;
    },
    // 获取用户点赞新闻列表
    getLikeNews: async (user_id) => {
        let res = await NewsDetail.find({userLikes: user_id});
        return res;
    },
    // 获取新闻的评论列表 findOne({_id: newsDetail_id})
    getComment: async (newsDetail_id) => {
        let res = await NewsDetail.findOne({_id: newsDetail_id}, '-newstext -titlepic -titlepic2 -titlepic3 -titleurl').populate({path:'comments.fromUser'});
        // let res = await NewsDetail.aggregate().unwind('comments').match({_id:newsDetail_id}).populate({path:'comments.newsDetail'}).group({_id:null});
        return res;
    },
    // 获取用户收藏列表
    getUserCollects: async (user_id) => {
        let res = await NewsDetail.find({collectIds: user_id});
        return res;
    },
    // 获取用户评论列表
    getUserComment: async (user_id) => {
        let res = await NewsDetail.find().select('_id id classid title titlepic ptitlepic comments').where('comments.fromUser').equals(user_id).populate({path:'comments.fromUser'});
        // console.log(res);
        return res;
    },
    // 获取用户收藏列表
    getUserCollectsNum: async (user_id) => {
        let res = await NewsDetail.find({collectIds: user_id}).count();
        return res;
    },
    // 获取用户评论列表
    getUserCommentNum: async (user_id) => {
        let res = await NewsDetail.find().where('comments.fromUser').equals(user_id).count();
        return res;
    },


    // 后台管理-获取新闻数据
    getNewsListManager: async(classid, skipNum, count) => {
        let res = await NewsDetail.find({classid}, '-__v -giveupnum -collectnum -infotags -giveup -collect').skip(skipNum).limit(count);
        let total = await NewsDetail.find({classid}).count();
        return {
            data: res,
            total: total
        };
    },
    // 获取新闻详情页面的数据
    getNewsDetail: async (_id) => {
        let res = await NewsDetail.findOne({_id}, '-__v -titlepic -titlepic2 -titlepic3 -ptitlepic -isgood -firsttitle -playtime -nlist -time')
            .populate({path:'comments.fromUser'});
        // let res = await NewsDetail.findOne({_id: newsDetail_id}).populate({path:'comments.fromUser'});
        return res;
    },
    // 管理后台获取新闻详情页面
    getNewsDetailManager: async (id) => {
        let res = await NewsDetail.findOne({id}, '-__v -isgood -firsttitle -playtime -nlist -time');
        return res;
    },
    // 后台管理-修改新闻数据
    editNewsDetail: async (id, classid, title, befrom, newstext, titlepic, titlepic2, titlepic3, ptitlepic) => {
        let res = await NewsDetail.update({id}, {$set: {classid, title, befrom, newstext, titlepic, titlepic2, titlepic3, ptitlepic}});
        //console.log('修改结果', res);
        if (res.ok === 1) {
            if (res.n === 1 && res.nModified === 1) {
                return {
                    code: 0,
                    data: {},
                    msg: '编辑新闻信息成功！'
                }
            } else {
                return {
                    code: 1008,
                    data: {},
                    msg: '数据未修改成功！'
                }
            }
        } else {
            return {
                code: 1006,
                data: res,
                msg: '更改新闻信息失败!'
            }
        }
    },
    // 后台管理-修改分类信息
    editNewsTags: async (classid, classname, showclass) => {
        let res = await Tags.update({classid}, {$set: {classname, showclass}});
        if (res.ok === 1) {
            if (res.n === 1 && res.nModified === 1) {
                return {
                    code: 0,
                    data: {},
                    msg: '更改分类信息成功！'
                }
            } else {
                return {
                    code: 1008,
                    data: {},
                    msg: '数据未修改成功！'
                }
            }
        } else {
            return {
                code: 1006,
                data: res,
                msg: '更改分类信息失败!'
            }
        }
    },
    // 后台管理-删除分类信息
    deleteTags: async (classid) => {
        let res = await Tags.remove({classid});
        if (res.n === 1 && res.ok === 1) {
            return {
                code: 0,
                data: {},
                msg: '删除成功！'
            };
        } else {
            return {
                code: 1009,
                data: res,
                msg: '删除失败！'
            };
        }
    },
    // 后台管理-删除新闻
    removeNews: async (id) => {
        let res = await NewsDetail.remove({id});
        if (res.n === 1 && res.ok === 1) {
            return {
                code: 0,
                data: {},
                msg: '删除成功！'
            };
        } else {
            return {
                code: 1009,
                data: res,
                msg: '删除成功！'
            };
        }
    },
    // 后台管理-更新新闻数据
    changeData: async (classid) => {
        let res = await NewsDetail.update({id: "6533404616221000195"},{$set: {playtime: '123'}});
        return res;
    },
    // 后台管理-获取评论信息
    getCommentLists: async (userId) => {
        let res = await NewsDetail.find().select('_id classid befrom title comments').where('comments.fromUser').equals(userId).populate({path:'comments.fromUser'});
        // console.log(res);
        return res;
    },
    // 管理后台-获取新闻评论信息
    getNewsCommentLists: async (newsDetailId) => {
        let res = await NewsDetail.findOne({_id: newsDetailId}).select('_id classid befrom title comments').populate({path:'comments.fromUser'});
        // let res = await NewsDetail.aggregate().unwind('comments').match({_id:newsDetail_id}).populate({path:'comments.newsDetail'}).group({_id:null});
        return res;
    },
    // 后台管理-删除评论 userId、newsDetailId
    deleteComment: async (commentId, newsDetailId) => {
        let res = await NewsDetail.update({_id: newsDetailId}, {$pull: {comments: {_id: commentId}}});
        if (res.n === 1 && res.ok === 1) {
            return {
                code: 0,
                data: res,
                msg: '删除评论成功！'
            };
        } else {
            return {
                code: 1009,
                data: "",
                msg: '删除评论失败！'
            };
        }
    },
    // 新闻搜索
    searchNews: async (key, skipNum, countNum) => {
        let reg = new RegExp(key, 'i');
        let res = await NewsDetail.find({$or: [{title: {$regex: reg}}, {befrom: {$regex: reg}}]})
            .select('-newstext -infotags -userLikes -collectIds -comments')
            .sort({newstime: '-1'})
            .skip(skipNum)
            .limit(countNum);
        return res;
    }
};
