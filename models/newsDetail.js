const Schema = require('./config');

const NewsDetailSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    classid: {
        type: String,
        required: true
    },
    plnum: {
        type: Number,
        default: 0
    },
    giveupnum: {
        type: Number,
        default: 0
    },
    collectnum: {
        type: Number,
        default: 0
    },
    datafrom: {
        type: String,
        default: 'news2'
    },
    newstext: {
        type: String,
        default: ''
    },
    infotags: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    titlepic: {
        type: String,
        default: ''
    },
    playonlineurl: {
        type: String,
        default: ''
    },
    newstime: {
        type: String,
        default: ''
    },
    onclick: {
        type: String,
        default: '0'
    },
    befrom: {
        type: String,
        default: '正好咨询'
    },
    giveup: {
        type: String,
        default: ''
    },
    collect: {
        type: String,
        default: ''
    },

    time: {
        type: String,
        default: ''
    },
    isgood: {
        type: String,
        default: '0'
    },
    firsttitle: {
        type: String,
        default: '0'
    },
    playtime: {
        type: String,
        default: ''
    },
    nlist: {
        type: String,
        default: ''
    },
    titlepic2: {
        type: String,
        default: ''
    },
    titlepic3: {
        type: String,
        default: ''
    },
    ptitlepic: {
        type: String,
        default: ''
    },
    titleurl: {
        type: String,
        default: ''
    },
    userLikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    collectIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        content: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: Date.now
        },
        likeNum: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = NewsDetailSchema;
