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
 * @since           : 14-10-2019
 * 
 **************************************************************************/

const serviceObj=require('../service/label')
/**
 * req : taken from user
 * res : send by database
 */
class LabelController {
    createLabel(req, res) {
            try {
                
               req.checkBody('label', 'should not be empty').notEmpty()
                
                
                let error = req.validationErrors();//returns validation errors
            
                let response = {};//create response object
                  console.log("req......",req.token);
                  
                if (error) {
                    /** make response array with it's field */
                    response.suceess = false;
                    response.error = error
                    /** send response to server */
                    res.status(400).send(response)
    
                } else {
                    /**parsing body data into node object */
                    let labelObj = {
                        label: req.body.label,
                        userId:req.token._id
                    }
                    /**call registration service and handle callback */
                
                    var initilaizeAsyncAwait = serviceObj.createLabelService(labelObj);
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
            response.message = "Internal server error",
            response.error = e.message
            res.status(500).send(response)
            
        }
    }
    readLabel(req,res){
        
            try {
                
               // req.checkBody('label', 'should not be empty').notEmpty()
                 
                 
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
                     let labelObj = {
                        // label: req.body.label,
                         userId:req.token._id
                     }
       // var response={};
        var initilaizePromise=serviceObj.getLabelService(labelObj);
        initilaizePromise.then(function(data){
               /** make response array with it's field */
               response.success = true;
               response.message="label retrival process done"
               response.content = data;
               console.log("res:"+response.content)
               /** send respose to server  */
               res.status(200).send(response)

            }),function(err){
               
                 /** make response array with it's field */
                 response.success = false;
                 response.message="label retrival process is not done"
                 response.error = err;
                 /** send respose to server  */
                 res.status(422).send(response)
                }
    
            } 
        }catch(e){
        console.log(e);
        }
    
    }
                updateLabel(req,res){
                    try{
                    req.checkBody('label', 'should not be empty').notEmpty();
                    req.checkBody('labelId','should not be empty').notEmpty();
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
                    let labelObj = {
                        label: req.body.label,
                        labelId: req.body.labelId
                    }
            var initilaizePromise=serviceObj.updateLabelService(labelObj);
            initilaizePromise.then(function(data){
                   /** make response array with it's field */
                   response.success = true;
                   response.message="note updation process done successfully"
                   response.content = data;
                   console.log("res:"+response.content)
                   /** send respose to server  */
                   res.status(200).send(response)
    
                }),function(err){
                   
                     /** make response array with it's field */
                     response.success = false;
                     response.message="note updation process is not done successfully"
                     response.error = err;
                     /** send respose to server  */
                     res.status(422).send(response)
                    }
        
              }  }catch(e){
                    console.log(e);
                    }
                }
                async deleteLabel(req,res)
                {
                    try{
                       // req.checkBody('_id', 'should not be empty').notEmpty();
                        req.checkBody('labelId','should not be empty').notEmpty();
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
                                let labelObj = {
                                    labelId:req.body.labelId,
                                    userId:req.token._id
                                }
                               // console.log("label id",labelObj.labelId)
                        var result=await serviceObj.deleteLabelService(labelObj);
                       if(result.status){
                               /** make response array with it's field */
                               response.success = true;
                               response.message="deleting label done successfully"
                               response.content = result;
                               console.log("res:"+response.content)
                               /** send respose to server  */
                               res.status(200).send(response)
                
                            }
                               else {
                                 /** make response array with it's field */
                                 response.success = false;
                                 response.message="deleting label is not done successfully"
                               //  response.error = ;
                                 /** send respose to server  */
                                 res.status(422).send(response)
                                }
                    
                          }  }catch(e){
                                console.log(e);
                                }
                            
                }
            }
module.exports = new LabelController();