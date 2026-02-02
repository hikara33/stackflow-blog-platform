const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const storage = require('../multer/multer-storage');
const multer = require('multer');
const ApiError = require('../exceptions/api-error');

const upload = multer({ storage });
const uploadRouter = express.Router();

uploadRouter.post('/upload',
    authMiddleware,
    upload.single('image'),
    (req, res, next) => {
        try {
            if (!req.file) {
                return next(ApiError.BadRequest('Нет файла для загрузки'));
            }

            res.json({
                url: `/uploads/${req.file.originalname}`,
            });
        } catch(err) {
            next(err);
        }
    }
)

module.exports = uploadRouter;