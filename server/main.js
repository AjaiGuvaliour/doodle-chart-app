const express = require('express');
const main = express();
const authentication = require('./controllers/authentication');
const users = require('./controllers/user');
const message = require('./controllers/message');

main.use(express.json());
main.use(express.urlencoded({ extended: true }));
main.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, token');
    next();
});

main.use('/auth', authentication);
main.use('/user', users);
main.use('/message', message);
module.exports = {
    main: main,
    express: express
};