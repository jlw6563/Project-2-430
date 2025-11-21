const mongoose = require('mongoose');
const AccountModel = require('./Account');

let postModel = {};


const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    news: {
        type: Boolean,
        required: true,
    }

    createdDate: {
    type: Date,
    default: Date.now,
    },
});