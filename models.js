"use strict";

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// USER SCHEMA
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    authority: { type: Number, required: true }
});

userSchema.methods.serialize = function () {
    return {
        username: this.username || '',
        email: this.email || ''
    };
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

//PRODUCT SCHEMA
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    genre: [{ type: String }],
    tags: [{ type: String }],
    price: { type: Number },
    thumbnail: {type: String}
});


//EVENT SCHEMA
const eventSchema = mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    free: { type: Boolean },
    maxAttend: { type: Number },
    attend: [{ type: String }],
    thumbnail: {type: String}
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { User, Product, Event };