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
 * @since           : 09-10-2019
 * 
 **************************************************************************/


const serviceObj=require('../service/facebbok')
const googleServiceObj=require('../service/google')
//var passport=require('../service/facebbokService')
/**
 * req : taken from user
 * res : send by database
 */
var facebookModel=require('../model/oauth')
require('../service/facebbok')
class FacebbokController {
      
        async facebookOAuth(req,res){ 
                try{
                      
                let response={}
                let facebookProfileObj = {
                        id:req.user.id,
                        email:req.user.emails[0].value,
                        first_name:req.user.name.givenName,
                        last_name:req.user.name.familyName
                    }
                   
                            var result=await serviceObj.facebookService(facebookProfileObj);
                            console.log(result.status)
                           if(result.status){
                                   /** make response array with it's field */
                                   response.success = true;
                                   response.message="successfully login with facebook"
                                   response.content = result;
                                   console.log("res:"+response.content)
                                   /** send respose to server  */
                                   res.status(200).send(response)
                    
                                }
                                   else {
                                     /** make response array with it's field */
                                     response.success = false;
                                     response.message="login with facebook not done successfully"
                                   //  response.error = ;
                                     /** send respose to server  */
                                     res.status(422).send(response)
                                    }
                        
                              }catch(e){
                                    console.log(e);
                                    }
                                }
          async googleOAuth(req,res){
                                        try{
                                              console.log("cbvcdb",req)
                                           let response={}
                                           let googleProfileObj = {
                                                   id:req.user.id,
                                                 //  email:null,
                                                   first_name:req.user.name.givenName,
                                                   last_name:req.user.name.familyName,
                                                   email:req.user._json.email
                                               }
                                            
                                                       var result=await googleServiceObj.googleService(googleProfileObj);
                                                       console.log(result.status)
                                                      if(result.status){
                                                              /** make response array with it's field */
                                                              response.success = true;
                                                              response.message="successfully login with google"
                                                              response.content = result;
                                                              console.log("res:"+response.content)
                                                              /** send respose to server  */
                                                              res.status(200).send(response)
                                               
                                                           }
                                                              else {
                                                                /** make response array with it's field */
                                                                response.success = false;
                                                                response.message="login with google not done successfully"
                                                              //  response.error = ;
                                                                /** send respose to server  */
                                                                res.status(422).send(response)
                                                               }
                                                   
                                                         }catch(e){
                                                               console.log(e);
                                                               }     
                                }
                        }
module.exports = new FacebbokController();   