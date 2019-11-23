const mongoose =require('mongoose');
var redis = require('redis');
const es = require('elasticsearch');
var logger=require('../logger/logger')
module.exports={
    serviceConnections(env)
  {
         let configObj=require('../config/'+env)
         let mongoUrl=configObj.mongoDb.url;
         mongoConnection(mongoUrl);
         let redisHostName=configObj.redis.host;
         let redisPort=configObj.redis.port
         redisConnection(redisPort,redisHostName);
         let elasticUrl=configObj.elasticSearch.url
         elasticSearchConnection(elasticUrl)
  }
  }
function mongoConnection(dbURL){
    mongoose.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
        if (err) {
            logger.error("Connection failed because " + err);
        } else {
            logger.info("MongoDB database connection established successfully and is connected to the ",dbURL);
        }
    });
    mongoose.connection.on('disconnected', function(){
        logger.info("Mongoose default connection is disconnected");
        process.exit()
    });
}
function redisConnection(redisPort,redisHostName){
    var redisClient = redis.createClient(redisPort,redisHostName);
    redisClient.on('connected', ()=> {
        logger.info("Redis Client Is Connected ");
    }).on('error',(err)=> {
        logger.error("Redis Client Is Disconnected Due To Some Error " + err);
        process.exit()
    });
    exports.redisClient=redisClient;
    logger.info("Redis Client Is Connected ");
}
function elasticSearchConnection(elasticUrl){
    const esClient = new es.Client({
        host: elasticUrl,
        log: 'error' 
    });
    /**
    * @description:ping to cluster to check if everything is ok.
    *
    */ 
    esClient.ping({ requestTimeout: 30000 },(error) => {
        if (error) {
            logger.error('Elasticsearch cluster is down!',error);
        } else {
            logger.info('Elasticsearch cluster is up!');
        }
    });
}
function rabbitmqServer(){

}