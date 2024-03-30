const jwt = require("jsonwebtoken");
const env=require('dotenv');
env.config();
const nodemailer = require('nodemailer');
const otpgenerator=require('otp-generator')
const query=require('../DB_Config/Query');

let operation = {};


operation.ulogIn = async (data) => {
    if(data.email=="" || data.password==""){
     reject({ Success: false, Message: "Give Login Credetials !" })
    }
    else{
     return new Promise(async (resolve, reject) => {
        data.active="Y"
        
       
      let connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
        let result=await(query.findOne(data,connection_details));
        if (typeof result !="string") {
            let jwtData = {
                name: result[0].name,
                pin : result[0].pin_code,
                Built_Time: new Date()
            }
            let token =jwt.sign(jwtData, process.env.SECRET_KEY, { expiresIn: "1h" });          
            let jwtdetails={
                name:result[0].name,
                token:token,
                logout:false,
                email:result[0].email              
            }
           let jwt_connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
             let jwtresult=   await(query.insertSingle(jwtdetails,jwt_connection_details));
             if (typeof jwtresult !="string") {
                resolve({ Success: true, Message: "Login Successfull",  Data: result ,Token:token})
             }
             else{
                resolve({ Success: false, Message: result  })
            }
        }
        else{
            resolve({ Success: false, Message: result  })
        }
        reject({ Success: false, Message: "Connection Failed !" })
    });
    }
   
};


operation.userRegistration = async (data) => {
    return new Promise(async (resolve, reject) => {
        data.active='Y'
      
      let  connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
        let check=await(query.findOne({email:data.email,mobile:data.mobile,active:"Y",name:data.name,pin_code:data.pin_code},connection_details))
        if(typeof check!="string"){
            resolve({ Success: true, Message: "User Already Registered" })
        }
        else{
           
              
            
        //    //console.log("here");
            let result=await(query.insertSingle(data,connection_details));
            if (typeof result !="string") {
                
                resolve({ Success: true, Message: "User Registered !",  Data: result })
               
                
             }
             else{
                reject({ Success: false, Message: result  })
            }
        }})}
    
operation.otpVerify = async (data) => {
    return new Promise(async (resolve, reject) => {
    //console.log(data);
   let connection_details=[process.env.DATABASE,process.env.OTP_SCHEMA]
    let result=await(query.findOne(data,connection_details));
//console.log(result)
        if (typeof result=="string") {  
           reject({ Success: false, Message: "Wrong OTP !" })
        }
        else{ 
    let current=result[0]
       if(Date.now()-current.timestamp>300000){
        reject({ Success: false, Message: "Otp has Expired!" })
       }
       else{        
            await query.deleteRecord({_id:current._id},connection_details)
            resolve({ Success: true, Message: "Email Verified !"  })
       

       }

        }

    })
}
operation.sendOtp = async (data) => {
    return new Promise(async (resolve, reject) => {
        const Otp=otpgenerator.generate(6,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
       let connection_details2=[process.env.DATABASE,process.env.OTP_SCHEMA]
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            }
        });    
        var mailOptions = {
            from: process.env.MAIL_ID,
            to: `${data.email}`,
            subject: 'REGISTRATION OTP',
            text: `OTP FOR VERIFICATION : ${Otp}`,
           
          };
if(data.email==""){

reject({ Success: false, Message: "Please Provide Email"  })
    
}
else{ 

transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              //console.log(error);
            } else {
              //console.log('Email sent: ' + info.response);
            }
          });

       let res= await(query.insertSingle({email:data.email,otp:Otp,timestamp:Date.now(),index:{expires:60}},connection_details2));
       if(typeof res !="string"){
        resolve({ Success: true, Message: "Otp Sent Succesfully  !" })
       }
       else{
        reject({ Success: false, Message: res  })
       }
    
}
        
          
    
    })
}

operation.ulogOut = async (token) => {
  // //console.log(token);
  return new Promise(async (resolve, reject) => {
     

     let connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
      let result=await(query.updateRecord({token:token},{logout:true},connection_details));
      if (result==true) {
          resolve({ Success: true, Message: "Logged Out Successfully" });
      } else {
          reject({ Success: false, Message: "Already Logged Out" });
      }
  });
};


