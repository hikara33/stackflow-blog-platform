const postService = require('../service/post-service');

class PostController {
    async create(req, res, next) {
        try {
            const { title, text, imageUrl, tags } = req.body;
            const userId = req.user.id;
            const postData = await postService.create(userId, title, text, imageUrl, tags);
            return res.json(postData);
        } catch(err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const posts = await postService.getAll();
            return res.json(posts);
        } catch(err) {
            next(err);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const post = await postService.getOne(id);
            return res.json(post);
        } catch(err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, text, imageUrl, tags } = req.body;
            const postData = await postService.update(id, title, text, imageUrl, tags);
            return res.json(postData);
        } catch(err) {
            next(err);
        }
    }

    async remove(req, res, next) {
        try {
            const { id } = req.params;
            const post = await postService.remove(id);
            return res.json(post);
        } catch(err) {
            next(err);
        }
    }

    async getTags(req, res, next) {
        try {
            const tags = await postService.getTags();
            return res.json(tags);
        } catch(err) {
            next(err);
        }
    }

    async getPostsByTag(req, res, next) {
        try {
            const tagId = req.params.id;
            const posts = await postService.getPostsByTag(tagId);
            return res.json(posts);
        } catch(err) {
            next(err);
        }
    }

    async updateViews(req, res, next) {
        try {
            const { id } = req.params;
            const postData = await postService.incrementViews(id);
            return res.json(postData);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new PostController();