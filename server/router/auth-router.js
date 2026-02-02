const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const { loginValidation, registerValidation } = require('../validations/user-validation');
const validationMiddleware = require('../middlewares/validation-middleware');

const storage = require('../multer/multer-storage');
const multer = require('multer');

const authRouter = require('express').Router();
const upload = multer({ storage });

//авторизация
authRouter.post('/registration',
    upload.single('avatar'),
    ...registerValidation,
    validationMiddleware,
    userController.registration);
authRouter.post('/login',
    ...loginValidation,
    validationMiddleware,
    userController.login);
authRouter.post('/logout', userController.logout);
authRouter.get('/activate/:link', userController.activate);
authRouter.get('/refresh', userController.refresh);

//профайл юзера
authRouter.get('/users/:id', userController.getUser);
authRouter.get('/users/:id/comments', userController.getUserComments);
authRouter.get('/users/:id/posts', userController.getUserPosts);
authRouter.patch('/users/:id',
    upload.single('avatar'),
    authMiddleware,
    userController.patchUser);

authRouter.get('/users',
    authMiddleware,
    userController.getAllUsers);

module.exports = authRouter;