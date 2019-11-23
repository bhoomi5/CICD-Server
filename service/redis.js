/* ************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
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
var serviceObj = require('./note')
require('dotenv').config();
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: process.env.REDISPORT });
class RedisService {
    getDataFromRedis(key) {
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err, reply) => {
                console.log("key value in redis service",reply)
                resolve(reply)
            });
        })


    }
    setDataToRedis(setData, key) {
        
        
        // const redisValue = JSON.stringify(setData);
        // console.log("redis value",redisValue);
        
        redisClient.set(key, setData, function (err, reply) {
            console.log(reply);
           
        });
    }

}
module.exports = new RedisService();

