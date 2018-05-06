'use strict';

const mongoose = require('mongoose');
const DefaultConfigSchema = require('../models/defaultConfig');
const DefaultConfig = mongoose.model("DefaultConfig", DefaultConfigSchema);
const NewsDetailSchema = require('../models/newsDetail');
const NewsDetail = mongoose.model("NewsDetail", NewsDetailSchema);

module.exports = {
    save: async (config) => {
        let _config = new DefaultConfig(config);

        try {
            _config = await _config.save();
        } catch (err) {
            return {
                code: 1002,
                data: '',
                msg: '添加默认配置失败！'
            };
        }
        return {
            code: 0,
            data: _config,
            msg: '添加默认配置成功！'
        };
    },
    getAd: async () => {
        let ad = await DefaultConfig.find().limit(1);
        return ad;
    },
    getHotTopic: async() => {
        // 获取推荐新闻的第一条数据
        let res = await DefaultConfig.find().limit(1);
        return res;
    },
    getHotNewsLists: async() => {
        // 获取热点数据
        // let res = await NewsDetail.find({classid: '11'}, 'id classid time plnum title newstime onclick befrom isgood firsttitle nlist datafrom').sort({plnum: '-1'}).limit(10);
        let res = await DefaultConfig.find({_id: '5acb2a1b67aa582d5024294c'}, 'searchs').populate({path:'searchs', select: 'title _id datafrom classid'});
        return res;
    },
    addHotNewsDetail: async (newsDetail_id) => {
        let res = await DefaultConfig.update({_id: '5acb2a1b67aa582d5024294c'}, {$push: {searchs: newsDetail_id}});
        return res;
    },
    getDefaultConfig: async () => {
        let res = await DefaultConfig.find({_id: '5acb2a1b67aa582d5024294c'}).populate({path:'searchs', select: '_id title classid befrom'});
        return res;
    },
    deleteConfig: async (newsDetail_id) => {
        let res = await DefaultConfig.update({_id: '5acb2a1b67aa582d5024294c'}, {$pull: {searchs: newsDetail_id}});
        if (res.n === 1 && res.ok === 1) {
            return {
                code: 0,
                data: res,
                msg: '删除成功！'
            };
        } else {
            return {
                code: 1009,
                data: {},
                msg: '删除失败！'
            };
        }
    },
    changeConfig: async (openPageUrl, openPageRouter, searchTip) => {
        let res = await DefaultConfig.update({_id: '5acb2a1b67aa582d5024294c'}, {$set: {openPageUrl, openPageRouter, searchTip}});
        if (res.n > 0 && res.ok > 0) {
            return {
                code: 0,
                data: res,
                msg: '修改成功！'
            };
        } else {
            return {
                code: 1009,
                data: {},
                msg: '修改配置失败！'
            };
        }
    }

}
