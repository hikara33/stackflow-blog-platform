const commentModel = require('../models/comment-model');
const postModel = require('../models/post-model');
const ApiError = require('../exceptions/api-error');

module.exports = async function (req, res, next) {
    try {
        const comment = await commentModel.findById(req.params.id).populate('postId', '_id user');
        if (!comment) {
            return next(ApiError.NotFound());
        }

        if (comment.postId.user.toString() === req.user.id.toString()) {
            return next();
        }
        return next(ApiError.Forbidden());
    } catch(err) {
        next(err);
    }
}