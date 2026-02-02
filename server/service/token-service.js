const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        });

        return {accessToken, refreshToken};
    }

    validateAccessToken(accessToken) {
        try {
            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            return token;
        } catch(err) {
            return null;
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            const token = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return token;
        } catch(err) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        const token = await tokenModel.deleteOne({refreshToken});
        return token;
    }

    async findToken(refreshToken) {
        const token = await tokenModel.findOne({refreshToken});
        return token;
    }
}

module.exports = new TokenService();