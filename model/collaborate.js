/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
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
const userschema = mongoose.Schema;//schema is class in mongoose framework
var redisServiceObj = require('../service/redis')

const logger = require('../logger/logger')
/** create schema with fields have type  */
let userSchemaData = new userschema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,

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
        //  unique:true
    }],
    collaborateIds: [{
        type: String
    }]

}, {
        timestamps: true
    });

/** register the schema */
let noteSchemaModel1 = mongoose.model("noteModel", userSchemaData, "noteModel");


class NoteModel {
   
    createAndSave(noteObj) {
        console.log("noteObj: ", noteObj);
        
        try {
            console.log("........sdfcdscdcdsc..........");

            //creating the object for the note details
            return new Promise((resovle, reject) => {
                console.log("........sdfcdscdcdsc..........");

                let noteDetails = new noteSchemaModel1({
                    "title": noteObj.title,
                    "description": noteObj.description,
                    "color": noteObj.color,
                    "label": noteObj.label ? noteObj.label : [],
                    "userId": noteObj.userId,
                    //"collaborateIds": noteObj.collaborateIds ? noteObj.collaborateIds : []
                });
                // save the entered note details
                // redisServiceObj.appendDataFromREdis(key,noteDetails)
                noteDetails.save().then((data) => {
                    console.log("noteDetails..." + noteDetails)
                    resovle(noteDetails)
                }).catch((err) => {
                    reject(err)
                })

            }).catch((err) => {
                reject(err)
            })
        } catch (err) {
            console.log(err);
        }
    }
    getAllNotes() {
        try {
            return new Promise(function (resovle, reject) {
                userSchemaModel1.find({})
                    .populate('label')
                    .then(
                        function (data) {
                            if (data) {
                                resovle(data)
                            }
                        }).catch(function (err) {
                            reject(err)
                        })
            })
        }
        catch (err) {
            console.log(err);
        }
    }


    find(noteObj) {
        console.log("noteObj: ", noteObj);

        return new Promise(function (resovle, reject) {
            //console.log("note obj",noteObj)
            // finding the user details using findOne method
            noteSchemaModel1.find(noteObj)
                //.populate('label')
                .then(function (data) {
                    // console.log("data...123..........",data)
                    if (data.length > 0) {
                        console.log('funDo Note exist')
                        resovle(data)
                    }
                    else {
                        console.log('funDo Note does not exist')
                        reject({ 'error': true, 'message': 'funDo Note does not exist' })
                    }

                }).catch(function (err) {
                    reject({ 'error': err, 'message': 'error in finding Note' })
                })
        })
    }
    update(query, updateQuery) {

        return new Promise(function (resovle, reject) {
            //updating the perticular user details using findOneAndUpdate method
            //  console.log("....",updateQuery,".......",query)
            noteSchemaModel1.findOneAndUpdate(query, updateQuery, { new: true })
                .then((data) => {
                    console.log("data 123", data)
                    resovle(data)
                }).catch((error) => {
                    reject({ 'error': error, 'message': 'error while updating' })
                })
        })
    }
    updateNote(query, updateQuery) {
        return new Promise(function (resovle, reject) {
            //updating the perticular user details using findOneAndUpdate method
            console.log(query, "....", updateQuery)
            noteSchemaModel1.updateMany(query, updateQuery)
                .then(function (data) {
                    resovle({ 'error': null, 'message': 'successfully updated' })
                }).catch(function (error) {
                    reject({ 'error': error, 'message': 'error while updating' })
                })
        })
    }
    deleteMany(query) {
        return new Promise(function (resovle, reject) {
            //updating the perticular user details using findOneAndUpdate method
            noteSchemaModel1.deleteMany(query)
                .then(function (data) {
                    resovle({ 'error': null, 'message': 'successfully deleted' })
                }).catch(function (error) {

                    reject({ 'error': error, 'message': 'error while deleting' })
                })
        })
    }
    deleteOne(query) {
        return new Promise(function (resovle, reject) {
            //updating the perticular user details using findOneAndUpdate method
            noteSchemaModel1.deleteOne(query)
                .then(function (data) {
                    resovle({ 'error': null, 'message': 'successfully deleted' })
                }).catch(function (error) {

                    reject({ 'error': error, 'message': 'error while deleting' })
                })
        })
    }
    
}


// module.exports = {

// }
module.exports =  new NoteModel();

