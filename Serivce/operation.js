const jwt = require("jsonwebtoken");
const env=require('dotenv');
env.config();
const nodemailer = require('nodemailer');
const otpgenerator=require('otp-generator')
const query=require('../DB_Config/Query');

let operation = {};


// operation.ulogIn = async (data) => {
//     if(data.email=="" || data.password==""){
//      reject({ Success: false, Message: "Give Login Credetials !" })
//     }
//     else{
//      return new Promise(async (resolve, reject) => {
//         data.active="Y"
        
       
//       let connection_details=[process.env.DATABASE,process.env.USER_SCHEMA]
//         let result=await(query.findOne(data,connection_details));
//         if (typeof result !="string") {
//             let jwtData = {
//                 name: result[0].name,
//                 db:result[0].db,
//                 pin : result[0].pin_code,
//                 Built_Time: new Date()
//             }
//             let token =jwt.sign(jwtData, process.env.SECRET_KEY, { expiresIn: "1h" });          
//             let jwtdetails={
//                 name:result[0].name,
//                 token:token,
//                 logout:false,
//                 email:result[0].email              
//             }
//            let jwt_connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
//              let jwtresult=   await(query.insertSingle(jwtdetails,jwt_connection_details));
//              if (typeof jwtresult !="string") {
//                 resolve({ Success: true, Message: "Login Successfull",  Data: result ,Token:token})
//              }
//              else{
//                 resolve({ Success: false, Message: result  })
//             }
//         }
//         else{
//             resolve({ Success: false, Message: result  })
//         }
//         reject({ Success: false, Message: "Connection Failed !" })
//     });
//     }
   
