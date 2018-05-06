'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/iReader');

// 连接成功
mongoose.connection.on('connected', () => {
    console.log('连接MongoDb数据库成功');
});

// 连接异常
mongoose.connection.on('error', () => {
    console.log('连接MongoDb数据库异常');
});

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

module.exports = Schema;
