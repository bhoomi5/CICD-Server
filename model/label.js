/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : Get the user values from the service and manipulating the values
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
const mongoose = require('mongoose');
const userschema = mongoose.Schema;//schema is class in mongoose framework
const redisServiceObj=require('../service/redis1')
/** create schema with fields have type  */
let userSchemaData = new userschema({
    label:{
        type: String,
        required:true
        
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
}, {
    timestamps: true
});

/** register the schema */
let userSchemaModel2 = mongoose.model("labelModel", userSchemaData);
class NoteModel{
    async createAndSave(labelObj){
        try{
         
            //creating the object for the note details
           
                    let labelDetails = new userSchemaModel2({
                        "label": labelObj.label,
                        "userId":labelObj.userId
                        
                    });
                    // save the entered note details
                    var key=labelObj.userId+"getAllLabels"
                    console.log("key",key)
                  // redisServiceObj.deleteDataFromREdis(key)
                 //redisServiceObj.appendDataFromREdis(key,labelDetails)
                 
                  if(labelDetails.save()){
                        console.log("labelDetails..."+labelDetails)
                        return labelDetails;
                   }
            
            }catch(err)
            {
                console.log(err);
            }
        }
                find(labelObj){
                    
                    return new Promise(function(resovle,reject){
                        console.log("label",labelObj);
                        // finding the user details using findOne method
                        userSchemaModel2.find(labelObj).then(function(data){
                        if(data.length>0)
                                {
                                    
                var key=data[0].userId+"getAllLabels"
                     redisServiceObj.setDataToRedis(data,key)
                            console.log('funDo Note Label exist')
                            resovle(data)
                        }
                        else{
                            console.log('funDo Note Label does not exist')
                            reject({'error':true,'message':'funDo Note Label does not exist'})  
                        }
            
                       }).catch(function(err){
                        reject({'error':err,'message':'error in finding Note'})
                       })
                    })
                }
                update(query,updateQuery){
                    return new Promise(function(resovle,reject){
                        //updating the perticular user details using findOneAndUpdate method
                        userSchemaModel2.findOneAndUpdate(query,updateQuery)
                        .then(function(data){
                            resovle({'error':null,'message':'successfully updated'})
                        }).catch(function(error){
                            reject({'error':error,'message':'error while updating'})
                        })
                    })
                }
                delete(query){
                    return new Promise(function(resovle,reject){
                        //updating the perticular user details using findOneAndUpdate method
                        var result=userSchemaModel2.deleteOne(query)
                        result.then(function(data){
                            resovle({'error':null,'message':'successfully deleted'})
                        }).catch(function(error){
                            reject({'error':error,'message':'error while deleting'})
                        })
                    })
                }
            }
module.exports=new NoteModel();