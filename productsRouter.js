'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const jwtauth = passport.authenticate('jwt', { session: false });
const {Product}  = require("./models");

//router.use('/', jsonParser);

router.get('/', (req, res) => {
    console.log("something");
    Product
        .findOne()
        .then(product => {
            console.log(product);
            res.json({
            name: product.name,
            genre: product.genre,
            tags: product.tags,
            price: product.price
        })});
    //implement error catching
});

router.post('/', jwtauth, (req, res) => {
    // make sure to insert code forcing required fields to be entered
    Product
        .create({
            productId: req.body.productId,
            name: req.body.name,
            genre: req.body.genre,
            tags: req.body.tags,
            price: req.body.price
        })
        .then(product => res.json(product));


    //id will be generated sequentially
});

router.put('/:id', jwtauth, (req,res) => {
    const updates = {};
    const updateableFields = ['name', 'genre', 'tags', 'price'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Product
        .findByIdAndUpdate(req.params.id, {$set: updates})
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jwtauth, (req, res) => {

    Product
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;