const env=require('dotenv');
env.config();
const connection=require('../DB_Config/Connection')
let queries={}

queries.findOne=async(data,connection_details)=>{
    if(data && connection_details){
        console.log(data);       
        let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
        let result=await userModel.find(data,{__v:0,password:0});
        if(result.length !=0){
            return result;
        }
        else{
            return "No Data Found !"
        }
              
    }
    else{
        return "Something Went Wrong ! Please Try Again"
    }
}


queries.insertSingle=async(data,connection_details)=>{
    if(data && connection_details){       
      
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
      try{
        let insertVal= await Model.insertMany(data)
       
        if(insertVal.length !=0){
            return insertVal;
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
      }catch(e){
        return "Duplicate Email/Mobile"
      }
        
              
    }
    else{
        return "Something Went Wrong ! Please Try Again"
    }
}

queries.activateUser=async(data,connection_details)=>{
    if(data && connection_details){       
      
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
     let update_response=  await Model.updateOne({email:data.email},{$set:{active:"Y",verified:"Y"}})
       if(update_response.modifiedCount !=0){
        return true;
       }
       
              
    }
    else{
        return "Something Went Wrong ! Please Try Again"
    }
}

queries.deleteRecord=async(data,connection_details)=>{
    if(data && connection_details){       
      
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
        await Model.deleteOne(data);
     
}}
module.exports=queries;