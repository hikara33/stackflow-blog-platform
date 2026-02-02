require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware');

const authRouter = require('./router/auth-router');
const postRouter = require('./router/post-router');
const uploadRouter = require('./router/upload-router');
const commentRouter = require('./router/comments-router');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api/auth', authRouter);
app.use('/api', postRouter);
app.use('/api/comments', commentRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api', uploadRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch(err) {
        console.log(err);
    }
}
start();