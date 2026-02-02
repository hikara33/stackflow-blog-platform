const express = require('express');
const commentController = require('../controllers/comment-controller');
const commentModel = require('../models/comment-model');

const authMiddleware = require('../middlewares/auth-middleware');
const checkOwner = require('../middlewares/check-owner');
const checkPostOwner = require('../middlewares/check-post-owner-for-comments');

async function checkCommentOrPostOwner(req, res, next) {
    let passed = false;

    await checkOwner(commentModel)(req, res, () => { passed = true; });
    if (passed) return next();

    await checkPostOwner(req, res, next);
}

const commentRouter = express.Router();

commentRouter.post('/',
    authMiddleware,
    commentController.create);
commentRouter.get('/post/:postId', commentController.getComments);
commentRouter.patch('/:id',
    authMiddleware,
    checkOwner(commentModel),
    commentController.update);

commentRouter.delete('/:id',
    authMiddleware,
    checkCommentOrPostOwner,
    commentController.remove);

commentRouter.get('/user',
    authMiddleware,
    commentController.getUserComments);

module.exports = commentRouter;