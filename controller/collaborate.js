// /*************************************************************************
//  * Execution        : 1. default node       cmd> nodemon model.js
//  * 
//  * Purpose          : Get the user values from the front end , validate them and redirecting to the services
//  *                    
//  *                     
//  *                    
//  * 
//  * @file            : collaborateContoller.js
//  * @author          : Bhoomi Rabara
//  * @version         : 1.0
//  * @since           : 14-10-2019
//  * 
//  **************************************************************************/

// const serviceObj=require('../service/collaborateService')
// const responseObj=require('../config/response')
// /**
//  * req : taken from user
//  * res : send by database
//  */
// class CollaborateController {
//     async collaborateController(req,res){
//         try{
//             req.checkBody('noteId', 'should not be empty').notEmpty()
//             let error = req.validationErrors();//returns validation errors
//             let response = {};//create response object
//             if (error) {
//                 /** make response array with it's field */
//                 response.suceess = false;
//                 response.error = error
//                 /** send response to server */
//                 res.status(400).send(response)
//             } else {
//                 /**parsing body data into node object */
//                 console.log("req.collaborate",req.body.collaborateId)
//                 let noteObj = {
//                     noteId: req.body.noteId,
//                     userId:req.token._id,
//                     collaborateId:req.body.collaborateId
//                 }
           
//             var initilaizeAsyncAwait = serviceObj.collaborateService(noteObj);
//             initilaizeAsyncAwait.then((data) =>{
//                        var statusCode=200;
//               responseObj.returnResponse(statusCode,data,res)
//         }).catch((err)=>{
//             var statusCode=422;
//             responseObj.returnResponse(statusCode,err,res)
//         })
//     }
//     }catch(e){
//         console.log("dfdvv");
        
//     }  
// }
// module.exports=new CollaborateController();