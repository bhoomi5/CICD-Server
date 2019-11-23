var jwt = require('jsonwebtoken');
const redisObj=require('../service/redis1')
require('dotenv').config();
const logger=require('../logger/logger')
exports.generateToken=(payload)=>{
    let token = jwt.sign(payload,'privateKey', {
        expiresIn: '24h' // (in sec) expires in 6 hours
     });
     let object={
         success:true,
         message:"token generated",
         token:token
     }
     return object;
}
exports.verifyToken=(req,res,next)=>{
    let token = req.header('token')
    if(token){
        jwt.verify(token,"privateKey",(err,decoded)=>{
            if(err)
            {
                res.status(400).send(err +" Token has expired")
            }else{
                // console.log("token-else--- "+JSON.stringify(decode));
                req.token=decoded;
                let key=decoded._id
                let field=process.env.TOKEN
                let getCacheData=redisObj.hgetFromRedis(key,field)
                getCacheData.then((data)=>{
                    if(data==token){
                      next();
                    }
                     else{
                     res.status(400).send("Credentials Does Not Match")}
                })
                
            }
        })
    }else{
        logger.error("token not receive");
        res.status(400).send(" Token not receive") 
    }
}
    
