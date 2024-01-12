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
       let design =""
      
        var mailOptions = {
            from: process.env.MAIL_ID,
            to: `${data.email}`,
            subject: 'REGISTRATION OTP',
            // text: `OTP FOR VERIFICATION : ${Otp}`,
            html: `<div
            style={{
              fontFamily: "Helvetica,Arial,sans-serif",
              minWidth: 1000,
              overflow: "auto",
              lineHeight: 2
            }}
          >
            <div style={{ margin: "50px auto", width: "70%", padding: "20px 0" }}>
              <div style={{ borderBottom: "1px solid #eee" }}>
                <a
                  href=""
                  style={{
                    fontSize: "1.4em",
                    color: "#00466a",
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  Technoid Kolkata
                </a>
              </div>
              <p style={{ fontSize: "1.1em" }}>Hi, ${data.email}</p>
              <p>
                Thank you for choosing Technoid. Use the following OTP to complete your
                Sign Up procedures. OTP is valid for 5 minutes
              </p>
              <h2
                style={{
                  background: "#00466a",
                  margin: "0 auto",
                  width: "max-content",
                  padding: "0 10px",
                  color: "#fff",
                  borderRadius: 4
                }}
              >
                ${Otp}
              </h2>
              <p style={{ fontSize: "0.9em" }}>
                Regards,
                <br />
               Technoid
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              <div
                style={{
                  float: "right",
                  padding: "8px 0",
                  color: "#aaa",
                  fontSize: "0.8em",
                  lineHeight: 1,
                  fontWeight: 300
                }}
              >
                <p>Technoid Kolkata</p>
                <p>Kolkata</p>
                <p>West Bengal</p>
              </div>
            </div>
          </div>`
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



operation.ulogOut = async (token) => {
  // console.log(token);
  return new Promise(async (resolve, reject) => {
     

      connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
      let result=await(query.updateRecord({token:token},{logout:true},connection_details));
      if (result==true) {
          resolve({ Success: true, Message: "Logged Out Successfully" });
      } else {
          reject({ Success: false, Message: "Already Logged Out" });
      }
  });
};


operation.forgotPassword = async (data) => {
  // console.log(token);
  return new Promise(async (resolve, reject) => {
     if(data.email==""){
      reject({ Success: false, Message: "Provide Email!" });
     }
     else{
      connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
      let result=await(query.updateRecord({email:data.email},{password:data.new_password},connection_details));
      if (result==true) {
          resolve({ Success: true, Message: "Password Changed Successfully" });
      } else {
          reject({ Success: false, Message: "User Details Not Matched !" });
      }
     }

      
  });
};
module.exports=operation;
