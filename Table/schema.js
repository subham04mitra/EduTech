const mongoose = require('mongoose');
const dict = require('./dictionary.json');
let schemas = {};
let schema = mongoose.Schema;

schemas.jwtSchema = () => {
    let jwtschema = new schema(dict.jwt)

    return jwtschema;
}
schemas.UserSchema=()=>{
    let schemas=new schema(dict.user)
    return schemas;
}
schemas.otpSchema=()=>{
    let schemas=new schema(dict.otp)
    return schemas;
}
schemas.itemSchema=()=>{
    let schemas=new schema(dict.item)
    return schemas;
}
schemas.billSchema=()=>{
    let schemas=new schema(dict.bill)
    return schemas;
}
schemas.bill_detSchema=()=>{
    let schemas=new schema(dict.bill_det)
    return schemas;
}
schemas.profitSchema=()=>{
    let schemas=new schema(dict.profit)
    return schemas;
}
schemas.statSchema=()=>{
    let schemas=new schema(dict.stat)
    return schemas;
}
module.exports = schemas;

