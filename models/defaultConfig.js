const Schema = require('./config');

const DefaultConfigSchema = new Schema({
    openPageUrl: { // 开屏页图片
        type: String,
        default: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2446012481,3517952708&fm=27&gp=0.jpg'
    },
    openPageRouter: { // 跳转连接
        type: String,
        default: ''
    },
    searchTip: { // 搜索框提示文本
        type: String,
        default: '看咨询，知天下'
    },
    searchs: [{ // 推荐搜索新闻
        type: Schema.Types.ObjectId,
        ref: 'NewsDetail'
    }]
});
// http://p4.qhimg.com/d/inn/c72540c6/default.png
module.exports = DefaultConfigSchema;
