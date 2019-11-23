const mongoose = require('mongoose');
const userschema = mongoose.Schema;//schema is class in mongoose framework

/** create schema with fields have type  */
let userSchemaData = new userschema({
    first_name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        
        },
    id:{
        default:false,
        type: String,
        required:true,
    },
    last_name:{
        type: String,
        required:true
    },
    loginWithFacebook:{
        default:false,
        type: String,
        required:true
    },
    loginWithgoogle:{
        default:false,
        type: String,
        required:true
    }
    
}, {
    timestamps: true
});

/** register the schema */
let userSchemaModel = mongoose.model("socialServices", userSchemaData);
class facebookModel{
    
    find(findObj){
        return new Promise(function(resovle,reject){
           userSchemaModel.find(findObj).then(function(data){
              
            if(data.length > 0)
                    {

                console.log('user already exist', data)
                resovle(data)
            }
            else{
                console.log('User does not exist',data)
                resovle(data)  
            }

           }).catch(function(err){
            reject({'error':err,'message':'error in finding email'})
           })
        })
    }
    async createAndSave(userdetails){
        try{
                    return new Promise(function(resovle,reject){
                        let userdetail = new userSchemaModel({
                            "id":userdetails.id,
                            "email":userdetails.email,
                            "first_name": userdetails.first_name,
                            "last_name":userdetails.last_name,
                            "email":userdetails.email
                          
                        });
                        console.log(userdetail)
                        userdetail.save().then(function(data){
                         console.log("sdf")
                          resovle(data)
                      }).catch((err)=>{
                          console.log("asdf",err)
                              reject(err);
                      })
                    }) }catch(err)
            {
                console.log(err);
            }
            }
            update(query,updateQuery){
                return new Promise(function(resovle,reject){
                    //updating the perticular user details using findOneAndUpdate method
                  console.log(query,"....",updateQuery)
                    userSchemaModel.findOneAndUpdate(query,updateQuery)
                    .then(function(data){
                        //console.log(" new pass.......",updateQuery.password)
                       
                        resovle({'error':null,'message':'successfully updated','data':data})
                    }).catch(function(error){
                       
                        reject({'error':error,'message':'error while updating'})
                    })
                })
            }
    }
module.exports=new facebookModel();