/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 * 
 * Purpose          : Main file at server side. doing databse connection and redis connection 
 * @file            : server.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
require('dotenv').config();
require('./config/serviceConnection');

require('./service/google')
let connectionObj=require('./config/serviceConnection')
//require('./service/notification')
const express                 = require("express");
const expressValidator        =require('express-validator')
const bodyParser              = require("body-parser");
const app                     = express();
const config                  = require('./config/local');
const route                   = require('./route/route')
// const passport                  =require('passport')
const logger                  =require('./logger/logger')
const swaggerUi               = require("swagger-ui-express");
const swaggerDocument         = require('../swagger/swagger.json');
// require('./service/consumerMessageService').sendEmail()


var env = "development";
connectionObj.serviceConnections(env);

// app.use(passport.initialize());
// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
// passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });
app.use(bodyParser.json());
app.use(expressValidator());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', route);
app.listen(4000, ()=> {
    console.log("Server is running on Port: " + 4000);
    console.log("   ")
console.log("   ")
});
app.use(function(err,req,res,next) {
  console.log("check for request body json");
  logger.error(err.stack);
  res.status(400).send({"Error" : "Unexpected string in JSON!"});
});
module.exports=app

  