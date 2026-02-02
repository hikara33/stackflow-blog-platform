const { body } = require('express-validator');

const loginValidation = [
    body('email').isEmail().withMessage('Некорректный формат email'),
    body('password').isLength({min: 8, max: 32}).withMessage('Пароль должен быть длиной минимум 8 символов')
]

const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Некорректный формат email'),
    body('login')
        .exists({ checkFalsy: true})
        .isLength({min: 3, max: 20})
        .matches(/^[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ0-9._-]*$/),
    body('password').isLength({min: 8, max: 32}).withMessage('Пароль должен быть длиной минимум 8 символов')
]

module.exports = { loginValidation, registerValidation };