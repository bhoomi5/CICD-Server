/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : Get the user values from the front end , validate them and redirecting to the services
 *                    
 *                     
 *                    
 * 
 * @file            : contoller.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/

const s3 = require('../config/s3');
const serviceObj=require('../service/user')
/**
 * req : taken from user
 * res : send by database
 */
class UserController {
    async registration(req, res) {
       // console.log("cndmcnm",req.body)
        try {
            req.checkBody('firstName', 'should not be empty').notEmpty();
            req.checkBody('firstName', 'should be alphabets').isAlpha();
            req.checkBody('firstName', 'firstName should be have length 3 ').isLength({ min: 3 })
            req.checkBody('firstName', 'firstName should be have max length 10').isLength({ max: 10 })

            req.checkBody('lastName', 'should not be empty').notEmpty();
            req.checkBody('lastName', 'should be alphabets').isAlpha();
            req.checkBody('lastName', 'lastName should be have length 3 ').isLength({ min: 3 })
            req.checkBody('lastName', 'lastName should be have max length 10').isLength({ max: 10 })

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email sould be valide').isEmail();
           // console.log("dbdnvcnvcvc",req.body.password)
            req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 })
            req.checkBody('password', 'password should be have max length 12').isLength({ max: 12 })

            req.checkBody('cnfPassword', 'cnfPassword should not be empty').notEmpty();

            //req.checkBody('email','email should be in a given format').matches("/^([A-Za-z0-9_\-.])+@([gmail])+\.([A-Za-z]{2,4})$/")
            req.assert('cnfPassword', 'Passwords do not match').equals(req.body.password);


            let error = req.validationErrors();//returns validation errors
        
            let response = {};//create response object

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.error = error
                /** send response to server */
                res.status(400).send(response)

            } else {
                /**parsing body data into node object */
                let userRegisterDataObject = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    cnfPassword: req.body.cnfPassword
                }
                /**call registration service and handle callback */
                var initilaizeAsyncAwait = serviceObj.registrationService(userRegisterDataObject);
                initilaizeAsyncAwait.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.content = data;
                    /** send response to server */
                    res.status(200).send(response)
                }, function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.error = err;
                    /** send response to server */
                    res.status(422).send(response)
                })
            }
        } catch (e) {
            console.log('Error occured ', e);
        }
    }
    async emailVerification(req, res) {
        try {
            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email sould be valide').isEmail();

           let error = req.validationErrors();//returns validation errors
            let response = {};//create response object

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.error = error
                /** send response to server */
                res.status(400).send(response)

            } else {
                /**parsing body data into node object */
                let emailVerificationDataObject = {
                    email: req.body.email
                }
                /**call registration service and handle callback */
                var initilaizeAsyncAwait = serviceObj.emailVerificationService(emailVerificationDataObject);
                initilaizeAsyncAwait.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.content = data;
                    /** send response to server */
                    res.status(200).send(response)
                }, function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.error = err;
                    /** send response to server */
                    res.status(422).send(response)
                })
            }
        } catch (e) {
            console.log('Error occured ', e);
        }
    }
    login(req, res) {
        try {

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email should be valid').isEmail();

            req.checkBody('password', 'password should not be empty').notEmpty();
            req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 })
            req.checkBody('password', 'password should be have max length 12').isLength({ max: 12 })

            let error = req.validationErrors();
            let response = {};

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.message = "Error occured in request at the time of validation"
                response.error = error
                /** send respose to server  */
                return res.status(400).send(response)

            } else {

                /** parsing body data into node object  */
                let userLoginDataObject = {
                    email: req.body.email,
                    password: req.body.password
                }

                /** 
                 * call service method and passs node object which have body data
                 * callback get ans from service in form of err and data
                 */
                var initilaizePromise = serviceObj.loginService(userLoginDataObject);
                initilaizePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "login successfully"
                    response.content = data;
                    /** send respose to server  */
                    return res.status(200).send(response)
                },function (err) {
                   /** make response array with it's field */
                   response.suceess = false;
                   response.message = "Error occured in request after processing request"
                   response.error = err
                   /** send respose to server  */
                   res.status(422).send(response)
               }).catch(function (err) {
                    /** make response array with it's field */
                    response.suceess = false;
                    response.message = "Error occured in request after processing request1"
                    response.error = err
                    /** send respose to server  */
                    res.status(422).send(response)
                })

            }
        } catch (e) {
            console.log(e);
            response.message = "Internal server error",
            response.error = e.message
            res.status(500).send(response)

        }
    }
    forgetPassword(req, res) {
        try {

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email should be valide').isEmail();

            let error = req.validationErrors();
            let response = {};
            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.message = "Error occured in request at the time of validation";
                response.error = error
                /** send respose to server  */
                return res.status(400).send(response)
            } else {
                /** parsing body data into node object  */
                console.log("req.body" + req.body.email)
                let userForgetPasswordDataObject = {
                    email: req.body.email
                }
                /** 
                 * call service method and passs node object which have body data
                 * callback get ans from service in form of err and data
                 */
               var initilaizePromise = serviceObj.forgetPasswordService(userForgetPasswordDataObject);
                initilaizePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "Email sending successfully for forget password"
                    response.content = data;
                    /** send respose to server  */
                    res.status(200).send(response)
                }, function (err) {

                    /** make response array with it's field */
                    response.success = false;
                    response.message = "Email sending failed for forget password"
                    response.error = err;
                    /** send respose to server  */
                    res.status(422).send(response)
                })

            }
        } catch (e) {
            console.log(e);

        }
    }
    resetPassword(req, res) {
        try {

          req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 })
            req.checkBody('password', 'password should be have max length 20').isLength({ max: 20 })
            let error = req.validationErrors();
            let response = {};

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.message = "Error occured in request after processing request";
                response.error = error
                /** send respose to server  */
                return res.status(400).send(response)

            } else {

                /** parsing body data into node object  */
              let userResetPasswordDataObject = {
                    password: req.body.password,
                    email:req.body.email
                  }

                /** 
                 * call service method and passs node object which have body data
                 * callback get ans from service in form of err and data
                 */
             let resetPasswordServicePromise = serviceObj.resetpasswordService(userResetPasswordDataObject);
                resetPasswordServicePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "reset Password done"
                    response.content = data;
                    /** send respose to server  */
                    res.status(200).send(response);
                }).catch(function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "reset Password not done"
                    response.error = err;
                    /** send respose to server  */
                    res.status(422).send(response);
                })
            }
        } catch (e) {

            console.log(e);

        }
    }
    async s3Controller(req,res)
    { 
        var token = req.header('token')
       // console.log("token"+token);
        //Pre-signed URLs are special URLs that give access to a file for a temporary period to anyone you share the URL with.
        let s3url = await s3.getSignedUrl('getObject', { Bucket: process.env.bucket, Key: req.file.originalname });
        var payload={
            '_id':req.token._id,
            'url':s3url
        }
        let response={};
                let resetPasswordServicePromise = serviceObj.s3Service(payload);
                resetPasswordServicePromise.then(function(data){
                     /** send respose to server on success  */
                    res.status(200).send(response);
                }).catch(function(err){
                    /** send respose to server  on failure*/
                    res.status(400).send(response);
                })
    }
    
// createNote(req,res){
    
// }

}
module.exports = new UserController();