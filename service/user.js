'use strict';

const mongoose = require('mongoose');
const UserSchems = require('../models/user');
const User = mongoose.model('User', UserSchems);
const crypto = require('crypto');
// 密钥
const key = 'ddxg';

module.exports = {
    register: async(user) => {
        if (await User.findOne({username: user.username})) {
            return {
                code: 1001,
                data: {},
                msg: '已经存在该用户'
            };
        } else {
            // 对password进行加密
            let hmac = crypto.createHmac('sha256', key);
            hmac.update(user.password);
            let passwordHex = hmac.digest('hex');
            user.password = passwordHex;

            let _user = new User(user);

            try {
                _user = await _user.save();
            } catch (err) {
                return {
                    code: 1002,
                    data: '',
                    msg: '注册失败！'
                };
            }

            _user.password = "";
            return {
                code: 0,
                data: _user,
                msg: '注册成功！'
            };
        }
    },
    checkedUser: async (username) => {
        if (await User.findOne({username})) {
            return {
                code: 1001,
                data: {},
                msg: '已经存在该用户'
            };
        } else {
            return {
                code: 0,
                data: '',
                msg: '符合要求的username'
            };
        }
    },
    login: async (username, password) => {
        let user = await User.findOne({username});

        if (user) {
            // 加密判断
            let hmac = crypto.createHmac('sha256', key);
            hmac.update(password);
            let passwordHex = hmac.digest('hex');

            if (user.password === passwordHex) {
                user.password = "";
                return {
                    code: 0,
                    data: user,
                    msg: '登陆成功！'
                };
            } else {
                return {
                    code: 1008,
                    data: '',
                    msg: '账号或密码错误！'
                };
            }
        } else {
            return {
                code: 1007,
                data: '',
                msg: '该用户不存在！'
            };
        }
    },
    // 获取评论数、收藏数
    getNum: async (username) => {
        let user = await User.findOne({username}, 'comments collectIds').populate({path:'collectIds'});
        // console.log(user);
        if (user) {
            return {
                code: 0,
                data: user,
                msg: ''
            };
        } else {
            return {
                code: 1004,
                data: '',
                msg: '获取数据失败！'
            };
        }
    },
    // 添加收藏
    addCollect: async (username, id) => {
        let res = await User.update({username}, {$push: {collectIds: {_id: id}}});
        return res;
    },
    // 后台管理-获取所有用户信息(分页)
    getUsersAll: async (skipNum = 0, pageCountNum = 10) => {
        let res = await User.find({}, '-password -collectIds -comments').skip(skipNum).limit(pageCountNum);
        let total = await User.find().count();
        return {
            data: res,
            total: total
        };
    },
    // 后台管理-设置/取消用户管理员权限
    setUserManager: async (username, isManager) => {
        let res = await User.update({username}, {$set: {isManager}});
        // console.log(res);
        if (res.ok === 1) {
            if (res.n === 1 && res.nModified === 1) {
                return {
                    code: 0,
                    data: {},
                    msg: '更改用户信息成功！'
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
                msg: '更改用户信息失败!'
            }
        }
    }
};
