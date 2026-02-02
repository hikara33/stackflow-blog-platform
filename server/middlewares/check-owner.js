const postModel = require('../models/post-model');
const ApiError = require('../exceptions/api-error');

function checkOwner(model, ownerField = 'user') {
    return async (req, res, next) => {
        try {
            const resource = await model.findById(req.params.id);

            if (!resource) {
                return next(ApiError.NotFound());
            }

            const isOwner = resource[ownerField].toString() === req.user.id.toString();
            if (!isOwner) {
                return next(ApiError.Forbidden());
            }

            next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = checkOwner;