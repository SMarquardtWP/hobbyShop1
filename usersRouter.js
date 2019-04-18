'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { User } = require("./models");

//router.use('/', jsonParser);

router.get('/', (req, res) => {
    console.log("something");
    User
        .findOne()
        .then(user => {
            console.log(user);
            res.json({
                username: user.username,
                userId: user.userId
            })
        });
    //implement error catching
});

router.post('/', (req, res) => {
    // make sure to insert code forcing required fields to be entered
    User
        .create({
            userId: req.body.userId,
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority
        })
        .then(user => res.json(user));


    //id will be generated randomly and authority based on how user signs up in finished version
});

//primarily for users to update own password
router.put('/:id', (req, res) => {
    const updates = {};
    const updateableFields = ['username', 'password'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: updates })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//for admin authority users to manage other users
router.put('/admin/:id', (req, res) => {
    const updates = {};
    const updateableFields = ['username', 'password'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: updates })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


router.delete('/admin/:id', (req, res) => {

    User
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;

/*
TO DO LIST
-Add error catching.
-Add unique username requirement
-Add authority validation on delete/update requests
*/