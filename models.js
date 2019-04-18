"use strict";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema =  mongoose.Schema({
    userId: {type: Number, required: true},
    username: {type: String, required: true},
    password: {type: String, required:true},
    authority: {type: Number, required: true}
});

const productSchema = mongoose.Schema({
    productId: {type: Number, required: true},
    name: {type: String, required: true},
    genre: [{type: String}],
    tags: [{type: String}],
    price: {type: Number}    
});

const eventSchema = mongoose.Schema({
    eventId: {type: Number, required: true},
    name: {type: String, required: true},
    date: {type: Date, required: true},
    free: {type: Boolean},
    maxAttend: {type: Number},
    attend: [{type: String}]

});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports= {User, Product, Event};