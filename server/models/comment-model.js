const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    postId: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    content: {type: String, required: true},
    parentComment: {type: Schema.Types.ObjectId, ref: 'Comment', default: null}
}, { timestamps: true });

module.exports = model('Comment', commentSchema);