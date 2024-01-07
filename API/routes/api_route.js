const { request } = require('express');
const express = require('express');
const route = express.Router();

const verify = require('../../Middleware/authentication');
const control = require('../controller/controller');

route.post('/login', control.ulogin)
route.post('/registration', control.uReg)
route.post('/registration/verify', control.uverify)
module.exports = route;
