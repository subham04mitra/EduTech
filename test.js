{
  "user": {
      "name": {
          "type": "String"
      },
      "email": {
          "type": "String",
          "unique":true         
      },
      "mobile": {
          "type": "Number",
          "unique":true
          
      },
      "company": {
          "type": "String"
      },
      "address": {
          "type": "String"
      },
      "password": {
          "type": "String"
      },
      "pin_code":{
          "type":"Number"
      },
      "active":{
          "type":"String"
      },
      "verified":{
          "type":"String"
      } ,
      "db":{
          "type":"String"
      }   
},
  "jwt": {
      "token": {
          "type": "String"
      },
      "name": {
          "type": "String"
      },
      "logout": {
          "type": "Boolean"
      },
      "email":{
          "type":"String"
      }
  },
  "otp":{
      "email":{
          "type":"String"
      },
      "otp":{
          "type":"Number"
      },
      "timestamp":{
          "type":"Date"
      }
  },
  "item": {
      "name": {
          "type": "String"
      },
      "category": {
          "type": "String"           
      }
      ,
      "subcategory": {
          "type": "String" 
      } ,
      "CP": {
          "type": "Number" 
      }   ,
      "SP": {
          "type": "Number" 
      } ,
      "item_cd": {
          "type": "String" 
      } ,
      "source": {
          "type": "String" 
      } ,
      "item_des": {
          "type": "String" 
      } ,
      "qty":{
          "type":"Number"
      }
},
"bill":{
  "bill_number":{
      "type":"String"
  },
  "amount":{
      "type":"Number"
  },
  "date":{
      "type":"Date"
  },
  "user":{
      "type":"String"
  },
  "pay":{
      "type":"Boolean"
  },
  "refund":{
      "type":"Boolean"
  },
  "due_date":{
      "type":"Date"
  },
  "cgst_amt":{
      "type":"Number",
      "default":0
  },
  "sgst_amt":{
      "type":"Number",
      "default":0
  },
  
  "cgst_per":{
      "type":"Number",
      "default":0
  },
  
  "sgst_per":{
      "type":"Number",
      "default":0
  },
  "igst_amt":{
      "type":"Number",
      "default":0
  },
  
  "igst_per":{
      "type":"Number",
      "default":0
  },
  "tax_value":{
      "type":"Number"
  }
},
"bill_det":{
  "bill_number":{
      "type":"String"
  },
  "cus_name":{
      "type":"String"
  },
  "cus_email":{
      "type":"String"
  },
  "cus_mobile":{
      "type":"String"
  },
  "cus_address":{
      "type":"String"
  },
  "item_cd":{
      "type":"String"
  },

  "item_name":{
      "type":"String"
  },
  "item_qty":{
      "type":"Number"
  },
  "item_rate":{
      "type":"Number"
  },
  
  "amount":{
      "type":"Number"
  },
  "date":{
      "type":"Date"
  }
},
"profit":{
  "item_cd":{
      "type":"String"
  },
  "item_rate":{
      "type":"Number"
  },
  "sold_at":{
      "type":"Number"
  },
  "bill_number":{
      "type":"String"
  },
  "date":{
      "type":"Date"
  },
  "profit":{
      "type":"Number"
  },"item_qty":{
      "type":"Number"
  }
},
"stat":{
  "customer_count":{
      "type":"Number"
  },
  "gross_sale":{
      "type":"Number"
  },
  "due_amount":{
      "type":"Number"
  },
  "net_profit":{
      "type":"Number"
  },
  "unpaid_bill":{
      "type":"Number"
  },
  "paid_bill":{
      "type":"Number"
  },
  "refund_amount":{
      "type":"Number"
  },
  "due_bill":{
      "type":"Number"}
      ,
  "tax_value":{
      "type":"Number"
  }
}
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