operation.forgotPassword = async (data) => {
  // //console.log(token);
  return new Promise(async (resolve, reject) => {
     if(data.email==""){
      reject({ Success: false, Message: "Provide Email!" });
     }
     else{
     let connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
      let result=await(query.updateRecord({email:data.email},{password:data.new_password},connection_details));
      if (result==true) {
          resolve({ Success: true, Message: "Password Changed Successfully" });
      }
      else if(result=="true"){
        resolve({ Success: true, Message: "New Password Can not be Same as Old One !" });
      } else {
          reject({ Success: false, Message: "User Details Not Matched !" });
      }
     }

      
  });
};


operation.userDataUpdate = async (data,id) => {
  // //console.log(token);
  return new Promise(async (resolve, reject) => {
     if(!id){
      reject({ Success: false, Message: "Nothing to Update" });
     }
     else{
      let connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
      let result=await(query.updateRecord({_id:id},data,connection_details));
      if (result==true) {
          resolve({ Success: true, Message: "User Details Updated" });
      }
      else if(result=="true"){
        resolve({ Success: true, Message: "Nothing to Update !" });
      }
      else if(result==="false"){
        reject({ Success: false, Message: "Mobile or Email Already Exists" });
      } 
      else {
          reject({ Success: false, Message: "User Details Not Matched !" });
      }
     }

      
  });
};

operation.itemCreate = async (data) => {
    return new Promise(async (resolve, reject) => {
          
        let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
        let check=await(query.findOne({item_cd:data.item_cd,source:data.source},connection_details))
        //console.log(check);
        if(typeof check!="string"){
            data.qty=data.qty+check[0].qty
           
            let result=await(query.updateRecord({item_cd:data.item_cd},data,connection_details));
            if (result==true) {
             resolve({ Success: true, Message: "Item Details Updated" });
            }
            else if(result=="true"){
            resolve({ Success: true, Message: "Item Details Not Updated" });
            }
            
        }
        else{
            //console.log("here");
            let result=await(query.insertSingle(data,connection_details));
            if (typeof result !="string") {
                
                resolve({ Success: true, Message: "Item Added",  Data: result })
             }
             else{
                reject({ Success: false, Message: result  })
            }
        }
    }
        )}

operation.itemList = async (page,limit) => {
            
             return new Promise(async (resolve, reject) => {
                
                
               
               let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
                let result=await(query.findAll(page,limit,connection_details));
                if (typeof result !="string") {
                    resolve({
                        Success: true, Data: result, pagination: {
                            page: page != undefined ? page : 1, limit: limit != undefined ? limit : 500
                        }
                    })
                }
                else{
                    resolve({ Success: false, Message: result  })
                }
                reject({ Success: false, Message: "Connection Failed !" })
            });
            
           
        };
operation.itemView = async (item_cd) => {
   
        return new Promise(async (resolve, reject) => {
        //console.log("code",item_cd);
        if(!/^[A-Z]{2}\d{2}/.test(item_cd)){
        
            reject({ Success: false, Message: "Give proper id !" })
        }
        else{
       let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
        let result=await(query.findOne({item_cd:item_cd},connection_details));
        if (typeof result !="string") {
            resolve({
                Success: true, Data: result
            })
        }
        else{
            resolve({ Success: false, Message: result  })
        }
        reject({ Success: false, Message: "Connection Failed !" })
    }
    });
    
};
operation.itemUpdate = async (data,id) => {
    // //console.log(token);
    return new Promise(async (resolve, reject) => {
       if(!id){
        reject({ Success: false, Message: "Nothing to Update" });
       }
       else{
       let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
        let result=await(query.updateRecord({_id:id},data,connection_details));
        if (result==true) {
            resolve({ Success: true, Message: "Item Details Updated" });
        }
        else if(result=="true"){
          resolve({ Success: true, Message: "Nothing to Update !" });
        } else {
            reject({ Success: false, Message: "Item Details Not Matched !" });
        }
       }
  
        
    });
  };
operation.itemDelete = async (id) => {
// //console.log(token);
return new Promise(async (resolve, reject) => {
    if(!id){
    reject({ Success: false, Message: "Nothing to delete" });
    }
    else{
   let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
    let result=await(query.deleteRecord({_id:id},connection_details));
    if (result==true) {
        resolve({ Success: true, Message: "Item Deleted Successfully" });
    }
     else {
        reject({ Success: false, Message: "Id Not Matched !" });
    }
    }

    
});
};