// };
operation.ulogIn = async (data) => {
    if (!data.email || !data.password) {
        return Promise.reject({ Success: false, Message: "Please provide email and password" });
    }

    return new Promise(async (resolve, reject) => {
        data.active = "Y";
        let connection_details = [process.env.DATABASE, process.env.USER_SCHEMA];

        try {
            let result = await query.findOne(data, connection_details);
            if (typeof result === "string") {
                return reject({ Success: false, Message: result });
            }

            let jwtData = {
                name: result[0].name,
                db: result[0].db,
                pin: result[0].pin_code,
                Built_Time: new Date()
            };

            let token = jwt.sign(jwtData, process.env.SECRET_KEY, { expiresIn: "1h" });
            let jwtdetails = {
                name: result[0].name,
                token: token,
                logout: false,
                email: result[0].email
            };

            let jwt_connection_details = [process.env.DATABASE, process.env.JWT_SCHEMA];
            let jwtresult = await query.insertSingle(jwtdetails, jwt_connection_details);
            if (typeof jwtresult === "string") {
                return reject({ Success: false, Message: jwtresult });
            }

            resolve({ Success: true, Message: "Login Successful", Data: result, Token: token });
        } catch (error) {
            reject({ Success: false, Message: "Connection Failed !" });
        }
    });
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
        data.db = data.company_gstin.replace(/[^a-zA-Z0-9]/g, '');
            let result=await(query.insertSingle(data,connection_details));
            if (typeof result !="string") {
                    query.createDB(data.db)
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

operation.itemCreate = async (DbName,data) => {
    return new Promise(async (resolve, reject) => {
          
        let connection_details=[DbName,process.env.ITEM_SCHEMA]
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

operation.itemList = async (DbName,page,limit) => {
            
             return new Promise(async (resolve, reject) => {
               
                
               
               let connection_details=[DbName,process.env.ITEM_SCHEMA]
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
operation.itemView = async (DbName,item_cd) => {
   
        return new Promise(async (resolve, reject) => {
        //console.log("code",item_cd);
        if(!/^[A-Z]{2}\d{2}/.test(item_cd)){
        
            reject({ Success: false, Message: "Give proper id !" })
        }
        else{
       let connection_details=[DbName,process.env.ITEM_SCHEMA]
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
operation.itemUpdate = async (DbName,data,id) => {
    // //console.log(token);
    return new Promise(async (resolve, reject) => {
       if(!id){
        reject({ Success: false, Message: "Nothing to Update" });
       }
       else{
       let connection_details=[DbName,process.env.ITEM_SCHEMA]
       
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
operation.itemDelete = async (DbName,id) => {
// //console.log(token);
return new Promise(async (resolve, reject) => {
    if(!id){
    reject({ Success: false, Message: "Nothing to delete" });
    }
    else{
   let connection_details=[DbName,process.env.ITEM_SCHEMA]
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


operation.importCsvtoItem = async (DbName,items) => {
    
    return new Promise(async (resolve, reject) => {
    //    //console.log("iems---",items);
        let existingItem=[];
        let newItem=[];
       
        for(i of items){
            i.SP=+(i.SP)
            i.CP=+(i.CP)
            i.qty=+(i.qty)
            
        }

       let connection_details=[DbName,process.env.ITEM_SCHEMA]
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

operation.billCreate = async (DbName,data,decode) => {
    return new Promise(async (resolve, reject) => {
          console.log(data);
       let connection_details1=[DbName,process.env.BILL_SCHEMA]
        let connection_details2=[DbName,process.env.BILL_DET_SCHEMA]
        let bill_no=await operation.generateBillno(DbName);
        let bill_amount=0
        for(let i of data.items){
            bill_amount+=i.amount
        }
        let bill_item={
            bill_number:bill_no,
            date:new Date(),
            user:decode.name,
            amount:bill_amount+data.tax_value,
            pay:data.pay,
            due_date:data.due_date,
            tax_value:data.tax_value,
            cgst_amt:data.cgst_amt,
            sgst_amt:data.sgst_amt,
            cgst_per:data.cgst_per,
            sgst_per:data.sgst_per,
            igst_amt:data.igst_amt,
            igst_per:data.igst_per,
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
            await operation.profit_amount(DbName,i.item_cd,i.amount,bill_no,i.item_qty)
           await operation.updateStocks(DbName,i.item_cd,i.item_qty)
            
            
                     
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
operation.generateBillno=async(DbName)=>{
    let bill_no=""
    let connection_details=[DbName,process.env.BILL_SCHEMA]
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
operation.updateStocks=async(DbName,code,qty)=>{
   
   let connection_details=[DbName,process.env.ITEM_SCHEMA]
    let check=await(query.findOne({item_cd:code},connection_details))
    
    let result=await(query.updateRecord({item_cd:code},{qty:(check[0].qty-qty)},connection_details));
    
    if(result==true){
        return true
    }
    else{
        false
    }
}

operation.billList = async (DbName,page,limit) => {
            
    return new Promise(async (resolve, reject) => {
      let connection_details1=[DbName,process.env.BILL_SCHEMA]
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

operation.billUpdate = async (DbName,data,id) => {
   
    return new Promise(async (resolve, reject) => {
       if(!id){
        reject({ Success: false, Message: "Nothing to Update" });
       }
       else{
        
       let connection_details=[DbName,process.env.BILL_SCHEMA]
        let result=await(query.updateRecord({_id:id},data,connection_details));
        if (result==true) {
            if(data.refund===true){
                let connection_details=[DbName,process.env.BILL_SCHEMA]
                let connection_details2=[DbName,process.env.BILL_DET_SCHEMA]
                let connection_details3=[DbName,process.env.PROFIT_SCHEMA]
                let check=await(query.findOne({_id:id},connection_details))
                await(query.updateRecord({_id:id},{amount:0,tax_value:0},connection_details));
                await(query.updateAllRecords({bill_number:check[0].bill_number},{amount:0},connection_details2));
                await(query.updateAllRecords({bill_number:check[0].bill_number},{profit:0},connection_details3));
               
            }
           
            resolve({ Success: true, Message: "Bill Details Updated ! Kindly Update Store " });
        }
        else if(result=="true"){
          resolve({ Success: true, Message: "Nothing to Update !" });
        } else {
            reject({ Success: false, Message: "Bil Details Not Matched !" });
        }
       }
  
        
    });
  };
operation.billDelete = async (id) => {
// //console.log(token);
return new Promise(async (resolve, reject) => {
    if(!id){
    reject({ Success: false, Message: "Nothing to delete" });
    }
    else{
   let connection_details=[process.env.DATABASE,process.env.BILL_SCHEMA]
    let result=await(query.deleteRecord({_id:id},connection_details));
    if (result==true) {
        resolve({ Success: true, Message: "Bill Deleted Successfully" });
    }
     else {
        reject({ Success: false, Message: "Id Not Matched !" });
    }
    }

    
});
};

operation.total_sale_amount=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.count(connection_details,"amount")
    if(typeof total_amount!="string"){
        return total_amount[0].sum
    }
    else{
        return 0
    }
}
operation.total_tax_amount=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.count(connection_details,"tax_value")
    if(typeof total_amount!="string"){
        return total_amount[0].sum
    }
    else{
        return 0
    }
}
operation.total_due_amount=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countbyCondition(connection_details,"amount",{pay:false})
    console.log("due",total_amount);
    if(typeof total_amount!="string"){
        return total_amount[0].sum
    }
    else{
        return 0
    }
}


operation.total_refund_amount=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let connection_details2=[DbName,process.env.PROFIT_SCHEMA]
    let check=await(query.findOne({refund:true},connection_details))
    console.log("rfnd",check);
   let total_amount=0;
    for (let i of check){
       let total_amount2=await query.countbyCondition(connection_details2,"sold_at",{bill_number:i.bill_number})
       console.log(total_amount2);
       if(typeof total_amount2!="string"){
            total_amount+= total_amount2[0].sum
        }
        else{
            total_amount+=0
        }
    }
    console.log("refund:",total_amount);
   return total_amount
    
}
operation.total_profit_amount=async(DbName)=>{
    let connection_details=[DbName,process.env.PROFIT_SCHEMA]
    let total_amount=await query.count(connection_details,"profit")
    if(typeof total_amount!="string"){
        return total_amount[0].sum
    }
    else{
        return 0
    }
}
operation.total_unpaidBill=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countTotalbyCondition(connection_details,{pay:false})
    console.log("unpaid",total_amount);

    if(typeof total_amount!="string"){
        return total_amount[0].count
    }
    else{
        return 0
    }
}
operation.total_paidBill=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countTotalbyCondition(connection_details,{pay:true})
    console.log("paid",total_amount);

    if(typeof total_amount!="string"){
        return total_amount[0].count
    }
    else{
        return 0
    }
}

operation.total_refundBill=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countTotalbyCondition(connection_details,{refund:true})
    console.log("paid",total_amount);

    if(typeof total_amount!="string"){
        return total_amount[0].count
    }
    else{
        return 0
    }
}

operation.total_Bill=async(DbName)=>{
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countTotal(connection_details)
    console.log("total..",total_amount);
    if(typeof total_amount!="string"){
        return total_amount[0].count
    }
    else{
        return 0
    }
}
operation.total_Bill_By_User=async(DbName,user)=>{
    return new Promise(async (resolve, reject) => {
    let connection_details=[DbName,process.env.BILL_SCHEMA]
    let total_amount=await query.countTotalbyCondition(connection_details,{user:user})
    console.log("paid",total_amount);

    if(typeof total_amount!="string"){
        
        resolve({ Success: true, Data: total_amount[0].count  })
    }
    else{
        reject({ Success: false, Message: "Error"  })
    
}
})
}
operation.profit_amount=async(DbName,item_cd,rate,bill_no,qty)=>{
    let connection_details=[DbName,process.env.ITEM_SCHEMA]
    let item_rate=await query.findOne({item_cd:item_cd},connection_details)
    
    if(typeof item_price!="string"){

       let data={
        item_cd:item_cd,
        item_rate:(item_rate[0].CP)*qty,
        item_qty:qty,
        sold_at:rate,
        bill_number:bill_no,
        profit:rate-((item_rate[0].CP)*qty),
        date:new Date()
       }

       let connection_details1=[DbName,process.env.PROFIT_SCHEMA]
       let result=await(query.insertSingle(data,connection_details1));      
       if(typeof result !="string"){
        return true
       }
    }
    else{
        return false
    }
}
operation.updateStore = async (DbName) => {
            
    return new Promise(async (resolve, reject) => {
       
      let total_customer=await operation.total_Bill(DbName);
      let gross_sale=await operation.total_sale_amount(DbName)
      let due_amount=await operation.total_due_amount(DbName)
      let net_profit=await operation.total_profit_amount(DbName)
      let upaidBill_count=await operation.total_unpaidBill(DbName)
      let paidBill_count=await operation.total_paidBill(DbName)
      let refund_amount=await operation.total_refund_amount(DbName)
         let refundBill_count=await operation.total_refundBill(DbName)
         let tax_value=await operation.total_tax_amount(DbName)
      let data={
        customer_count:total_customer,
        gross_sale:gross_sale,
        due_amount:due_amount,
        net_profit:net_profit,
        unpaid_bill:upaidBill_count,
        paid_bill:paidBill_count,
          refund_amount:refund_amount,
          due_bill:refundBill_count,
          tax_value:tax_value
      }
    //   console.log("data",data);
      let connection_details1=[DbName,process.env.STAT_SCHEMA]
      let check=await query.findOne({},connection_details1)

      if(typeof check!='string'){
    
        await query.updateRecord({_id:check[0]._id},data,connection_details1)
        resolve({ Success: true, Message: 'Store Updated'  })
      }
      else{
       
        let check1=await query.insertSingle(data,connection_details1)
        // console.log("....",check1);
        resolve({ Success: true, Message: 'Store Updated'  })
  
      }
     
           reject({ Success: false, Message: "Error"  })
    
   });
   
  
};
operation.statDetail = async (DbName) => {
   
    return new Promise(async (resolve, reject) => {
   
   let connection_details=[DbName,process.env.STAT_SCHEMA]
    let result=await(query.findOne({},connection_details));
    if (typeof result !="string") {
        resolve({
            Success: true, Data: result
        })
    }
    else{
        resolve({ Success: false, Message: result  })
    }
    reject({ Success: false, Message: "Connection Failed !" })

});

};
operation.dueForToday = async (DbName) => {
   
    return new Promise(async (resolve, reject) => {
   
   let connection_details=[DbName,process.env.BILL_SCHEMA]
    let result=await(query.findDue(connection_details));
    if (typeof result !="string") {
        resolve({
            Success: true, Data: result
        })
    }
    else{
        resolve({ Success: false, Message: result  })
    }
    reject({ Success: false, Message: "Connection Failed !" })

});

};
module.exports=operation;
