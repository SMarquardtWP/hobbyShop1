'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');


mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

const usersRouter = require('./usersRouter');
const eventsRouter = require('./eventsRouter');
const productsRouter = require('./productsRouter');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const jsonParser = bodyParser.json();

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(express.static('public'));
app.use(express.json());

app.use(morgan('common'));
// endpoints at users, events, products
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);

let server;

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