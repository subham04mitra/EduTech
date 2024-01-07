const express = require('express');
const db = require('../../Serivce/operation');
let service = {};


service.ulogin = async (req, res) => {
    
  
    let data = req.body;
  
    try {
        let response = await db.ulogIn(data);
        if (response) {

            res.send(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.uReg = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.userRegistration(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.uverify = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.otpVerify(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
module.exports=service;