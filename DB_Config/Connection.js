const sch = require('../Table/schema')
const mongoose = require('mongoose');
const env=require('dotenv');
env.config();

let mapping={
    "users":sch.UserSchema(),
    "jwts":sch.jwtSchema(),
    "items":sch.itemSchema(),
    "otps":sch.otpSchema(),
    "bills":sch.billSchema(),
    "bill_dets":sch.bill_detSchema()
}

let connection = {};

connection.dbconnect = (flag) => {
    console.log(flag);
    if (!flag) {
        const url = process.env.URL;
        connection.instance = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection established");
        
    } else if(flag==true) {

        if (connection.instance) {
            connection.instance.close();
            console.log("Connection closed");
            connection.instance = null;
            
        } else {
            console.log("No active connection to close");
        }
    }
    return connection.instance;
}





connection.schemaconnect=(db,mdl)=>{

    const dbs= connection.dbconnect(false)
    db=`${db}`
    mdl=`${mdl}s`
    
    let database = dbs.useDb(db)
    let Model = database.model(mdl, mapping[mdl]);
    return Model 
   
}
module.exports=connection;
