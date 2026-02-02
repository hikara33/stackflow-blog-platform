const userModel = require('../models/user-model');
const commentModel = require('../models/comment-model');
const postModel = require('../models/post-model');

const tokenService = require('./token-service');
const mailService = require('../service/mail-service');

const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, login, password, avatarUrl) {
        const candidate = await userModel.findOne({
            $or: [{email: email}, {login: login}]
        });
        if (candidate) {
            if (candidate.email === email) {
                throw ApiError.BadRequest(`Пользователь с почтой ${email} уже существует`);
            }
            if (candidate.login === login) {
                throw ApiError.BadRequest(`Пользователь с логином ${login} уже существует`);
            }
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const activateLink = uuidv4();

        const user = await userModel.create({email, login,
            password: hashedPassword, activateLink,
            avatarUrl: avatarUrl ? avatarUrl.path : '' });
        await mailService.sendActivateMail(email, `${process.env.API_URL}/api/activate/${activateLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async activate(link) {
        const user = await userModel.findOne({activateLink: link});
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await userModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('Пользователь с такой почтой не найден');
        }

        const comparedPasswords = await bcrypt.compare(password, user.password);
        if (!comparedPasswords) {
            throw ApiError.BadRequest('Пароль неверный');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async getUserById(userId) {
        const user = await userModel.findById(userId)
            .select('-password -activateLink -isActivated -role');

        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        return user;
    }

    async userComments(userId) {
        const comments = await commentModel.find({user: userId})
            .populate('user', 'login avatarUrl');

        if (!comments) {
            throw ApiError.NotFound();
        }
        return comments;
    }

    async userPosts(userId) {
        const posts = await postModel.find({user: userId})
            .populate('user', 'login avatarUrl');

        if (!posts) {
            throw ApiError.NotFound();
        }
        return posts;
    }

    async updateUser(userId, updates) {
        const user = await userModel.findById(userId);

        if (!user) {
            throw ApiError.NotFound();
        }

        Object.assign(user, updates);
        await user.save();

        return new UserDto(user);
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }
}

module.exports = new UserService();