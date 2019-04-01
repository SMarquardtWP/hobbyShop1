"use strict";

const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    id: {type: Number, required: true},
    username: {type: String, required: true},
    password: {type: String, required:true},
    authority: {type: Number, required: true}
});

const productSchema = mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    genre: [{type: String}],
    tags: [{type: String}],
    price: {type: Number}    
});

const eventSchema = mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    date: {type: Date, required: true},
    free: {type: Boolean},
    maxAttend: {type: Number},
    attend: {type: Number}
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Event = mongoose.model('Event', eventSchema);