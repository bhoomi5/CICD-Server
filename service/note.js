/* ************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 * 
 * Purpose          : get the values from the controller and process them for the notes in fundo  notes                
 * 
 * @file            : noteService.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 14-10-2019
 * 
 **************************************************************************/


const modelObj = require('../model/note')
const userModelObj = require('../model/user')
const labelObj = require('../model/label')
const redis = require('redis');
const redisClient = redis.createClient({ host: 'localhost', port: 6379 });
const redisObj = require('./redis1')
const logger = require('../logger/logger')
const elasticObj = require('../service/elasticSearch')
class NoteService {
    /**
     * @description service for fundo Note listing api which will give the list of notes according to the input 
     * @param list : contain body data with node object format
     * @param redisKey:contain the perticular key value in which appropriate values will be stored
     */
    async getListService(list, redisKey) {
        try {
            /***
            * @description: call find method in model to find all the  notes according to the input
            */
            let result = await modelObj.find(list);
            /**
            * @let key: contain the perticular key value in which appropriate values will be stored
            */
           console.log("result",result);
           
            let key = result[0].userId + redisKey + "true"
            console.log("key", key)
            /**
             * @description: call setDataToRedis method in redis service to set the data into redis
             */
            redisObj.setDataToRedis(result, key)
            return { "status": true, 'message': 'successfull', 'data': result }
        }
        catch (err) {
            logger.info("nnvvvvnbvn",err)
            return { 'message': 'failed', 'status': false }
        }
    }

//------------------------------------------------------------------------------------------------------------------------------
 /**
     * @description This API WILL BE ONLY CALLED WHEN THE API OF NEW NOTE CREATION WILL BE CALLED .service for adding a document 
     *              on new index or already existing index on elastic search cluster. First of all, checking that the document 
     *              which is going to store in perticular index is exist or not.If it does not exist that first its going to 
     *              create and than add document and if it does exist than itsgoing to store json document directly in it. Note That the document is a one fundoo note.
     * @param noteObj : contain body data with node object format
     * @param redisKey:contain the perticular key value in which appropriate values will be stored
*/
async createNoteIntoElasticSearch(noteObj) {
    try{ 
        
        var obj = {
         'title': noteObj.title,
         'description': noteObj.description,
     }
     let create = await elasticObj.indexExists()
     
         if (create == false) {
             let createIndex = await elasticObj.initIndex()
               logger.info(("createIndex",createIndex));
             
                 let addNote =await elasticObj.addDocument(obj)
                     let obj1 = {
                         searchId: addNote._id
                     }
                     return obj1
         }
         else {
             let addNote =await elasticObj.addDocument(obj)
                 let obj2 = {
                     searchId: addNote._id
                 }
                 return obj2
           }  }catch(err){
               logger.info(err)
                 logger.info(err)
             }     
 }
    // -------------------------------------------------------------------------------------------------------------------------------
    /**
     * @description service for creating a fundo note 
     * @param noteObj : contain body data with node object format
     * @param collaborateObj:contain the collaborate Id to whom user want share his/her note
     */
    
