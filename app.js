var express = require('express');
var app = express();
var cors = require('cors')
var db = require('./db');
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var UserController = require('./routes/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;
