const express=require('express');
const env=require('dotenv');
const bodyparser=require('body-parser');
const cors=require('cors');
env.config();
const port=process.env.PORT||8111;
const app=express();
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
const route=require('./Route/Main_route')
app.use('/',route);

app.listen(port,(err)=>{
    if(err){
        console.log("Server Failed to Start");
    }
    console.log(`Server is running at port ${port}`);
})
