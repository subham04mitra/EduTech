const express = require('express');
const fs = require('fs');
const path = require('path');
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
    let DbName=req.decode.db
    try {
        let response = await db.itemCreate(DbName,data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemList = async (req, res) => {
let page=(req.query.page);
let DbName=req.decode.db

let limit=(req.query.limit)
    try {
        let response = await db.itemList(DbName,page,limit);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemView = async (req, res) => {
    let id=req.params.itemcode
    let DbName=req.decode.db
    try {
        let response = await db.itemView(DbName,id);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }

}
service.itemUpdate = async (req, res) => {
    let data = req.body;
    let id=req.params.id
    let DbName=req.decode.db
    try {
        let response = await db.itemUpdate(DbName,data, id);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.itemDelete = async (req, res) => {
    let id=req.params.id
    let DbName=req.decode.db
    try {
        let response = await db.itemDelete(DbName,id);
        if (response) {
            res.json(response);

        }
    } catch (err) {
        res.json(err)
    }
}
// service.importItem = async (req, res) => {
   
//     try {
//         let decode=req.decode
//         let DbName=req.decode.db
//         let items=[];
        
//         csv().fromFile(req.file.path).then(async(response)=>{
//             // //console.log(response);
//             //console.log("res",response);
//             for(var x=0;x<response.length;x++){
//                 items.push({
//                     item_cd:response[x].Code,
//                     category:response[x].Category,
//                     subcategory:response[x].Subcategory,
//                     name:response[x].Name,
//                     source:response[x].Source,
//                     item_des:response[x].Description,
//                     SP:response[x].Sale,
//                     CP:response[x].Cost,
//                     qty:response[x].Quantity
                 
//                 })
                
//             }
          
//             // //console.log(users);
            
//              let first=await db.importCsvtoItem(DbName,items);
//              if(first.length!=0){
//                 res.json({ Success: true, Message: "Imported" })
//              }
            
        
//         })
        
//     } catch (err) {
//         res.json({ Success: false, Message: "Failed" })
//     }
// }
service.importItem = async (req, res) => {
    try {
        let decode = req.decode;
        let DbName = req.decode.db;
        let items = [];
        
        // Validate file extension
        if (req.file && path.extname(req.file.originalname).toLowerCase() === '.csv') {
            csv().fromFile(req.file.path).then(async (response) => {
                for (var x = 0; x < response.length; x++) {
                    items.push({
                        item_cd: response[x].Code,
                        category: response[x].Category,
                        subcategory: response[x].Subcategory,
                        name: response[x].Name,
                        source: response[x].Source,
                        item_des: response[x].Description,
                        SP: response[x].Sale,
                        CP: response[x].Cost,
                        qty: response[x].Quantity
                    });
                }
                
                let first = await db.importCsvtoItem(DbName, items);
                if (first.length != 0) {
                    fs.unlinkSync(req.file.path);
                    res.json({ Success: true, Message: "Imported" });
                }
            });
        } else {
            fs.unlinkSync(req.file.path);
            res.json({ Success: false, Message: "Please upload a CSV file." });
        }
    } catch (err) {
        fs.unlinkSync(req.file.path);
        res.json({ Success: false, Message: "Failed" });
    }
};
service.billAdd= async (req, res) => {
    let data = req.body;
    let decode=req.decode
    let DbName=req.decode.db
    try {
        let response = await db.billCreate(DbName,data,decode);
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
    let DbName=req.decode.db
        try {
            let response = await db.billList(DbName,page,limit);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }

    service.billUpdate = async (req, res) => {
        let data = req.body;
        let id=req.params.id
        let DbName=req.decode.db
        // console.log(data,id);
        try {
            let response = await db.billUpdate(DbName,data, id);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }
    service.billDelete = async (req, res) => {
        let id=req.params.id
        try {
            let response = await db.billDelete(id);
            if (response) {
                res.json(response);
    
            }
        } catch (err) {
            res.json(err)
        }
    }
    service.storeUpdate = async (req, res) => {
       
        // console.log(data,id);
        try {
            let DbName=req.decode.db
            let response = await db.updateStore(DbName);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }
    service.statDetail = async (req, res) => {
       
        try {
            let DbName=req.decode.db
            let response = await db.statDetail(DbName);
            if (response) {
                res.json(response);
    
            }
        } catch (err) {
            res.json(err)
        }
    }
    service.billByUser = async (req, res) => {
       
        let user=req.params.user
        let DbName=req.decode.db

        // console.log(data,id);
        try {
            let response = await db.total_Bill_By_User(DbName,user);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }
    service.dueBill = async (req, res) => {
       
        let DbName=req.decode.db
        // console.log(data,id);
        try {
            let response = await db.dueForToday(DbName);
            if (response) {
                res.json(response);
            }
        } catch (err) {
            res.json(err)
        }
    }
module.exports=service;