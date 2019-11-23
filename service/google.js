require('dotenv').config({ path: './.env' })
var googleStrategy=require('passport-google-oauth20')
//require to authenticate a requests
var passport=require('passport')
var googleModel = require('../model/oauth')
const jwtTokenGenretor = require('./tokenGenerator')
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });
passport.use('google',new googleStrategy
    ({
    callbackURL: 'http://localhost:4000/auth/google/callback',
    clientID: process.env.googleAppId,
    clientSecret: process.env.googleAppSecret,
  },(accessToken,refreshToken,profile,callback)=>{
    try {
      // console.log("profile",profile);
      // console.log("accessToken",accessToken);
      callback(null, profile)
  } catch (error) {
      callback(error, false, error.message);
  }
  })
)
class GoogleService {

  async googleService(googleProfileObj) {

        try {
          var googleIdObj = {
              "id": googleProfileObj.id
          }
          //console.log("googleIdObj",googleIdObj)
          // calling find method of a model to find whether the perticular user entry is exixst in database or not
          
          var findResult = await googleModel.find(googleIdObj);
        // console.log('length',findResult.length)
          if (findResult.length==0) {
              //console.log("bhoomi")
              //creating a object of a user details
              const newUser = {
                  id: googleProfileObj.id,
                  //email: facebookProfileObj.email,
                  first_name: googleProfileObj.first_name,
                  last_name: googleProfileObj.last_name,
                  email:googleProfileObj.email
              }
              //calling a createAndSave method of model to save the new user details
             // console.log("newUser",newUser)
              var saveResult = await googleModel.createAndSave(newUser)
                   console.log("saveresult",saveResult)
              let payload = {
                  _id: saveResult._id,
                  //email: saveResult.email
              }
              // calling token generator service
              let jwtToken = jwtTokenGenretor.generateToken(payload);
              
              redisClient.set(saveResult._id+"tokenId", jwtToken.token, function (err, reply) {
                console.log("error in redis:" + err);
                console.log("reply of redis:" + reply);
            });
              var response = {
                  _id: saveResult._id,
                 id: googleProfileObj.id,
                  //email: googleProfileObj.email,
                  first_name: googleProfileObj.first_name,
                  last_name: googleProfileObj.last_name,
                  email:googleProfileObj.email,
                  token: jwtToken.token
              }
              console.log("response".response)
              var query = { _id: saveResult._id }
              var updateQuery = { $set: { 'loginWithgoogle': true } }

              var updateResult = googleModel.update(query, updateQuery)
              return { 'error': null, 'data': response, 'status': true }

          }

         else{
          console.log("findResult",findResult[0]._id)
          let payload = {
              _id: findResult[0]._id,
              email: findResult[0].email
          }
          // calling token generator service
          let jwtToken = jwtTokenGenretor.generateToken(payload);
          console.log
          var response = {
              _id: findResult[0]._id,
              id: findResult[0].id,
              email: findResult[0].email,
              first_name: findResult[0].first_name,
              last_name: findResult[0].last_name,
              token: jwtToken.token
          }
              return { 'message': "user already exist", 'data': response, 'status': true }
          }
     
      }catch(err)
      {
        return {'error':err,'status':false}
      }
    }
  }
  module.exports=new GoogleService();