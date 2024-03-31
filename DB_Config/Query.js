const env=require('dotenv');
env.config();
const connection=require('../DB_Config/Connection')
let queries={}

queries.findOne=async(data,connection_details)=>{
    if(data && connection_details){
        try{
                 
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            
            let result=await userModel.find(data,{__v:0});
            
            ////console.log(".....",result);
            if(result.length !=0){
                const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
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
            
            ////console.log("748965''''",page,limit);
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 500;
        ////console.log("748965''''",skipElements,limitTo);
            let result=await userModel.find({}, {__v:0}, { skip: skipElements, limit: limitTo });
            ////console.log(".....",result);
            const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
            if(result.length !=0){
             
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
queries.insertSingle=async(data,connection_details)=>{
    if(data && connection_details){       
      ////console.log(data);
      ////console.log(connection_details);
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
      try{
        let insertVal= await Model.insertMany(data)
        const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
       ////console.log("isert",insertVal);
        if(insertVal.length !=0){
            return insertVal;
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
      }catch(e){
        ////console.log(e);
        return "Duplicate Data"
      }
        
              
    }
    else{
        return "Something Went Wrong ! Please Try Again"
    }
}
queries.insertSingle1=async(data,connection_details)=>{
    if(data && connection_details){       
      ////console.log(data);
      ////console.log(connection_details);
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
      try{
        let insertVal= await Model.insertMany(data)
        const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
       ////console.log("isert",insertVal);
        if(insertVal.length !=0){
            return insertVal;
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
      }catch(e){
        ////console.log(e);
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
     const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
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
        const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
        if(result.deletedCount>0){
            return true
        }
        else{
            return false
        }
     
}}

queries.updateRecord=async(data,set,connection_details)=>{
    if(data && connection_details){      
        //console.log(data,set,connection_details); 
        try{
        let Model=connection.schemaconnect(connection_details[0],connection_details[1])
        let update_response=  await Model.updateOne(data,{$set:set},{ upsert: true })
        // //console.log(update_response);
        const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
        if (update_response.modifiedCount != 0) {
            return true
        } 
        else if(update_response.modifiedCount==0 && update_response.matchedCount!=0){
            return "true"
        }else {
            return false
        }}catch(e){
            return "false"
        }
     
}}
queries.FindLast=async(data,connection_details)=>{
    if(data && connection_details){
        try{
                 
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            
            let result=await userModel.find().sort(data).limit(1);
            ////console.log(".....",result);
            const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}

queries.join=async(page,limit,connection_details,table,field,label)=>{
    if(connection_details){
        try{
            
            ////console.log("748965''''",page,limit);
            let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
            let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 500;
        ////console.log("748965''''",skipElements,limitTo);
        let result = await userModel.aggregate([
            {
              $lookup: {
                from: `${table}s`, 
                localField: field, 
                foreignField: field, 
                as: label 
              }
            },
            {
              $project: {
                __v: 0 
              }
            },
            { $skip: skipElements }, 
            { $limit: limitTo } 
          ]);
          
          //console.log(result);
          const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
            ////console.log(".....",result);
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}

queries.count=async(connection_details,label)=>{
    if(connection_details){
        try{
        label=`$${label}`
     
        let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
        let result = await userModel.aggregate([
            {
              $group: {
                _id: null, 
                sum: { $sum: label } 
              }
            }
          ])
          
    
          const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
          
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}

queries.countbyCondition=async(connection_details,label,condition)=>{
    if(connection_details){
        try{
        label=`$${label}`
     
        let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
        let result = await userModel.aggregate([
            {
              $match: condition // Filter documents where pay is true
            },
            {
              $group: {
                _id: null, 
                sum: { $sum: label} 
              }
            }
          ]);
          
          
    
          const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
          
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
queries.countTotal=async(connection_details)=>{
    if(connection_details){
        try{
       
    //   //console.log(connection_details);
        let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
        let result = await userModel.aggregate([
            {
              $group: {
                _id: null, 
                count: { $sum: 1 } // Count the number of documents
              }
            }
          ]);
          //console.log("total", result);
         
          
    
          const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
          
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
queries.countTotalbyCondition=async(connection_details,condition)=>{
    if(connection_details){
        try{
        
     
        let userModel=connection.schemaconnect(connection_details[0],connection_details[1])
        let result = await userModel.aggregate([
            {
              $match: condition
            },
            {
              $group: {
                _id: null, 
             
                count: { $sum: 1 } // Count the number of documents
              }
            }
          ]);
          
          
          
          
    
          const dbs=  connection.dbconnect(true);
            //console.log("....",dbs);
          
            if(result.length !=0){
                return result;
            }
            else{
                return "No Data Found !"
            }
                  
    

        }catch(e){
            
            ////console.log(e);
            return "No Data Found error!"
        }       
        }
        else{
            return "Something Went Wrong ! Please Try Again"
        }
        
}
module.exports=queries;