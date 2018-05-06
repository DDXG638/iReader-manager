const Schema = require('./config');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, '用户名不能为空。'],
        minlength: [3, '用户名不能短于 3 个字符。'],
        maxlength: [20, '用户名不能长于 20 个字符。'],
    },
    password: { // 密码
        type: String,
        required: [true, '密码不能为空。'],
        minlength: [6, '密码不能短于 6 个字符。']
    },
    isManager: {
        type: String,
        default: '0'
    },
    nickname: {
        type: String,
        minlength: [3, '昵称不能短于 3 个字符。'],
        maxlength: [20, '昵称不能长于 20 个字符。']
    },
    headimgurl: {
        type: String,
        default: 'http://p6iiiwy0l.bkt.clouddn.com/1212.jpg'
    },
    registerTime: {
        type: Date,
        default: Math.round(Date.now() / 1000),
    },
    country: String,
    province: String,
    city: String,
    collectnum: {
        type: Number,
        default: 0
    },
    plnum: {
        type: Number,
        default: 0
    }
});
// http://p4.qhimg.com/d/inn/c72540c6/default.png
module.exports = UserSchema;
