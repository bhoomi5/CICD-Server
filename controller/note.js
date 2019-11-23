/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 * 
 * Purpose          : Get the user values from the front end , validate them and redirecting to the services
 *                    
 * @file            : noteContoller.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 14-10-2019
 * 
 **************************************************************************/

const serviceObj = require('../service/note')
const responseObj = require('../config/response')
const userModelObj=require('../model/user')
const logger=require('../logger/logger')
/**
 * req : taken from user
 * res : send by database
 */
class NoteController {
    /**
    * @description controller for fundo Note listing api which will validate the req body and than pass it to the lising service
    * @param req : contain body data with node object format
    * @param res: return the response to the client
    */
    async getListController(req, res) {
        try {
            
            let redisKey = Object.keys(req.query)[0];
            let list
            (Object.keys(req.query)[0] == "isTrash") ? list = { 'userId': req.token._id, 'isTrash': true } :
                (Object.keys(req.query)[0] == "isArchieved") ? list = { 'userId': req.token._id, 'isArchieved': true } :
                    (Object.keys(req.query)[0] == "isReminder") ? list = { 'userId': req.token._id, 'isReminder': true } : new error("undefined Request")
            var response = {};
            if (list != undefined) {
                serviceObj.getListService(list, redisKey)
                    .then((data) => {
                        let statusCode = 200;
                        responseObj.returnResponse(statusCode, data, res)
                    })
                    .catch((err) => {
                        let statusCode = 422;
                        responseObj.returnResponse(statusCode, err, res)
                    })
            }
            else {
                throw "Undefined request"
            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------
    createNote(req, res) {
        try {
            console.log("serviceObj: ", serviceObj);
            
            req.checkBody('title', 'should not be empty').notEmpty()
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
                
                let noteObj = {
                    title: req.body.title,
                    description: req.body.description,
                    color: req.body.color,
                    userId:req.token._id,
                    reminder:req.body.reminder,
                    isReminder:req.body.isReminder
                }
                                
                let collaborateObj={
                    collaborateIds:req.body.collaborateIds
                }
                /**call registration service and handle callback */
              
                var initilaizeAsyncAwait = serviceObj.createNoteService(noteObj,collaborateObj);
                initilaizeAsyncAwait.then(function (data) {
                           var statusCode=200;
                  responseObj.returnResponse(statusCode,data,res)
            }).catch((err)=>{
                var statusCode=422;
                responseObj.returnResponse(statusCode,err,res)
            })
        }
    } catch (e) {
        console.log('Error occured ', e);
        response.message = "Internal server error",
        response.error = e.message
        res.status(500).send(response)
    }
}
    // -----------------------------------------------------------------------------------------------------------------------
    readNote(req, res) {
        try {
            // req.checkBody('userId', 'should not be empty').notEmpty()
            //     req.checkBody('description', 'should not be empty').notEmpty()

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
                let noteObj = {
                    userId: req.token._id
                }
                //var response={};
                var initilaizePromise = serviceObj.getNotesService(noteObj);
                initilaizePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "note retrival process done"
                    response.content = data;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }), function (err) {

                    /** make response array with it's field */
                    response.success = false;
                    response.message = "note retrival process is not done"
                    response.error = err;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }

    }
    // -----------------------------------------------------------------------------------------------------------------------------
   updateNote(req, res) {
        /**parsing body data into node object */
        try {

            req.checkBody('noteId', 'should not be empty').notEmpty();
            // req.checkBody('userId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    // userId: req.body.userId,
                    noteId: req.body.noteId
                }
               
           
                var initilaizePromise = serviceObj.updateNoteService(req.body);
                //console.log("initilaizePromise",initilaizePromise)
                initilaizePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "note updation process done successfully"
                    response.content = data;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }), function (err) {

                    /** make response array with it's field */
                    response.success = false;
                    response.message = "note updation process is not done successfully"
                    response.error = err;
                    /** send respose to server  */
                    res.status(422).send(response)
                }
            }
        } catch (e) {
            let response={}
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------------
    async addLabelToNote(req, res) {
        try {
            req.checkBody('noteId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    noteId: req.body.noteId,
                    label: req.body.label,
                    labelId: req.body.labelId
                }
                // console.log("in controller",noteObj.labelId)
                var result = await serviceObj.addLabelToNoteService(noteObj, req.token._id);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "adding label to note done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "adding label to note is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }

    }

    //-------------------------------------------------------------------------------------------------------------------------
    async deleteLabelFromNote(req, res) {
        try {
            // req.checkBody('_id', 'should not be empty').notEmpty();
            req.checkBody('labelId', 'should not be empty').notEmpty();
            req.checkBody('noteId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    noteId: req.body.noteId,
                    labelId: req.body.labelId
                }
                var result = await serviceObj.deleteLabelFromNoteService(noteObj);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "deleting label from note done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "deleting label from note is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }

    }

    // -----------------------------------------------------------------------------------------------------------------------

    async deleteCollaborateIdFromNote(req, res) {
        try {
            // req.checkBody('_id', 'should not be empty').notEmpty();
            req.checkBody('collaborateIds', 'should not be empty').isLength({ min: 1 })
            req.checkBody('noteId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    noteId: req.body.noteId,
                    collaborateIds: req.body.collaborateIds
                }
                var result = await serviceObj.deleteCollaborateIdFromNoteService(noteObj);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "deleting collaborate Id from note done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "deleting collaborate Id from note is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }

        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }

    }

    // -----------------------------------------------------------------------------------------------------------------------

    async deleteTrashNotes(req, res) {
        try {
            req.checkBody('noteId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    noteId: req.body.noteId,

                }
                //let response = {};//create response object
                /**parsing body data into node object */

                var result = await serviceObj.deleteTrashNotesService(noteObj);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "deleting note from trash done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "deleting note from trash is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }
            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }

    async restoreTrashNotes(req, res) {

        try {
            req.checkBody('noteId', 'should not be empty').notEmpty();
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
                let noteObj = {
                    noteId: req.body.noteId,
                    userId: req.token._id
                }
                //let response = {};//create response object
                /**parsing body data into node object */

                var result = await serviceObj.restoreTrashNotesService(noteObj);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "Restoring note from trash done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "Restoring note from trash is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }
            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }
    async emptyTrash(req, res) {
        try {
            var response = {}
            var userIdObj = {
                userId: req.token._id
            }
            var result = await serviceObj.emptyTrashService(userIdObj);
            if (result.status) {
                /** make response array with it's field */
                response.success = true;
                response.message = "Deleting All notes from trash done successfully"
                response.content = result;
                console.log("res:" + response.content)
                /** send respose to server  */
                res.status(200).send(response)

            }
            else {
                /** make response array with it's field */
                response.success = false;
                response.message = "Deleting All notes from trash is not done successfully"
                //  response.error = ;
                /** send respose to server  */
                res.status(422).send(response)
            }

        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }
    async searchNotes(req, res) {
        try {
            req.checkBody('searchValue', 'should not be empty').notEmpty();
            let error = req.validationErrors();//returns validation errors
            let response = {};//create response object
            /**parsing body data into node object */
            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.error = error
                /** send response to server */
                res.status(400).send(response)

            } else {
                /**parsing body data into node object */
                let userIdObj = {

                    userId: req.token._id
                }
                var result = await serviceObj.searchNotesService(req.body, userIdObj);
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "searching operation done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "searching is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }
    async pagination(req, res) {
        try {
            let pageObj =req.params;
            let query={};
            if(pageObj.pageNo>0){
                query.skip=parseInt(pageObj.pageNo*pageObj.pageSize)-pageObj.pageSize;
                query.limit=parseInt(pageObj.pageSize)
            }
            let response = {};//create response object
            /**parsing body data into node object */
          
                var result = await serviceObj.paginationService(req.token._id,query);    
                result.then
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "searching operation done successfully"
                    response.content = result;
                    //console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "searching is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }
    async elasticSearch(req, res) {
        try {
            req.checkBody('searchValue', 'should not be empty').notEmpty();
            let error = req.validationErrors();//returns validation errors
            let response = {};//create response object
            /**parsing body data into node object */
            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.error = error
                /** send response to server */
                res.status(400).send(response)

            } else {
                /**parsing body data into node object */
                // let userIdObj = {
                //     userId: req.token._id
                // }
                var result = await serviceObj.elasticSearchService(req.body);
               
                
                if (result.status) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "searching operation done successfully"
                    response.content = result;
                    console.log("res:" + response.content)
                    /** send respose to server  */
                    res.status(200).send(response)

                }
                else {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "searching is not done successfully"
                    //  response.error = ;
                    /** send respose to server  */
                    res.status(422).send(response)
                }

            }
        } catch (e) {
            console.log('Error occured ', e);
            response.message = "Internal server error",
                response.error = e.message
            res.status(500).send(response)
        }
    }

}
module.exports = new NoteController();