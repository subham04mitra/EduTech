const express = require('express');
const route = express.Router();
const home = require('../API/routes/api_route');
route.use('/v1', home);
route.use('/',(req,res)=>{
    res.json({Success:false,Message:"Wrong Address"})
})
module.exports = route;