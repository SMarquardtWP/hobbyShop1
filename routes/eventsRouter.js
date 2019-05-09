'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const { Event } = require("../models");
const jwtauth = passport.authenticate('jwt', { session: false });

router.use("/", bodyParser.urlencoded({
    extended: true
}));

//for general members to view event information
router.get('/', (req, res) => {
    console.log("something");
    Event
        .findOne()
        .then(event => {
            console.log(event);
            res.json({
                name: event.name,
                date: event.date,
                price: event.price,
                maxAttend: event.maxAttend,
                attend: event.attend
            })
        });
    //implement error catching
});

//for clerk+ level users to update event posting
router.post('/', jwtauth, (req, res) => {
    // make sure to insert code forcing required fields to be entered
    Event
        .create({
            name: req.body.name,
            date: new Date(req.body.date),
            price: req.body.price,
            maxAttend: req.body.maxAttend,
            attend: req.body.attend
        })
        .then(event => res.json(event));


    //id will be generated sequentially
});

//for member level users to subscribe to events
router.put('/:id', jwtauth, (req, res) => {
    const updates = {};
    const updateableFields = ['name', 'date', 'free', 'maxAttend', 'attend'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Event
        .findByIdAndUpdate(req.params.id, { $set: updates })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//for clerk+ level users to manage event information
router.put('/:id', jwtauth, (req, res) => {
    const updates = {};
    const updateableFields = ['name', 'date', 'price', 'maxAttend', 'attend'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Event
        .findByIdAndUpdate(req.params.id, { $set: updates })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//for clerk+ level users to remove events from list
router.delete('/:id', jwtauth, (req, res) => {

    Event
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;