
module.exports = {
    mongoDb: {
      url: process.env.MONGODBURL
    },
    redis:{
       host: process.env.REDISHOST, 
       port: process.env.REDISPORT 
    },
    elasticSearch:{
      url:process.env.ELASTICSEARCHURL
    }
  }