"use strict";

const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { Restaurant } = require('./models');

app.use(express.static('public'));
app.use(express.json());

app.listen(process.env.PORT || 8080);

module.exports = app;

// endpoints at users, events, products

const { User } = require("models");

app.get('/users', (req, res) => {
    User
        .findOne()
        .then(user => res.json({
            username: user.username,
            id: user.id
        }));
    //implement error catching
});

app.post('/users', (req, res) => {
    // make sure to insert code forcing required fields to be entered
    User
        .create({
            id: req.body.id,
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority
        });


    //id will be generated randomly and authority based on how user signs up in finished version
});

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on("error", err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}


if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };