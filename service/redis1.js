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
require('dotenv').config();
// redis is a in memory cache which stores the data and we can directly fetch the data from redis
let redis=require('redis')
// let redisClient=require('../config/serviceConnection')
const logger=require('../logger/logger')
// connection to the redis
var redisClient = redis.createClient({ host: 'localhost', port: process.env.REDISPORT });
class RedisService {
    /**
     * @description: This API will get the data from redis using get method of redis
     * @param key: it is the value in which data is stored
     */
    getDataFromRedis(key) {
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err, reply) => {
                resolve(reply)
            });
        })
    }
    /**
     * @description: This API will set the data from redis using set method of redis
     * @param key: it is the value in which data is going to store
     * @param setData: it is 
     */
    setDataToRedis(setData, key) {
        const redisValue = JSON.stringify(setData);
        redisClient.set(key, redisValue, function (err, reply) {

        });
    }
    hsetToRedis(key,field,value){
       redisClient.hset(key,field, value, (err, reply) => {
            console.log("hset",reply);
       })
    }
    hgetFromRedis(key,field){
        return new Promise((resolve, reject) => {
        redisClient.hget(key,field,(err, reply) => {
            resolve(reply);
       });
    })
    }
 
}
module.exports = new RedisService();

