const express = require('express');
const main = express();
const authentication = require('./controllers/authentication');
main.use(express.json());
main.use(express.urlencoded({ extended: true }));
main.use('/auth', authentication);
module.exports = {
    main: main,
    express: express
};