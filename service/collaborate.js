/* ************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : get the values from the controller and process them for the notes in fundo  notes
 *                    
 *                     
 *                    
 * 
 * @file            : collaborateService.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
var modelObj = require('../model/collaborateModel')

class CollaborateService {
    /**
     * @description service for registration api 
     * @param userRegisterDataObject : contain body data with node object format
     * @param promise : take response from model
     */
    collaborateService(noteObj){
        try {
            return new Promise((resovle, reject) => {
                // calling a method for finding an email of the user
                var initializePromise = modelObj.createAndSave(noteObj)
                initializePromise.then((data)=> {
                    resovle({ 'error': null, 'message': 'successfully created note','status':true })
                }).catch((err)=> {
                    reject({ 'error': false, 'message': 'error while creating notes' ,'status': false })
                })
            })
    } catch (err) {
        reject({ 'error': false, 'message': 'error in note deatils','status': false  })

    }
}
// async createNoteService(noteObj,collaborateObj) {
//     try {
//         return new Promise((resovle, reject) => {
//             // calling a method for finding an email of the user
//             if(collaborateObj.collaborateIds.length>0){
//                 const result=Array.from(new Set(collaborateObj.collaborateIds))
//                 let createPromise= modelObj.createAndSave(noteObj)
//                 createPromise.then((data) => {
//                    result.forEach(mailId=>{
//                        let query={'email':mailId}
//                        let findUserIdPromise=userModelObj.find(query)
//                        findUserIdPromise.then((data1)=>{
//                           // console.log("data",data)
//                         var query1 = { '_id': data._id }
//                         var updateQuery = { $addToSet: { 'collaborateIds': mailId } }
//                         var result = modelObj.update(query1, updateQuery);
//                         result.then((data2)=>{
//                             let key = noteObj.userId + "getAllNotes"
//                             var user = {
//                             userId: noteObj.userId
//                                }
//                             this.getNotesService(user)
//                                     resovle({'status':true})
//                         }).catch((err)=>{
//                             reject({'error':err,'message':"error while updating a collaborative Id",'status':false})
//                         })
//                        }).catch((err)=>{
//                         reject({'error':err,'message':"error while finding a collaborative Id",'status':false})
//                        })
//                     })
//                                 }).catch((err)=>{
//                                 reject({'error':err,'message':"error while creating a note",'status':false})
//                                 })
//                             }
//                             else{
//                                 modelObj.createAndSave(noteObj).then((data)=>{
//                                     resovle(data)
//                                 }).catch((err)=>{
//                                     reject(err)
//                                 })
//                             }
//                         })
//                     }catch(e){
//                         reject(err)
//                     }
// }
// updateNoteService(reqBody) {
//     return new Promise((resovle, reject) => {
//         var findObj = {
//             _id: reqBody.noteId
//         }

//         let findPromise = modelObj.find(findObj)
//         findPromise.then((data) => {
//             console.log("data", data)
//             if (data.length > 0) {

//                 var findPerticularField = {
//                     title: reqBody.title ? reqBody.title : data[0].title,
//                     description: reqBody.description ? reqBody.description : data[0].description,
//                     color: reqBody.color ? reqBody.color : data[0].color,
//                     isTrash: (reqBody.isTrash == true) ? true : false,
//                     isArchieved: (reqBody.isArchieved == true) ? true : false,
//                     isPined: (reqBody.isPined == true) ? true : false,
//                     isReminder: (reqBody.isReminder == true) ? true : false,
//                    collaborateIds:reqBody.collaborateIds ? reqBody.collaborateIds : data[0].collaborateIds
//                 }
//                  if(findPerticularField.collaborateIds.length>0){
//                     const result=Array.from(new Set(findPerticularField.collaborateIds))
//                     console.log("result",result)
//                      for(let i=0;i<result.length;i++){
                         
//                      }

//                 var updatePromise = modelObj.update({ '_id': reqBody.noteId }, findPerticularField);
//                 updatePromise.then((data) => {

//                     //     var key=data.userId+"isTrash"+"true"

//                     //    redisObj.deleteDataFromREdis(key)
//                     //    var key1=data.userId+"isArchieved"+"true"

//                     //    redisObj.deleteDataFromREdis(key1)
//                     //   var key2=data.userId+"isReminder"+"true"

//                     //   redisObj.deleteDataFromREdis(key2)
//                     console.log("data", data.userId)
//                     let isTrashObj = { 'userId': data.userId, 'isTrash': true }
//                     let redisKey = "isTrash"
//                     this.getListService(isTrashObj, redisKey)

//                     let isArchieveObj = { "userId": data.userId, isArchieved: true }
//                     let redisKey1 = "isArchieved"
//                     this.getListService(isArchieveObj, redisKey1)

//                     let isReminderObj = { "userId": data.userId, isReminder: true }
//                     let redisKey2 = "isReminder"
//                     this.getListService(isReminderObj, redisKey2)

//                     resovle({ 'error': null, 'data': data, 'status': true })
//                 }).catch((error) => {
//                     reject({ 'error': error, 'status': false })
//                 })
//             }
//             else {
//                 reject({ 'message': 'error in finding id', 'status': false })
//             }
//         }).catch((err) => {
//             reject({ 'error': err, 'message': 'error in finding id', 'status': false });
//         })
//     })
// }

// ----------------------------------------------------------------------------------------------------------------------------

// var promis =new Promise(function(resolve,reject){
//     resolve(5);
//     })
    
//     promis.then(addition).then(subtraction).then(multiplication).then((msg)=>{
//     console.log("result is: "+ msg);
//     }).catch(function(err){
//         console.log("reject: "+err);
//     })
//     function addition(val){
//         return (val+5);
//     }
//     function subtraction(val){
//         return (val-3);
//     }
//     function multiplication(val){
//         return (val*5);
//     }
// }
//------------------------------------------------------

 // var arr = []
        // if (reqBody.collaborateIds != undefined) {
        //     const result = Array.from(new Set(reqBody.collaborateIds))
        //     for (let i = 0; i < result.length; i++) {

        //         let emailObj = {
        //             email: result[i]
        //         }
        //         arr.push(new Promise(function(resolve, reject) {
        //             let findUserResult = userModelObj.find(emailObj);
        //             findUserResult.then((data1)=>{
        //                 resolve(emailObj)
        //                  }).catch((err)=>{
        //                     resolve(err)
        //                  })
        //         }))
        //     }
        //     return new Promise((resovle, reject) => {
        //     Promise.all(arr).then(function (values) {
        //         console.log("gsgsgs : " , values);
        //         resovle({'data':values})
        //     });
        //     console.log("arrayyyyyyyyyyyyyyy", reqBody.collaborateIds)
            
        // }).catch((err)=>{
        //  //   reject('data',err)
        // })
    
        // }
}
module.exports=new CollaborateService();