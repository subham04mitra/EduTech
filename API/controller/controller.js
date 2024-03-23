const express = require('express');
const db = require('../../Serivce/operation');
const csv=require('csvtojson');
let service = {};


service.ulogin = async (req, res) => {
    
  
    let data = req.body;
  
    try {
        let response = await db.ulogIn(data);
        if (response) {

            res.send(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.uReg = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.userRegistration(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.uverify = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.otpVerify(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.sendotp = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.sendOtp(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}


service.ulogout = async (req, res) => {
    let token = req.headers.token;
    // //console.log(req.headers.token);

    try {
        let response = await db.ulogOut(token);
        if (response) {
            res.json( response );
        }
    } catch (err) {
        res.json(err)
    }
}

service.resetPassword = async (req, res) => {
    let data = req.body;
    // //console.log(req.headers.token);

    try {
        let response = await db.forgotPassword(data);
        if (response) {
            res.json( response );
        }
    } catch (err) {
        res.json(err)
    }
}

service.userUpdate = async (req, res) => {
    let data = req.body;
    let id=req.params.id
    // //console.log(req.headers.token);

    try {
        let response = await db.userDataUpdate(data,id);
        if (response) {
            res.json( response );
        }
    } catch (err) {
        res.json(err)
    }

}
service.itemAdd = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.itemCreate(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemList = async (req, res) => {
let page=(req.query.page);
let limit=(req.query.limit)
    try {
        let response = await db.itemList(page,limit);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemView = async (req, res) => {
    let id=req.params.itemcode
    try {
        let response = await db.itemView(id);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }

}
service.itemUpdate = async (req, res) => {
    let data = req.body;
    let id=req.params.itemcode
    try {
        let response = await db.itemUpdate(data, id);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemDelete = async (req, res) => {
    let id=req.params.id
    try {
        let response = await db.itemDelete(id);
        if (response) {
            res.json(response);

        }
    } catch (err) {
        res.json(err)
    }
}
service.importItem = async (req, res) => {
   
    try {
        let decode=req.decode
        
        let items=[];
        
        csv().fromFile(req.file.path).then(async(response)=>{
            // //console.log(response);
            //console.log("res",response);
            for(var x=0;x<response.length;x++){
                items.push({
                    item_cd:response[x].Code,
                    category:response[x].Category,
                    subcategory:response[x].Subcategory,
                    name:response[x].Name,
                    source:response[x].Source,
                    item_des:response[x].Description,
                    SP:response[x].Sale,
                    CP:response[x].Cost,
                    qty:response[x].Quantity
                 
                })
                
            }
          
            // //console.log(users);
            
             let first=await db.importCsvtoItem(items);
             if(first.length!=0){
                res.json({ Success: true, Message: "Imported" })
             }
            
        
        })
        
    } catch (err) {
        res.json({ Success: false, Message: "Failed" })
    }
}
service.billAdd= async (req, res) => {
    let data = req.body;
    let decode=req.decode
    try {
        let response = await db.billCreate(data,decode);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.billList = async (req, res) => {
    let page=(req.query.page);
    let limit=(req.query.limit)
        try {
            let response = await db.billList(page,limit);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }
module.exports=service;