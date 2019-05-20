'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const { User } = require("../models");
const jwtauth = passport.authenticate('jwt', { session: false });

router.use("/", bodyParser.urlencoded({
    extended: true
}));

router.get('/', jwtauth, (req, res) => {
    console.log(req.user);
    console.log(req.query);
    let search = {};

    if (req.query.username)
        search.username = {$regex: req.query.username, $options:"i" };
    if (req.query.email)
        search.email = { $regex: req.query.email, $options:"i" };
    if (req.query.auth)
        search.auth = { $regex: req.query.auth, $options:"i" };

    console.log(search);

    User
        .find(search)
        .then(users => {
            console.log(users);
            res.json(users.map(usr => usr.serialize()));
        })
        .catch(err => {
            console.error(err);
        })
    //implement error catching
});

router.post('/', (req, res) => {
    // make sure to insert code forcing required fields to be entered
    console.log(req.body);
    //TODO: check for same named user
    User.hashPassword(req.body.password)
        .then(hashed => {
            console.log(hashed);
            User
                .create({
                    username: req.body.username,
                    password: hashed,

                    email: req.body.email,
                    authority: 1
                })
                .then(user => {
                    console.log(user);
                    res.json(user.serialize())
                });
        });
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
    const updateableFields = ['username', 'password', 'email', 'authority'];

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