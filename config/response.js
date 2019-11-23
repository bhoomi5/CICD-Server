
class response{
    returnResponse(statusCode,controllerResponse,res){
        let response = {};
       
       if(controllerResponse.status==true){

        /** make response array with it's field */
        response.success = controllerResponse.status;
        response.message=controllerResponse.message;
        response.content = controllerResponse.data;
        /** send response to server */
        res.status(statusCode).send(response)
   }
     else if(controllerResponse.status==false){
     /** send response to server */
       response.success = controllerResponse.status;
       response.message=controllerResponse.message;
       res.status(statusCode).send(response)
   }  
  
}
}
module.exports=new response();