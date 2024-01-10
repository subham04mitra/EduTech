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
        
       
       connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
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
            jwt_connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
             let jwtresult=   await(query.insertSingle(jwtdetails,jwt_connection_details));
             if (typeof jwtresult !="string") {
                resolve({ Success: true, Message: "Login Successfull",  Data: result ,Token:token})
             }
             else{
                resolve({ Success: true, Message: result  })
            }
        }
        else{
            resolve({ Success: true, Message: result  })
        }
        reject({ Success: false, Message: "Connection Failed !" })
    });
    }
   
};

operation.userRegistration = async (data) => {
    return new Promise(async (resolve, reject) => {
        data.active='Y'
      
        connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
        let check=await(query.findOne({email:data.email,mobile:data.mobile,active:"Y",name:data.name,pin_code:data.pin_code},connection_details))
        if(typeof check!="string"){
            resolve({ Success: true, Message: "User Already Registered" })
        }
        else{
           
              
            
           console.log("here");
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
    console.log(data);
    connection_details=[process.env.DATABASE,process.env.OTP_SCHEMA]
    let result=await(query.findOne(data,connection_details));
console.log(result)
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
        connection_details2=[process.env.DATABASE,process.env.OTP_SCHEMA]
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
            text: `OTP FOR VERIFICATION : ${Otp}`
          };
if(data.email==""){

reject({ Success: false, Message: "Please Provide Email"  })
    
}
else{ 

transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

       let res= await(query.insertSingle({email:data.email,otp:Otp,timestamp:Date.now(),index:{expires:60}},connection_details2));
       if(typeof res !="string"){
        resolve({ Success: true, Message: "Otp Sent Succesfully  !",Otp:Otp })
       }
       else{
        reject({ Success: false, Message: res  })
       }
    
}
        
          
    
    })
}
module.exports=operation;
