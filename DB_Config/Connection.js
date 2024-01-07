const sch = require('../Table/schema')
const mongoose = require('mongoose');
const env=require('dotenv');
env.config();
let connection={};

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
    if(mdl=="users"){
        let Model = database.model(mdl, sch.UserSchema());
        return Model 
    }
    else if(mdl=="jwts"){
        let Model = database.model(mdl, sch.jwtSchema());
        return Model
    }
    else if(mdl=="otps"){
        let Model = database.model(mdl, sch.otpSchema());
        return Model
    }     
}
module.exports=connection;
