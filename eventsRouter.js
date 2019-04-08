'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {Event}  = require("./models");

//router.use('/', jsonParser);

router.get('/', (req, res) => {
    console.log("something");
    Event
        .findOne()
        .then(event => {
            console.log(event);
            res.json({
            eventId: event.eventId,
            name: event.name,
            date: event.date,
            free: event.free,
            maxAttend: event.maxAttend,
            attend:event.attend
        })});
    //implement error catching
});

router.post('/', (req, res) => {
    // make sure to insert code forcing required fields to be entered
    Event
        .create({
            eventId:req.body.eventId,
            name: req.body.name,
            date: req.body.date,
            free: req.body.free,
            maxAttend: req.body.maxAttend,
            attend: req.body.attend
        })
        .then(event => res.json(event));


    //id will be generated sequentially
});

router.put('/:id', (req,res) => {
    const updates = {};
    const updateableFields = ['name', 'genre', 'tags', 'price'];
    
    console.log('We made it this far at least');
    console.log(req.params);
    console.log(req.body);

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Event
        .findByIdAndUpdate(req.params.id, {$set: updates})
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {

    Event
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;