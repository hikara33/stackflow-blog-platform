const userService = require('../service/user-service');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, login, password } = req.body;
            const avatarUrl = req.file;

            const userData = await userService.registration(email, login, password, avatarUrl);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.status(200).json(userData);
        } catch(err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.status(200).json(userData);
        } catch(err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(token);
        } catch(err) {
            next(err);
        }
    }

    async activate(req, res, next) {
        try {
            const link = req.params.link;
            await userService.activate(link);
            return res.redirect(process.env.CLIENT_URL);
        } catch(err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.status(200).json(userData);
        } catch(err) {
            next(err);
        }
    }

    async getUser(req, res, next) {
        try {
            const userId = req.params.id;
            const userData = await userService.getUserById(userId);
            return res.status(200).json(userData);
        } catch(err) {
            next(err);
        }
    }

    async getUserComments(req, res, next) {
        try {
            const { id } = req.params;
            const commentsData = await userService.userComments(id);
            return res.status(200).json(commentsData);
        } catch(err) {
            next(err);
        }
    }

    async getUserPosts(req, res, next) {
        try {
            const { id } = req.params;
            const postsData = await userService.userPosts(id);
            return res.status(200).json(postsData);
        } catch(err) {
            next(err);
        }
    }

    async patchUser(req, res, next) {
        try {
           const { id } = req.params;
           const updates = {};

            if (req.body.login) updates.login = req.body.login;
            if (req.body.email) updates.email = req.body.email;
            if (req.body.bio) updates.bio = req.body.bio;
            if (req.body.website) updates.website = req.body.website;
            if (req.body.location) updates.location = req.body.location;

            if (req.file) {
                updates.avatarUrl = req.file.path;
            }

            const updateUser = await userService.updateUser(id, updates);
            return res.status(200).json(updateUser);
        } catch(err) {
            next(err);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new UserController();