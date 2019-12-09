const mongoose = require('mongoose');

const userschema = mongoose.Schema;//schema is class in mongoose framework

/** create schema with fields have type  */
var validateEmail = function(email) {
    var re = /^([A-Za-z0-9_\-.])+@([gmail])+\.([A-Za-z]{2,4})$/;
    return re.test(email)
};
var min = [3, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var max = [10, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'];
let userSchemaData = new userschema({
    firstName: {
        type: String, 
        min: min, 
        max: max,
        validator: 'isAlphanumeric',
        required: [true, 'Empty firstName are not allowed'],  
    },
    lastName: {
        type: String, 
        min: min, 
        max: max,
        validator: 'isAlphanumeric',
        required: [true, 'Empty lastName are not allowed'],
    },
    email: {
        // type: String,
        // required:true,
        // unique:true
        // hello
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
  },
    password: {
        type: String,
        required: [true, 'Empty password are not allowed'],
        min: 6, 
        max: 12,
    },
     isVerified:{
        type:Boolean,
        default:false
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true
});

/** register the schema */
let userSchemaModel = mongoose.model("socialservices", userSchemaData);
class userModel{
    find(findObj){
        return new Promise(function(resovle,reject){
            userSchemaModel.findOne(findObj).then(function(data){
            if(data)
                    {
                console.log('user already exist')
                resovle(data)
            }
            else{
                //  console.log('User does not exist')
                reject({'error':true,'message':'user does not exist'})  
            }

           }).catch(function(err){
            reject({'error':err,'message':'error in finding email'})
           })
        })
    }
   
    async createAndSave(userRegistrationdetails){
        try{
            //creating the object for the user details
                    let userRegistrationdetail = new userSchemaModel({
                        "firstName": userRegistrationdetails.firstName,
                        "lastName":userRegistrationdetails.lastName,
                        "email": userRegistrationdetails.email,
                        "password": userRegistrationdetails.password
                    });
                    // save the entered user details
                  return userRegistrationdetail.save(userRegistrationdetail)
                        
            }catch(err)
            {
                console.log(err);
            }
            }
            update(query,updateQuery){
                try{
                return  userSchemaModel.findOneAndUpdate(query,updateQuery)
                }catch(err){
                    logger.info(err)
                }
            }
}
module.exports=new userModel();