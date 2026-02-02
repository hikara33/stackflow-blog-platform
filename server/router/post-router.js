const express = require('express');
const postController = require('../controllers/post-controller');
const postModel = require('../models/post-model');

const authMiddleware = require('../middlewares/auth-middleware');
const checkOwner = require('../middlewares/check-owner');
const { postValidation } = require('../validations/post-validation');
const validationMiddleware = require('../middlewares/validation-middleware');

const postRouter = express.Router();

postRouter.get('/posts/tags', postController.getTags);
postRouter.get('/tags/:id', postController.getPostsByTag);
postRouter.patch('/posts/:id/views', postController.updateViews);

postRouter.get('/posts', postController.getAll);
postRouter.get('/posts/:id', postController.getOne);

postRouter.post('/posts',
    authMiddleware,
    ...postValidation,
    validationMiddleware,
    postController.create);
postRouter.delete('/posts/:id',
    authMiddleware,
    checkOwner(postModel),
    postController.remove);
postRouter.patch('/posts/:id',
    authMiddleware,
    checkOwner(postModel),
    postController.update);

module.exports = postRouter;