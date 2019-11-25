
module.exports = {
    mongoDb: {
      //url: process.env.MONGODBURL || 
      url: 'mongodb://127.0.0.1:27017/funDoNotes'
    },
    redis:{
      // host: process.env.REDISHOST, 
       //port: process.env.REDISPORT 
    },
    elasticSearch:{
      //url:process.env.ELASTICSEARCHURL
    }
  }