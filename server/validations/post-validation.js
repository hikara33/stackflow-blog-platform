const { body } = require('express-validator');

const postValidation = [
    body('title')
        .exists({ checkFalsy: true})
        .withMessage('Название обязательно')
        .isString(),
    body('text')
        .exists( { checkFalsy: true})
        .withMessage('Текст обязателен')
        .isString(),
    body('tags')
        .optional()
        .isArray()
];

module.exports = { postValidation };