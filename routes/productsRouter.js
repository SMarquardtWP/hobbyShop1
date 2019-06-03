'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const jwtauth = passport.authenticate('jwt', { session: false });
const { Product } = require("../models");

router.use("/", bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
    let xtags = [];
    let xname = {};
    let queries = [];
    let search = {};

    if (req.query.name) {
        xname = {"name": {$regex: req.query.name, $options: "i" }};
        queries.push(xname);
    }
    if (req.query.tags) {
        xtags = req.query.tags.split(',');
        for (let i = 0; i < xtags.length; i++) {
            xtags[i] = xtags[i].trim();
            xtags[i] = {"tags" : {$regex: xtags[i], $options: "i" }};
            queries.push(xtags[i]);
        }
    }

    for ( let i=0; i<queries.length; i++)
     console.log("Value " + i + "is " + JSON.stringify(queries[i]));

    if (queries.length != 0)
        search = {$and: queries};

    Product
        .find(search)
        .limit(10)
        .sort('name')
        .then(products => {
            console.log(products);
            res.json(products);
        })
        .catch(err => {
            res.status(500).json({ message: "Error, something went wrong" });
        })
    //implement error catching
});

router.post('/', jwtauth, (req, res) => {
    // make sure to insert code forcing required fields to be entered

    //for loop to create an array for the tags, trim commas and spaces
    let xtags = [];
    xtags = req.body.tags.split(',');
    for (let i = 0; i < xtags.length; i++)
        xtags[i] = xtags[i].trim();

    Product
        .create({
            name: req.body.name,
            tags: xtags,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        })
        .then(product => res.json(product));
});

router.put('/:id', jwtauth, (req, res) => {
    const updates = {};
    const updateableFields = ['name', 'tags', 'price', 'thumbnail'];

    console.log(req.params);
    console.log(req.body);

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Product
        .findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
        .then(product => res.status(201).json(product))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', jwtauth, (req, res) => {

    Product
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(201).json({ "_id": req.params.id, "status": "DELETE" }))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;