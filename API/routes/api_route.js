const { request } = require('express');
const express = require('express');
const route = express.Router();
const multer=require('multer');
const verify = require('../../Middleware/authentication');
const control = require('../controller/controller');

var stockStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Corrected the typo here
    }
});


var uploadstock=multer({storage:stockStorage});


route.post('/login', control.ulogin)
route.post('/registration', control.uReg)
route.post('/sendotp', control.sendotp)
route.post('/verifyotp', control.uverify)
route.post('/logout', verify, control.ulogout);
route.put('/reset-password',  control.resetPassword);
route.put('/user/update/:id', verify, control.userUpdate);
route.post('/item', verify,control.itemAdd)
route.get('/item', verify,control.itemList)
route.get('/item/:itemcode', verify,control.itemView)
route.put('/item/:id', verify,control.itemUpdate)
route.delete('/item/:id', verify,control.itemDelete)
route.post('/item/add/csv',uploadstock.single('file'),verify, control.importItem);
route.post('/bill', verify,control.billAdd)
route.get('/bill', verify,control.billList)
route.get('/bill/:user', verify,control.billByUser)
route.put('/bill/:id', verify,control.billUpdate)
route.delete('/bill/:id', verify,control.billDelete)
route.post('/store', verify,control.storeUpdate)
route.get('/store', verify,control.statDetail)
route.get('/due-bill', verify,control.dueBill)
module.exports = route;
