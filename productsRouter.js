'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const jwtauth = passport.authenticate('jwt', { session: false });
const { Product } = require("./models");

router.use("/", bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
    console.log(req.query);
    Product
        .find(req.query)
        .limit(10)
        .sort('name')
        .then(products => {
            console.log(products);
            res.json(products);
        })
        .catch(err => {
            res.status(500).json({message:"Error, something went wrong"});
        })
    //implement error catching
});

router.post('/', jwtauth, (req, res) => {
    // make sure to insert code forcing required fields to be entered
    Product
        .create({
            name: req.body.name,
            tags: req.body.tags,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        })
        .then(product => res.json(product));


    //id will be generated sequentially
});

router.put('/:id', jwtauth, (req, res) => {
    const updates = {};
    const updateableFields = ['name', 'tags', 'price'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Product
        .findByIdAndUpdate(req.params.id, { $set: updates })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', jwtauth, (req, res) => {

    Product
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;