    createNoteService(noteObj, collaborateObj) {
        try {
            return new Promise((resovle, reject) => {
                let searchId = this.createNoteIntoElasticSearch(noteObj)
                searchId.then((elasticId)=>{
                // calling a method for finding an email of the user
           
                if (collaborateObj.collaborateIds) {
                    /***
                     * @description: filter the unique value from collaborating Id Array
                     */
                    
                    const result = Array.from(new Set(collaborateObj.collaborateIds))

                    /***
                   * @description: call create and save method in model to save the note details
                   */
                 
                    let createPromise = modelObj.createAndSave(noteObj, elasticId)
                    createPromise.then((data) => {

                        result.forEach(mailId => {
                            let findUserIdQuery = { 'email': mailId }
                            /***
                            * @description: call find method in model to check that given collaborate id is exist or note in user database
                            */
                            let findUserIdPromise = userModelObj.find(findUserIdQuery)
                            findUserIdPromise.then((data1) => {

                                /**
                                * @let findNoteQuery: contain the note Id
                                * @let updateQuery: adding the collaborate Id to the collaborate Id array in a perticular note 
                                *    */
                                let findNoteQuery = { '_id': data._id }
                                let updateQuery = { $addToSet: { 'collaborateIds': mailId } }
                                /**
                                 * @description: call update method in model to add the collaborate id into an array
                                */
                                // console.log(query,"............",updateQuery);

                                var result = modelObj.update(findNoteQuery, updateQuery);
                                result.then((data2) => {
                                    /**
                                    * @let key: contain the perticular key value in which appropriate values will be stored
                                    */
                                    console.log("data 149", data);

                                    let user = {
                                        userId: noteObj.userId
                                    }
                                    this.getNotesService(user)
                                    resovle({ 'status': true, 'data': 'Note has been created with the collaborate Id' })
                                }).catch((err) => {
                                    logger.info(err)
                                    reject({ 'message': "Failed", 'status': false })
                                })
                            }).catch((err) => {
                                logger.info(err)
                                reject({ 'status': false })
                            })
                        })
                    }).catch((err) => {
                        logger.info(err)
                        reject({ 'message': "Failed", 'status': false })
                    })

                }
                else {
                   modelObj.createAndSave(noteObj,elasticId).then((data) => {
                        let user = {
                            userId: data.userId
                        }
                        this.getNotesService(user)
                        resovle({ 'status': true, 'Note': data, 'message': "note has been created" })
                    }).catch((err) => {
                        logger.info(err)
                        reject(err)
                    })
                }
            })
               
            }).catch((err) => {
                logger.info("main err", err)
            })
        } catch (e) {
            logger.info(e)
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    getNotesService(noteObj) {
        try {
            var initializePromise = modelObj.find(noteObj);
            return new Promise((resovle, reject) => {
                initializePromise.then((data) => {
                    if (data) {
                        var key = data[0].userId + "getAllNotes"
                        redisObj.setDataToRedis(data, key)
                        resovle({ 'data': data, 'status': true })
                    }
                }).catch(err => {
                    logger.info(err)
                    reject({ 'status': false })
                })
            })
        } catch (err) {
            logger.info(err)
            reject({ 'status': false })
        }
    }
    //------------------------------------------------------------------------------------------------------------------------------
    /**
      * @description service for updating a fundo note 
      * @param reqBody : contain body data with node object forma
      */
    updateNoteService(reqBody) {

        return new Promise((resovle, reject) => {
            let findObj = {
                _id: reqBody.noteId
            }
            /**
            * @let arr: store the unique values of collaborateId
            */
            let arr = []
            if (reqBody.collaborateIds != undefined) {
                /***
                * @description: filter the unique value from collaborating Id Array
                */
                const result = Array.from(new Set(reqBody.collaborateIds))
                for (let i = 0; i < result.length; i++) {

                    let emailObj = {
                        email: result[i]
                    }
                    /***
                    * @description: call find method in model to check that given collaborate id is exist or not in user database
                    */
                    let findUserResult = userModelObj.find(emailObj)
                    findUserResult.then((data1) => {
                        arr.push(data1.email)

                    }).catch((err) => {
                        //  reject({'error':err,'message':'no ids are found'})
                        logger.info(err)
                    })
                }
            }
            /**
            * @description: call find method in model to check that given note id is exist or not
            */
            let findPromise = modelObj.find(findObj)
            findPromise.then((data) => {
                if (data.length > 0) {
                    /**
                    * @let findPerticularField: its a object wchich we want to update
                    */
                    let findPerticularField = {
                        title: reqBody.title ? reqBody.title : data[0].title,
                        description: reqBody.description ? reqBody.description : data[0].description,
                        color: reqBody.color ? reqBody.color : data[0].color,
                        isTrash: (reqBody.isTrash == true) ? true : (reqBody.isTrash == false) ? false : data[0].isTrash,
                        isArchieved: (reqBody.isArchieved == true) ? true : (reqBody.isArchieved == false) ? false : data[0].isArchieved,
                        isPined: (reqBody.isPined == true) ? true : (reqBody.isPined == false) ? false : data[0].isPined,
                        isReminder: (reqBody.isReminder == true) ? true : (reqBody.isReminder == false) ? false : data[0].isReminder,
                        collaborateIds: arr,
                        reminder: reqBody.reminder ? reqBody.reminder : data[0].reminder
                    }
                    /**
                    * @description: call update method in model to add the collaborate id into an existing note
                   */
                 
                 // console.
                    var updatePromise = modelObj.update({ '_id': reqBody.noteId }, findPerticularField);
                    updatePromise.then((data2) => {
                        /**
                         * @let isTrashObj:creating a object to update the note when changes have made to the isTrash Field
                         * @let redisKey: contain the perticular key value in which appropriate values will be stored
                         */
                        if(reqBody.title != undefined || reqBody.description != undefined){
                           let sourceData = {
                                'title':reqBody.title,
                                'description':reqBody.description,

                                }
                            let documentDetails={
                                id: data2.elasticId,
                                index:'notes',
                                type: 'document',
                                body:{
                                    doc:sourceData
                                }
                               }
                           let update=elasticObj.updateDocument(documentDetails)
                           update.then((data56)=>{
                           logger.info("update.................................................",data56);
                           })
                         
                        }
                        let user = {
                            userId: data2.userId
                        }
                        this.getNotesService(user)

                        let isTrashObj = { 'userId': data2.userId, 'isTrash': true }
                        let redisKey = "isTrash"
                        this.getListService(isTrashObj, redisKey)

                        /**
                       * @let isArchieveObj:creating a object to update the note when changes have made to the isArchieved Field
                       * @let redisKey1: contain the perticular key value in which appropriate values will be stored
                       */
                        let isArchieveObj = { "userId": data2.userId, isArchieved: true }
                        let redisKey1 = "isArchieved"
                        this.getListService(isArchieveObj, redisKey1)

                        /**
                         * @let isReminderObj:creating a object to update the note when changes have made to the isReminder Field
                         * @let redisKey2: contain the perticular key value in which appropriate values will be stored
                         */
                        let isReminderObj = { "userId": data2.userId, isReminder: true }
                        let redisKey2 = "isReminder"
                        this.getListService(isReminderObj, redisKey2)
                        resovle({ 'error': null, 'data': data2, 'status': true })
                    }).catch((err) => {
                        logger.info(err)
                        reject({ 'status': false })
                    })
                }
                 else {
                    logger.info(err)
                    reject({ 'status': false, 'message': 'Failed' })
                }
            }).catch((err) => {
                logger.info(err)
                reject({ 'status': false, 'message': 'Failed' })
            })

        }).catch((err) => {
            //reject({ 'error': err, 'message': 'error in finding id', 'status': false });
            logger.info(err)
        })

    }
    //-------------------------------------------------------------------------------------------------------------------------------
    /**
     * @description service for deleting a collaborate id from a note and will remove collaboration with the perticular user
     * @param noteObj : contain body data with node object format
     */
    async deleteCollaborateIdFromNoteService(noteObj) {
        try {
            let findNoteObj = {
                _id: noteObj.noteId
            }
            /***
            * @description: call find method in model to find the note
            */
            let findNote = await modelObj.find(findNoteObj)
            for (let i = 0; i < noteObj.collaborateIds.length; i++) {
                /**
                 * @let updateQuery: contain a object which is going to delete from note using $pull
                 */
                let updateQuery = { $pull: { 'collaborateIds': noteObj.collaborateIds[i] } }
                let result = await modelObj.updateNote(findNoteObj, updateQuery)
            }
            return { 'status': true }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------------
    /**
     * @description service for adding a label to note 
     * @param noteObj : contain body data with node object form
     * @param tokenId: contain user Id
     */
    async addLabelToNoteService(noteObj, tokenId) {
        try {

            if (noteObj.label != undefined || noteObj.labelId != undefined) {
                /**
                 * @let idObj:contain note id
                 */
                let idObj = {
                    _id: noteObj.noteId
                }
                /**
                 * @let createAndSaveObj: contain label name if new or label id if already exist in label database and user id
                 */
                let createAndSaveObj = {
                    label: noteObj.label,
                    userId: tokenId
                }
                /**
                 * @let labelId: contain label id
                 * @description:when new label will be going to store first create, save and than get a label id
                 */
                if (noteObj.labelId == undefined) {
                    let createdLabel = await labelObj.createAndSave(createAndSaveObj)
                    var LabelId = createdLabel._id
                }
                /**
                 * @description:when already existing label will be going to store get a label id from note directly
                 */
                else {
                    let obj={
                        _id:noteObj.labelId
                    }
                var findLabel=await labelObj.find(obj);
                    var LabelId = noteObj.labelId
                }
                let findId = await modelObj.find(idObj)
                if (findId.length > 0) {
                    /**
                     * @let query: contain noteid
                     * @let updateQuery: contain label id obj and using $addToSet adding a label to note
                     */


                    let query = { '_id': noteObj.noteId }
                    let updateQuery = { $addToSet: { 'label': LabelId } }
                    /**
                     * @description: pushing a label into note
                     */
                    let result = await modelObj.update(query, updateQuery);
                    let sourceData={
                        label:findLabel[0].label
                    }
                    let documentDetails={
                        id: findId[0].elasticId,
                        index:'fundoo',
                        type: 'document',
                        body:{
                            doc:sourceData
                        }
                       }
                    let addLabelPromise=elasticObj.updateDocument(documentDetails);
                    addLabelPromise.then((addLabel)=>{
                           logger.info("adding a label to indices",addLabel);
                           
                    }).catch((err)=>{
                                logger.info(err) 
                    })
                    
                    return { 'status': true, 'data': result, 'status': true }
                }
                else {
                    return { 'status': false }
                }
            }
            else {
                return { 'status': false }
            }
        } catch (err) {
            return err
        }
    }
//-------------------------------------------------------------------------------------------------------------------------------------
 /**
     * @description service for deleting a label from note 
     * @param noteObj : contain body data with node object form
     */
    async deleteLabelFromNoteService(noteObj) {
        try {
            let noteId
            (noteObj.all) ? noteId = (noteObj.all) : noteId = { _id: noteObj.noteId }
            let findNote = await modelObj.find(noteId)
            let updateQuery = { $pull: { 'label': noteObj.labelId } }
            let result = await modelObj.updateNote(noteId, updateQuery)
            return { 'status': true }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description service for deleting a note 
    * @param noteObj : contain body data with node object form
    */
    async deleteTrashNotesService(noteObj) {
        try {
            let query = { _id: noteObj.noteId }
            /**
             * @description: calling deleteOne method in model to delete the note which is presented in trash folder
             */
            logger.info("id",noteObj);
            let result1 = await modelObj.deleteOne(query)
            let documentDetails={
                id: result1.elasticId,
                index:'notes'
               }
               let result=elasticObj.deleteDocument(documentDetails)
               result.then((data56)=>{
                logger.info("delete.................................................",data56);
               })
            return { 'status': true, 'data': result1 }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    // ----------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description service for restoring a note which was deleted 
    * @param noteObj : contain body data with node object form
    */
    async restoreTrashNotesService(noteObj) {
        try {
            let query = { '_id': noteObj.noteId }
            let updateQuery = { $set: { 'isTrash': false } }
            /**
             * @description: calling update method in model to restore the note which is in trash after deletion of a note
             */
            let result = await modelObj.update(query, updateQuery);
            return { 'status': true, 'data': result }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    // ------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description service for deleting all note which is presented in trash
    * @param noteObj : contain body data with node object form
    */
    async emptyTrashService(userIdObj) {
        try {
            let query = { 'userId': userIdObj.userId, 'isTrash': true }
            /**
            * @description: calling deleteMany method in model to delete all the note which is in trash
            */
            let result = await modelObj.deleteMany(query)
            return { 'status': true, 'data': result }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    //--------------------------------------------------------------------------------------------------------------------------
    async reminderService(noteObj) {
        try {
            let reminderDateObj = new Date(noteObj.reminder);
            let remindDate = reminderDateObj.toISOString();
            let query = { '_id': noteObj.noteId }
            let updateQuery = { 'reminder': remindDate, 'isReminder': true }
            /**
            * @description: calling deleteMany method in model to delete all the note which is in trash
            */
            let result = await modelObj.update(query, updateQuery)
            return { 'status': true, 'data': result }
        } catch (err) {
            logger.info(err)
            return { 'status': false }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description service for searching a note
    * @param noteObj : contain body data with node object form
    */
    async searchNotesService(req, userIdObj) {
        try {
            var data = req.searchValue
            let findingQuery = {
                $and: [{
                    $or: // the $or carries out the optional functionality
                        [   //options i Case insensitivity to match upper and lower cases. 
                            { 'title': { $regex: data, $options: 'i' } },
                            { 'description': { $regex: data, $options: 'i' } },
                            { 'color': { $regex: data, $options: 'i' } },
                            { 'collaborateIds': { $regex: data, $options: 'i' } }

                        ]
                }, { userId: userIdObj.userId }]
            }
            let result = await modelObj.find(findingQuery)
            logger.info(result)
            let result1=elasticObj.searchDocument(data)
            result1.then((data1)=>{
            }).catch((err)=>{
                logger.info(err)
            })
            // label searching
            console.log(("result",result));
            let userObj={ userId: userIdObj.userId }
            let labelName = {
                'search':  { $regex: data, $options: 'i' } ,
            }
            let data1=await modelObj.findPopulate(userObj,labelName)
                console.log("result",data1);
                if(data1){
                    let result =  data1.filter((item)=>                
                            {
                                return item.label.length!=0;
                            });
            return ({ 'status': true, 'note': result })
            }
        } catch (err) {
            return { 'status': false }
        }
    }
    //--------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description: pagination Service. In this API userId, page no and page limit that one page contain how many notes has sent to the find method of model.
    *               Find method will give response as a total notes according to the page size in given perticular page no.
    * @param userId : contain userId with node object.
    * @param pageQuery: contain page no. and one page sixe
    */
    async paginationService(userId, pageQuery) {
        try {
            let userIdObj = {
                userId: userId
            }
            let result = await modelObj.findPage(userIdObj, {}, pageQuery)
            return ({ status: true, 'NOTES': result })
        } catch (err) {
            logger.info("error..............", err)
            return ({ status: false })
        }
    }
//-------------------------------------------------------------------------------------------------------------------------------
    /**
    * @description: elastic search Service. This API search value will pass to the searchDocument function wchich contain
    *               the search query of elastic search.
    * @param reqBody : contain search value with node object.
    */
elasticSearchService(reqBody){
    return new Promise((res,rej)=>{
        let data=reqBody.searchValue
        let result1=elasticObj.searchDocument(data)
        result1.then((data1)=>{
            logger.info("data1",data1);
            
            res({ status: true, 'NOTES': data1 })
        }).catch((err)=>{
            logger.info(err)
            rej({ status: false })
        })
    }).catch((err)=>{
        logger.info(err)
        rej({ status: false })
    })
      
}
}
module.exports = new NoteService();

