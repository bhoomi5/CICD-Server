/* ************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : get the values from the controller and process them for the notes in fundo  notes
 *                    
 *                     
 *                    
 * 
 * @file            : service.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });
var redisObj=require('../service/redis1')
class redisCache{
    cacheNotes(req,res,next){
            
            var key=req.token._id+"getAllNotes"
            var response={}
                var a=redisObj.getDataFromRedis(key)
                a.then((data)=>{
                    if(data){
                    console.log("from cache : ")
                    response.success=true
                    response.message="Data from Redis cache"
                    response.content=JSON.parse(data)
                    res.status(200).send(response)
                    }
                    else{
                        console.log("in controller");
                        next();
                    }
                }).catch((err)=>{
                     console.log(err)
                })
        }
        cacheLabels(req,res,next){
            var key=req.token._id+"getAllLabels"
            var response={}
                var a=redisObj.getDataFromRedis(key)
               
                a.then((data)=>{
                    if(data){
                    console.log("data in a",data)
                    console.log("from cache : ")
                    response.success=true
                    response.message="Data from Redis cache"
                    response.content=JSON.parse(data)
                    res.status(200).send(response)
                    }
                    else{
                        console.log("in controller");
                        next();
                    }
                }).catch((err)=>{
                     console.log(err)
                })
        }
        cacheList(req,res,next){
            var redisKey=Object.keys(req.query)[0]
            var key=req.token._id+redisKey+"true"
            var response={}
                redisObj.getDataFromRedis(key)
                .then((data)=>{
                    if(data){
                    console.log("from cache : ")
                    response.success=true
                    response.message="Data from Redis cache"
                    response.content=JSON.parse(data)
                    res.status(200).send(response)
                    }
                    else{
                        console.log("in controller");
                        next();
                    }
                }).catch((err)=>{
                     console.log(err)
                })
        }
}
module.exports=new redisCache();