//const getUserFromToken = require("../getUserFromToken");
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


let tokenid = {};
dotenv.config();

tokenid.setCurrentUser = function (obj) {
  const promise=new Promise(resolve=>{
    let jwstoken = process.env.mytokenRahul;
  
    console.log(obj)
    
  
  resolve(jwt.sign(obj,"jwstoken"))
   
  })

 
return promise;
 
        
};


module.exports = tokenid;
