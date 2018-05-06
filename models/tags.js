const Schema = require('./config');

const TagsSchema = new Schema({
    classid: {
        type: String,
        required: true
    },
    classname: String,
    classpath: String,
    showclass: {
        type: String,
        default: '0'
    }
});

module.exports = TagsSchema;
