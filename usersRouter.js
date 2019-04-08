const express = require('express');
const router = express.Router();

const {User}  = require("./models");

router.get('/', (req, res) => {
    console.log("something");
    User
        .findOne()
        .then(user => {
            console.log(user);
            res.json({
            username: user.username,
            id: user.id
        })});
    //implement error catching
});

router.post('/', (req, res) => {
    // make sure to insert code forcing required fields to be entered
    User
        .create({
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority
        })
        .then(user => res.json(user));


    //id will be generated randomly and authority based on how user signs up in finished version
});

router.put('/:id', (req,res) => {
    const updates = {};
    const updateableFields = ['username', 'password'];
    
    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, {} )
});

module.exports = router;