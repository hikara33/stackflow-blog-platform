const commentService = require('../service/comment-service');

class CommentController {
    async getComments(req, res, next) {
        try {
            const { postId } = req.params;
            const commentsData = await commentService.getComments(postId);
            return res.status(200).json(commentsData);
        } catch(err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const { postId, content } = req.body;
            const user = req.user.id;
            const commentData = await commentService.createComment(user, postId, content);
            return res.status(200).json(commentData);
        } catch(err) {
            next(err);
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params;
            const commentData = await commentService.remove(id);
            return res.json(commentData);
        } catch(err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const commentData = await commentService.update(id, content);
            return res.json(commentData);
        } catch(err) {
            next(err);
        }
    }

    async getUserComments(req, res, next) {
        try {
            const { id } = req.user;
            const commentsData = await commentService.getUserComments(id);
            return res.status(200).json(commentsData);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new CommentController();