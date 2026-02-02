const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    imageUrl: {type: String},
    tags: {type: Array, default: []},
    views: {type: Number, default: 0},
    commentsCount: {type: Number, default: 0}
}, { timestamps: true });

module.exports = model('Post', PostSchema);