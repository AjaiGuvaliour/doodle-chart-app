const express = require('express');
const main = express();
const authentication = require('./controllers/authentication');
main.use(express.json());
main.use(express.urlencoded({ extended: true }));
main.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept, token');
    next();
});

main.use('/auth', authentication);
module.exports = {
    main: main,
    express: express
};