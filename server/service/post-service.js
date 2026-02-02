const postModel = require('../models/post-model');
const ApiError = require('../exceptions/api-error');

class PostService {
    async create(user, title, text, imageUrl, tags) {
        const doc = new postModel({
            user,
            title,
            text,
            imageUrl,
            tags
        });
        await doc.save();
        return doc;
    }

    async getAll() {
        const posts = await postModel.find().populate('user', 'login avatarUrl email').exec();
        return posts;
    }

    async getOne(postId) {
        const post = await postModel.findById(postId)
            .populate('user', 'login avatarUrl email');

        if (!post) {
            throw ApiError.NotFound();
        }
        return post;
    }

    async update(postId, title, text, imageUrl, tags) {
        const updatePost = await postModel.findOneAndUpdate({
            _id: postId,
        }, {
            $set: {title, text, imageUrl, tags}
        });

        if (!updatePost) {
            throw ApiError.NotFound();
        }
        return updatePost;
    }

    async remove(postId) {
        const deletedPost = await postModel.findOneAndDelete({_id: postId});

        if (!deletedPost) {
            throw ApiError.NotFound();
        }
        return deletedPost;
    }

    async getTags() {
        const tags = await postModel.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 }}},
            { $sort: { count: -1 }},
            { $limit: 5 }
        ]);
        return tags;
    }

    async getPostsByTag(tagId) {
        const posts = await postModel.find({ tags: tagId }).populate('user', 'login avatarUrl email').exec();
        return posts;
    }

    async incrementViews(postId) {
        const post = await postModel.findByIdAndUpdate(postId,
            {$inc: { views: 1 }},
            { returnDocument: 'after' });

        if (!post) {
            throw ApiError.NotFound();
        }

        return post;
    }
}

module.exports = new PostService();