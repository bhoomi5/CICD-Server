
require('dotenv').config({ path: './.env' })
var redis = require('redis');
var redisClient = redis.createClient({ host: 'localhost', port: 6379 });
//Passport strategy for authenticating with Facebook access tokens using the OAuth 2.0 API.
var OAuth2Strategy = require('passport-facebook-token')

//require to authenticate a requests
var passport = require('passport')

//require model file to call a CRUD operations
var facebookModel = require('../model/oauth')
const jwtTokenGenretor = require('./tokenGenerator')
//Before authenticating requests, the strategy (or strategies) used by an application must be configured.
passport.use('fbToken', new OAuth2Strategy({
    clientID: process.env.AppId,
    clientSecret: process.env.AppSecret,
},
    //information about the facebook profile of perticular user
    function (accessToken, refreshToken, profile, callback) {
        try {
            // console.log("profile",profile);
            // console.log("accessToken",accessToken);
           return callback(null, profile)
        } catch (error) {
           return callback(error, false, error.message);
        }
    }
));

class FacebookService {

    async facebookService(facebookProfileObj) {
        try {
            var facebookIdObj = {
                "id": facebookProfileObj.id
            }

            // calling find method of a model to find whether the perticular user entry is exixst in database or not
            
            var findResult = await facebookModel.find(facebookIdObj);
           
            if (findResult.length==0) {
                //console.log("bhoomi")
                //creating a object of a user details
                const newUser = {
                    id: facebookProfileObj.id,
                   email: facebookProfileObj.email,
                    first_name: facebookProfileObj.first_name,
                    last_name: facebookProfileObj.last_name
                }
                //calling a createAndSave method of model to save the new user details
                var saveResult = await facebookModel.createAndSave(newUser)

                let payload = {
                    _id: saveResult._id,
                    email: saveResult.email
                }
                // calling token generator service
                let jwtToken = jwtTokenGenretor.generateToken(payload);
                redisClient.set(saveResult._id+"tokenId", jwtToken.token, function (err, reply) {
                    console.log("error in redis:" + err);
                    console.log("reply of redis:" + reply);
                });
                var response = {
                    _id: saveResult._id,
                    id: facebookProfileObj.id,
                   email: facebookProfileObj.email,
                    first_name: facebookProfileObj.first_name,
                    last_name: facebookProfileObj.last_name,
                    token: jwtToken.token
                }
                var query = { _id: saveResult._id }
                var updateQuery = { $set: { 'loginWithFacebook': true } }

                var updateResult = facebookModel.update(query, updateQuery)
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
        } catch (err) {
            console.log("\n\n\tError in facebook service ",err);
            
            return { 'error': err, 'status': false }
        }
    }
   
}
module.exports = new FacebookService();