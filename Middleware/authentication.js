const jwt = require("jsonwebtoken");
const env=require('dotenv');
env.config();
const query=require('../DB_Config/Query');
async function verify(req, res, next) {
    let token = req.headers.token;
    console.log("auth token",token);
    try {
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        req.decode = decode;
    //   console.log(";;;;;;;;;;;;;;;;;;;",decode);

        connection_details=[process.env.DATABASE,process.env.JWT_SCHEMA]
        let validtoken=await(query.findOne({ token: token },connection_details));
// console.log("......................",validtoken);
        if (decode.name === validtoken[0].name) {
            if (validtoken[0].logout == false) {
                // console.log("to next");
                next();
            }
            else {
                
                res.json({ Success: false, Message: "Already Logout" })
            }
        }
    } catch (err) {

        console.log(err);
        // console.log(token);
        res.json({ Success: false, Message: "Session Time Out, Login Again !" })
    }
}
module.exports = verify;