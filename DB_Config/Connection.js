const sch = require('../Table/schema')
const mongoose = require('mongoose');
const env=require('dotenv');
env.config();
let connection={};
let mapping={
    "users":sch.UserSchema(),
    "jwts":sch.jwtSchema(),
    "items":sch.itemSchema(),
    "otps":sch.otpSchema(),
    "bills":sch.billSchema(),
    "bill_dets":sch.bill_detSchema()
}
connection.dbconnect=(flag)=>{
  
    if(flag){
        const url = process.env.URL;
        const connection = mongoose.createConnection(url,
            { useNewUrlParser: true, useUnifiedTopology: true })
         
        return connection;
    }
    
   
}


connection.schemaconnect=(db,mdl)=>{

    const dbs= connection.dbconnect(true)
    db=`${db}`
    mdl=`${mdl}s`
    
    let database = dbs.useDb(db)
    let Model = database.model(mdl, mapping[mdl]);
    return Model 
   
}
module.exports=connection;
