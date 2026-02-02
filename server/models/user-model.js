const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    login: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activateLink: {type: String},
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    avatarUrl: {type: String},
    bio: {type: String, default: ''},
    location: {type: String, default: ''},
    website: {type: String, default: ''}
}, { timestamps: true});

module.exports = model('User', UserSchema);