/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : get the values from the controller and process them for the labels in fundo Notes
 *                    
 *                     
 *                    
 * 
 * @file            : service.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
var modelObj = require('../model/label')
var NoteserviceObj = require('./note')
var redisObj = require('./redis')
class LabelService {
    /**
     * @description service for registration api 
     * @param userRegisterDataObject : contain body data with node object format
     * @param promise : take response from model
     */
 createLabelService(labelObj) {
        try {
            //  console.log("mcjcjcnsjc")
            return new Promise((resovle, reject) => {
                // calling a method for finding an email of the user
                var createObj = {
                    label: labelObj.label,
                    userId: labelObj.userId
                }
               
                 modelObj.createAndSave(createObj)
                .then((data)=> {
                    let user = {
                        userId: labelObj.userId
                    }
                    this.getLabelService(user)
                    resovle({ 'error': null, 'message': 'label created successfully' })
                }).catch(function (err) {
                    reject({ 'error': false, 'message': 'error while creating labels' })
                })
            })
        } catch (err) {
            console.log("User already has Registered")
            reject({ 'error': false, 'message': 'error in label deatils' })

        }
    }
    getLabelService(labelObj) {
        try {
            var initializePromise = modelObj.find(labelObj);
            return new Promise((resovle, reject)=> {
                initializePromise.then((data)=> {
                    if (data) {
                        resovle(data)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        } catch (err) {
            console.log(err);
        }
    }
    async deleteLabelService(labelObj) {
        try {
            let labelObj1 = {
                _id: labelObj.labelId
            }
            let findLabel = await modelObj.find(labelObj1)
            let query = { _id: labelObj.labelId }
            let result = await modelObj.delete(query)
            let obj = {
                all: {},
                labelId: labelObj.labelId
            }
            var NoteserviceResult = await NoteserviceObj.deleteLabelFromNoteService(obj)

            return { 'status': true }
        } catch (err) {
            return err
        }
    }
    updateLabelService(labelObj) {
        try {

            return new Promise(function (resovle, reject) {
                // calling a method for finding an email of the user
                let obj = {
                    _id: labelObj.labelId
                }
                let findPromise = modelObj.find(obj)

                findPromise.then(function (data) {
                    if (data) {
                        // resovle({ 'error': null, 'message': 'funDo Note exist' })

                        var query = { '_id': labelObj.labelId }
                        var updateQuery = { $set: { 'label': labelObj.label } }
                        var updatePromise = modelObj.update(query, updateQuery);
                        updatePromise.then(function (data1) {
                            resovle({ 'error': null, 'data': data1 })
                        }).catch(function (error) {
                            reject({ 'error': error })
                        })
                    }
                    else {
                        reject({ 'error': error, 'message': 'funDo Note Label does not found' });
                    }
                }).catch((err) => {
                    reject({ 'error': err, 'message': 'funDo Note Label does not found' });
                })
            })
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new LabelService();