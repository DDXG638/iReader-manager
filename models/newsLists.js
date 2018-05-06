const Schema = require('./config');

/*
数据类型：
String      字符串
Number      数字
Date        日期
Buffer      二进制
Boolean     布尔值
Mixed       混合类型
ObjectId    对象ID
Array       数组

约束：
required: 数据必须填写
default: 默认值
min: 最小值(只适用于数字)
max: 最大值(只适用于数字)
match: 正则匹配(只适用于字符串)
enum:  枚举匹配(只适用于字符串)
validate: 自定义匹配
unique: true 唯一
*/

const NewsListsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    classid: {
        type: String,
        required: true
    },
    time: String,
    plnum: Number,
    title: String,
    newstime: String,
    onclick: String,
    befrom: String,
    isgood: String,
    firsttitle: String,
    playtime: String,
    titlepic: String,
    titlepic2: String,
    titlepic3: String,
    ptitlepic: String,
    nlist: String,
    datafrom: String,
    playonlineurl: String,
    titleurl: String
});

module.exports = NewsListsSchema;