operation.importCsvtoItem = async (items) => {
    
    return new Promise(async (resolve, reject) => {
    //    //console.log("iems---",items);
        let existingItem=[];
        let newItem=[];
       
        for(i of items){
            i.SP=+(i.SP)
            i.CP=+(i.CP)
            i.qty=+(i.qty)
            
        }

       let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
        // //console.log(items);
        for(i of items){
            let check=await(query.findOne({item_cd:i.item_cd,source:i.source},connection_details))
           
            if(typeof check!="string"){
                i.qty=i.qty+check[0].qty
               existingItem.push(i)
                //
            }
           else{
            newItem.push(i)
           }
        //       
            //   await itemModel.updateOne({ _id: previtem[0].id }, { $set: items })
            
        }

        
        for(i of newItem){
            await(query.insertSingle(i,connection_details));
        }
        
 
    
    
        
        for(i of existingItem){
            
          await(query.updateRecord({item_cd:i.item_cd},i,connection_details));
           
        }
        let f=1
        if (f==1) {
            resolve({ Success: true, Message: "Imported" })
        }
        else {
            reject({ Success: false, Message: "Failed" })
        }
       
    })
}

operation.billCreate = async (data,decode) => {
    return new Promise(async (resolve, reject) => {
          
       let connection_details1=[process.env.DATABASE,process.env.BILL_SCHEMA]
        let connection_details2=[process.env.DATABASE,process.env.BILL_DET_SCHEMA]
        let bill_no=await operation.generateBillno();
        let bill_amount=0
        for(let i of data.items){
            bill_amount+=i.amount
        }
        let bill_item={
            bill_number:bill_no,
            date:new Date(),
            user:decode.name,
            amount:bill_amount,
            pay:data.pay
        }
        let bill_det=[]
        for(let i of data.items){
            i.bill_number=bill_no,
            i.cus_name=data.cus_name
            i.cus_email=data.cus_email
            i.cus_mobile=data.cus_mobile
            i.cus_address=data.cus_address
            i.date=new Date()
            bill_det.push(i) 
           await operation.updateStocks(i.item_cd,i.item_qty)
            
            
                     
        }
        console.log(connection_details1);
       let bill_item_result=await(query.insertSingle(bill_item,connection_details1));
       console.log(bill_item_result);
       if(typeof bill_item_result!="string"){
        let bill_det_result=await(query.insertSingle1(bill_det,connection_details2));
        console.log(bill_det_result);
        if(typeof bill_det_result!='string'){
            resolve({Success:true,Message:'Bill Created',"Bill_no":bill_no})
        }else{
            reject({Success:false,Message:'Bill Entry Done Partially'})
        }
       }
       else{
        reject({Success:false,Message:'Bill Entry Failed'})
       }
        
    }
        )}
operation.generateBillno=async()=>{
    let bill_no=""
    let connection_details=[process.env.DATABASE,process.env.BILL_SCHEMA]
    let check=await(query.findOne({},connection_details))
    if(typeof check!="string"){
        
        let bill_check=await(query.FindLast({date:-1},connection_details))
        
        lastBill=bill_check[0].bill_number
      
        lastdigit=lastBill.lastIndexOf("A")
       
        srl=(lastBill.slice(lastdigit+1))
        srl=+(srl)
        year=new Date().getFullYear()
        month=new Date().getMonth()
      
        bill_no=`A${year}${month}A${srl+1}`
        return bill_no
    }
    else{
        
        year=new Date().getFullYear()
        month=new Date().getMonth()
        bill_no=`A${year}${month}A1`
        console.log(bill_no);
        return bill_no
    }
    
}
operation.updateStocks=async(code,qty)=>{
   
   let connection_details=[process.env.DATABASE,process.env.ITEM_SCHEMA]
    let check=await(query.findOne({item_cd:code},connection_details))
    
    let result=await(query.updateRecord({item_cd:code},{qty:(check[0].qty-qty)},connection_details));
    
    if(result==true){
        return true
    }
    else{
        false
    }
}

operation.billList = async (page,limit) => {
            
    return new Promise(async (resolve, reject) => {
      let connection_details1=[process.env.DATABASE,process.env.BILL_SCHEMA]
      let connection_details2=process.env.BILL_DET_SCHEMA
      let commonField='bill_number'
      let label='detail'
       let bill_result=await(query.join(page,limit,connection_details1,connection_details2,commonField,label));
       if (typeof bill_result !="string") {
      
           resolve({
               Success: true, Data: bill_result, pagination: {
                   page: page != undefined ? page : 1, limit: limit != undefined ? limit : 500
               }
           })
       }
       else{
           resolve({ Success: false, Message: bill_result  })
       }
       reject({ Success: false, Message: "Connection Failed !" })
   });
   
  
};
module.exports=operation;
