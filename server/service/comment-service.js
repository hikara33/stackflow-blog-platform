const commentModel = require('../models/comment-model');
const postModel = require('../models/post-model');
const ApiError = require('../exceptions/api-error');

class CommentService {
    async createComment(user, postId, content) {
        const doc = await commentModel.create({
            user,
            postId,
            content
        });
        await doc.populate('user', 'login avatarUrl');

        await postModel.updateOne({
            _id: postId
        }, { $inc: { commentsCount: 1 }});

        return doc;
    }

    async getComments(postId) {
        const comments = await commentModel.find({postId}).populate('user', 'login avatarUrl').exec();

        if (!comments) {
            return ApiError.NotFound();
        }
        return comments;
    }

    async remove(commentId) {
        const deletedComment = await commentModel.findOneAndDelete({ _id: commentId });

        if (!deletedComment) {
            return ApiError.NotFound();
        }

        await postModel.updateOne({
            _id: deletedComment.postId
        }, { $inc: { commentsCount: -1 }});

        return deletedComment;
    }

    async update(commentId, content) {
        const updatedComment = await commentModel.findOneAndUpdate({
            _id: commentId,
        }, {
            $set: { content }
        });

        if (!updatedComment) {
            return ApiError.BadRequest('Комментарий не удалось изменить');
        }
        return updatedComment;
    }

    async getUserComments(userId) {
        return commentModel.find({user: userId}).populate('user', 'login avatarUrl');
    }
}

module.exports = new CommentService();