/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : 
 *                    
 * @file            : service.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
//const model = require('../model/userModel')
const bcrypt = require('bcrypt');
const forgetMail = require('./nodeMailer')
const jwtTokenGenretor = require('./tokenGenerator')
const modelObj = require('../model/user')
const redisObj = require('../service/redis1')
const logger = require('../logger/logger')
const ejs=require('ejs')
const path=require('path')
// require('./producerMessageQueue')
const event=require('events')
const emmiter=new event.EventEmitter()

// console.log(":path",path.join(__dirname));


// password encryption Method
function encryptPassword(password, callback) {
    bcrypt.hash(password, 10, (err, data) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, data)
        }
    })
}

class userService {
    /**
     * @description service for registration api 
     * @param userRegisterDataObject : contain body data with node object format
     * @param promise : take response from model
     */
    async registrationService(userRegisterDataObject) {
        try {
            var obj = {
                "email": userRegisterDataObject.email
            }
            return new Promise((resovle, reject) => {
                // calling a method for finding an email of the user
                var initializePromise = modelObj.find(obj)
                initializePromise.then((data)=> {
                    reject({ 'error': false, 'message': 'User already has Registered' })
                }).catch((err)=> {
                   // console.log("err", err)
                    // password encryption method
                    encryptPassword(userRegisterDataObject.password, (err, encryptedPassword) => {
                        if (err) {
                            reject({ 'error': err });
                        }
                        else {
                            let userRegistrationdetails = {
                                "firstName": userRegisterDataObject.firstName,
                                "lastName": userRegisterDataObject.lastName,
                                "email": userRegisterDataObject.email,
                                "password": encryptedPassword,
                                "cnfPassword": userRegisterDataObject.cnfPassword,

                            };
                            // saving user deatils while regestration

                            var saveUserAwait = modelObj.createAndSave(userRegistrationdetails);
                            saveUserAwait.then((data)=> {
                                console.log("Registration Successfully Done")
                                
                                let template=ejs.renderFile(path.join(__dirname,'../view/template1.ejs'),{name:userRegisterDataObject.firstName})
                                 template.then((ejsTemplate)=>{
                                let emailObj={
                                              email:userRegisterDataObject.email,
                                              html:ejsTemplate
                                          }
                             emmiter.emit('produceEvent',emailObj)
                            })
                            resovle({ 'error': null, 'data': data })
                            }).catch(function (error) {
                                reject({ 'error': error })
                            })

                        }
                    })

                })
            })
        } catch (err) {
            console.log("User already has Registered")
            reject({ 'error': false, 'message': 'User already has Registered' })

        }
    }
    /**
 * @description service for emailVerification api 
 * @param emailVerificationDataObject : contain body data with node object format
 * @param promise : take response from model
 */
    async emailVerificationService(emailVerificationDataObject) {
        try {
            return new Promise((resovle, reject) => {
                let payload = {
                    // '_id': registerdata[0]._id,
                    'email': emailVerificationDataObject.email
                }
                // calling token generator service
                let jwtToken = jwtTokenGenretor.generateToken(payload);
                let url = "http://localhost:4000/login/" + jwtToken.token

              let template=ejs.renderFile(path.join(__dirname,'../view/template1.ejs'),{name:emailVerificationDataObject.email,url:url})
              template.then((ejsTemplate)=>{
                forgetMail.nodemailSender(emailVerificationDataObject,ejsTemplate, (err, data) => {
                    if (err) {
                        reject({ 'error': err });
                    } else {
                        // updating isVerified field in dataBase
                        var query = { 'email': emailVerificationDataObject.email }
                        var updateQuery = { $set: { 'isVerified': true } }
                        var initializePromise = modelObj.update(query, updateQuery)
                        initializePromise.then((data)=> {
                            logger.info("Email Verification Link Has Sent Successfully")
                            resovle({ 'error': null, 'message': 'email has verified', 'token': jwtToken, 'url': url })

                        }).catch(function (err) {
                            logger.info("Email Verification failed")
                            reject({ 'error': err })
                        })
                    }
                })
              }).catch((err)=>{
                  logger.error(err)
              })
            })
        } catch (err) {
            console.log("error",err)
        }
    }
    /**
    * @description service for login api 
    * @param userLoginDataObject : contain body data with node object format
    * @param promise : take response from model
    */
    loginService(userLoginDataObject) {
        try {
            return new Promise(function (resolve, reject) {
                var findObj = {
                    "email": userLoginDataObject.email
                }
                // calling a method for finding an email of the user
                return modelObj.find(findObj)
                    .then(function (logInData) {
                        //password comparision for login service
                        console.log("logInData",logInData);
                        let payload = {
                            '_id': logInData._id,
                            'email': logInData.email
                        }
                       
                        let jwtToken = jwtTokenGenretor.generateToken(payload);
                        let key=logInData._id
                        let field=process.env.TOKEN
                        let value=jwtToken.token                               
                        redisObj.hsetToRedis(key,field,value);
                       // redisObj.hgetFromRedis(key,field)
                        bcrypt.compare(userLoginDataObject.password, logInData.password, (err, data) => {
                            if (err) {
                                reject({ 'error': err });
                                logger.info('bycrypt==>error');
                            } else {
                                if (data) {
                                    logger.info('data result :' + data)
                                    let response = {
                                        '_id': logInData._id,
                                        'firstName': logInData.firstName,
                                        'lastName': logInData.lastName,
                                        'email': logInData.email,
                                        //'token': jwtToken.token
                                    }
                                    logger.info('login successfully...');
                                    resolve({ 'data': response ,'token':jwtToken.token});
                                } else {
                                    logger.info('bycryp return false', data);
                                    reject({ 'error': true, 'message': 'does not match credentials' });
                                    // return { 'error': true ,'message':'does not match credentials'};
                                }
                            }
                        })
                    })
                    .catch(function (error) {
                        reject({ 'error': error, 'message': 'user does not found' });
                    })
            })
        } catch (error) {
            logger.info(error);
            reject(error);
        }
    }
    /**
        * @description service for forgetPassword api 
        * @param userForgetPasswordDataObject : contain body data with node object format
        * @param promise : take response from model
        */
    forgetPasswordService(userForgetPasswordDataObject) {
        try {
            return new Promise(function (resovle, reject) {
                // calling a method for finding an email of the user
                var initializePromise = modelObj.find(userForgetPasswordDataObject);
                initializePromise.then(function (data) {
                    logger.info("Your credential matched");
                    let payload = {
                        //'_id': data[0]._id,
                        'email': data.email
                    }
                   
                            let jwtToken = jwtTokenGenretor.generateToken(payload);
                            let url = "http://localhost:4000/resetPassword/" + jwtToken.token
                            // calling email sending service
                            forgetMail.nodemailSender(userForgetPasswordDataObject, url, jwtToken.token, (err, data) => {
                                if (err) {
                                    reject({ 'error': err });
                                } else {
                                    logger.info("link sent successfully:")
                                    resovle({ 'error': null, 'data': data, 'token': jwtToken, 'url': url })
                                }
                            })
                }).catch(function (error) {
                    logger.info("Your credential not matched");
                    reject({ 'error': error, 'message': 'Your credential not matched' });
                })
            })
        } catch (err) {
            logger.info(err);
        }
    }
    /**
    * @description service for resetpassword api 
    * @param resetpasswordDataObject : contain body data with node object format
    * @param promise : take response from model
    */
    resetpasswordService(resetpasswordDataObject) {
        return new Promise(function (resovle, reject) {
            encryptPassword(resetpasswordDataObject.password, (err, hashPassword) => {
                if (err) {
                    reject({ 'error': err, 'message': 'error while encrypting password' });
                } else {

                    //// updating the password field in the dataBase
                    
                            var query = { 'email': resetpasswordDataObject.email }
                            var updateQuery = { $set: { 'password': hashPassword } }
                            let updatePasswordPromise = modelObj.update(query, updateQuery);
                            updatePasswordPromise.then(function (data) {
        
                                logger.info("successfully updated password")
                                resovle({ 'error': null, 'message': 'successfully updated password' });
                            }).catch(function (error) {
                                reject({ 'error': error, 'message': 'error in updateing password' });
                            })
                }
            })
        })
    }
    /**
    * @description service for s3 api 
    * @param payload : contain body data with node object format
    * @param promise : take response from model
    */
    s3Service(payload) {
        console.log("id" + payload._id)
        var id = {
            '_id': payload._id
        }
        return new Promise((resovle, reject) => {
            // calling a method for finding an Id of the user
            var findPasswordPromise = modelObj.find(id);
            findPasswordPromise.then(function (data) {
                // updating the imageUrl field in the dataBase
                var query = { '_id': payload._id }
                var updateQuery = { $set: { 'imageUrl': payload.url } }
                var updatePasswordPromise = modelObj.update(query, updateQuery);
                updatePasswordPromise.then(function (data) {
                    resovle({ 'error': null, 'message': 'successfully updated ImageUrl' });
                }).catch(function (err) {
                    //console.log("1" + err)
                    reject(err);
                })
            }).catch(function (err) {
                // console.log("3" + err)
                reject(err);
            })
        })
    }

}
module.exports = new userService(); 
module.exports.em = emmiter;

