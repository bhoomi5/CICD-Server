/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 * 
 * Purpose          : Get the user values from the service and manipulating the values
 *                    
 * @file            : noteModel.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 14-10-2019
 * 
 **************************************************************************/
const mongoose = require('mongoose');
const NoteSchema = mongoose.Schema;//schema is class in mongoose framework

const logger = require('../logger/logger')
/** create schema with fields have type  */
var validateEmail = function(collaborateIds) {
    var re = /^([A-Za-z0-9_\-.])+@([gmail])+\.([A-Za-z]{2,4})$/;
    return re.test(email)
};
let note = new NoteSchema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        match: [/^([A-Za-z0-9_\-.])+@([gmail|yahoo])+\.([A-Za-z]{2,4})$/, 'Please fill a valid email address']
         //  unique:true
        },
    title: {
        type: String,
        required: [true, 'Empty title is not allowed'],  
    },
    description: {
        type: String,
    },
    color: {
        type: String
    },
    isPined: {
        type: Boolean,
        default: false
    },
    isArchieved: {
        type: Boolean,
        default: false
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    isReminder: {
        type: Boolean,
        default: false
    },
    label: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labelModel',
       
    }],
    collaborateIds: [{
        type: String,
        validate: [validateEmail, 'Please fill a valid email address']
        }],
    reminder: {
        type: String,
       // match: [/^([A-Za-z])+\ d{1,2}\, d{4}\ d{2}\:d{2}\:d{2}$/, 'Please fill a Date in a valid form']
    },
    elasticId:{
        type: String
    }

}, { timestamps: true},
   { strict:true}
);

/** register the schema */
let noteCollection = mongoose.model("noteCollections", note, "noteCollections");

class NoteModel {
    /**
      * @description: creating and saving the note details
      * @param noteObj : contain body data with node object format
      */
    createAndSave(noteObj,searchObj) {
        try {
            // creating the object for the note details
            
                let noteDetails = new noteCollection({
                    "title": noteObj.title,
                    "description": noteObj.description,
                    "color": noteObj.color,
                    "label": noteObj.label ? noteObj.label : [],
                    "userId": noteObj.userId,
                    "collaborateIds": noteObj.collaborateIds ? noteObj.collaborateIds : [],
                    "reminder":noteObj.reminder,
                    "isReminder":noteObj.isReminder,
                    "elasticId":searchObj.searchId
             });
                return noteDetails.save()
        } catch (err) {
            logger.info(err);
        }
    }
//------------------------------------------------------------------------------------------------------------------------------
  /**
      * @description: find method of mongoose 
      * @param noteObj : contain noteId with node object.
      */
    find(noteObj) {
        // finding the user details using findOne method
        try{
        return noteCollection.find(noteObj)
        }catch(err){
            logger.info(err)
        }
}
//------------------------------------------------------------------------------------------------------------------------------
  /**
      * @description: find method of mongoose 
      * @param noteObj : contain noteId with node object.
      * @param labelName: contain label value
      */
     findPopulate(noteObj,labelName,callback) {
            try{
            return noteCollection.find(noteObj).populate({path:'label',match:{'label':labelName.search}})}catch(err){
                logger.info(err)
            }
    }
//----------------------------------------------------------------------------------------------------------------------------------
      /**
      * @description: find method of mongoose 
      * @param userId : contain userId with node object.
      * @param pageQuery: contain page no. and one page sixe
      */
    findPage(userId,{},pageQuery) {
        try{    
        return noteCollection.find(userId,{},pageQuery)
        }catch(err){
            logger.info(err)
        }
}
//-------------------------------------------------------------------------------------------------------------------------------------
    update(query, updateQuery) {
             try{
            return noteCollection.findOneAndUpdate(query, updateQuery, { new: true })
             }catch(err){
                 logger.info(err)
             }
    }
//------------------------------------------------------------------------------------------------------------------------------
      /**
      * @description: updateMany method of mongoose 
      * @param query : contain noteId with node object.
      * @param updateQuery: contain the value which is going to update
      */
    updateNote(query, updateQuery) {
        try{
            return noteCollection.updateMany(query, updateQuery)
        }catch(err){
            logger.info(err)
                }
    }
//------------------------------------------------------------------------------------------------------------------------------
      /**
      * @description: deleteMany method of mongoose. 
      * @param userIdObj : contain userId with node object.
      */
    deleteMany(userIdObj) {
        try{
            //updating the perticular user details using findOneAndUpdate method
            return noteCollection.deleteMany(userIdObj)
        }catch(err){
            logger.info(err)
        }
    }
//------------------------------------------------------------------------------------------------------------------------------
      /**
      * @description: deleteOne method of mongoose 
      * @param noteIdObj : contain noteId with node object.
      */
    deleteOne(noteIdObj) {
        try{
            //updating the perticular user details using findOneAndUpdate method
            return noteCollection.findByIdAndDelete(noteIdObj)
        }catch(err){
            logger.info(err)
        }
    }
   
}
module.exports = new NoteModel();

