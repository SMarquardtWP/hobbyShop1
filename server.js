"use strict";

const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

app.listen(process.env.PORT || 8080);

module.exports=app;

// endpoints at users, events, products

app.get('/users', (req, res) => {
    User
        .findOne()
        .then (user => res.json ({
            username: user.username,
            id: user.id
        }));
});

app.post('/users', (req, res) => {
// make sure to insert code forcing required fields to be entered
    User
        .create({
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority }) 
        .then
        
  //authority and id will be generated on backend in finished version
});
