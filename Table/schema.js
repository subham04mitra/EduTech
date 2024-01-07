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

module.exports = schemas;

