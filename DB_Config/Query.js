const env=require('dotenv');
env.config();
const connection=require('../DB_Config/Connection')
let queries={}

queries.findOne=async(data,connection_details)=>{
    if(data && connection_details){
        try{
                 
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            
            let result=await userModel.find(data,{__v:0});
           
            //console.log(".....",result);
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            //console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
queries.findAll=async(page,limit,connection_details)=>{
    if(connection_details){
        try{
            
            //console.log("748965''''",page,limit);
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 20;
        //console.log("748965''''",skipElements,limitTo);
            let result=await userModel.find({}, {}, { skip: skipElements, limit: limitTo });
            //console.log(".....",result);
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            //console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
queries.insertSingle=async(data,connection_details)=>{
    if(data && connection_details){       
      //console.log(data);
      //console.log(connection_details);
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
      try{
        let insertVal= await Model.insertMany(data)
       //console.log("isert",insertVal);
        if(insertVal.length !=0){
            return insertVal;
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
      }catch(e){
        //console.log(e);
        return "Duplicate Data"
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
        let result=await Model.deleteOne(data);
        if(result.deletedCount>0){
            return true
        }
        else{
            return false
        }
     
}}

queries.updateRecord=async(data,set,connection_details)=>{
    if(data && connection_details){       
      
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
        let update_response=  await Model.updateOne(data,{$set:set},{ upsert: false })
        //console.log(update_response);
        if (update_response.modifiedCount != 0) {
            return true
        } 
        else if(update_response.modifiedCount==0 && update_response.matchedCount!=0){
            return "true"
        }else {
            return false
        }
     
}}
queries.FindLast=async(data,connection_details)=>{
    if(data && connection_details){
        try{
                 
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            
            let result=await userModel.find().sort(data).limit(1);
            //console.log(".....",result);
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            //console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
module.exports=queries;