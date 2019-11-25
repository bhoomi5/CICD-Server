/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 * 
 * Purpose          : to hit the perticular API
 *                    
 *                     
 *                    
 * 
 * @file            : routes.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 01-10-2019
 * 
 **************************************************************************/

const express = require("express");

const route = express.Router();
// var passport=require('passport')
var controllerMethod=require('../controller/user');
// var notesController=require('../controller/note');
// var labelController=require('../controller/label');
// var oauthcontrollerMethod=require('../controller/oauth');
// var cacheObj=require('../controller/cache')

const tokenVerify=require('../service/tokenGenerator');

// var multer=require('../config/multer')

route.post('/registration', controllerMethod.registration);
route.post('/login',controllerMethod.login)
//route.post('/login',tokenVerify.verifyToken,controllerMethod.login)
route.post('/forgetPassword',controllerMethod.forgetPassword)
route.post('/resetPassword',controllerMethod.resetPassword)
route.post('/verification',controllerMethod.emailVerification)
// route.post('/uploadFile',tokenVerify.verifyToken,multer.single('file'),controllerMethod.s3Controller)

// route.post('/facebook',passport.authenticate('fbToken'),oauthcontrollerMethod.facebookOAuth)
// route.get('/auth/google',passport.authenticate('google',{scope:['email','profile']}))
// route.get('/auth/google/callback',passport.authenticate('google'),oauthcontrollerMethod.googleOAuth);

// // funDo APIS for Notes
// route.post('/Note',tokenVerify.verifyToken,notesController.createNote)
// route.get('/Note',tokenVerify.verifyToken,cacheObj.cacheNotes,notesController.readNote)
// route.put('/Note',tokenVerify.verifyToken,notesController.updateNote)
// //route.delete('/Note',tokenVerify.verifyToken,notesController.deleteNote)
// route.delete('/deleteTrashNotes',tokenVerify.verifyToken,notesController.deleteTrashNotes)
// // funDo APIS for Labels
// route.post('/Label',tokenVerify.verifyToken,labelController.createLabel)
// route.get('/Label',tokenVerify.verifyToken,cacheObj.cacheLabels,labelController.readLabel)
// route.put('/Label',tokenVerify.verifyToken,labelController.updateLabel)
// route.delete('/Label',tokenVerify.verifyToken,labelController.deleteLabel)

// route.get('/list',tokenVerify.verifyToken,cacheObj.cacheList,notesController.getListController)
// route.get('/pagination/:pageNo/:pageSize',tokenVerify.verifyToken,notesController.pagination)


// route.post('/addLabelToNote',tokenVerify.verifyToken,notesController.addLabelToNote)
// route.delete('/deleteLabelFromNote',tokenVerify.verifyToken,notesController.deleteLabelFromNote)
// route.delete('/deleteCollaborateIdFromNote',tokenVerify.verifyToken,notesController.deleteCollaborateIdFromNote)

// route.delete('/deleteTrashNotes',tokenVerify.verifyToken,notesController.deleteTrashNotes)
// route.post('/restoreTrashNotes',tokenVerify.verifyToken,notesController.restoreTrashNotes)
// route.post('/emptyTrash',tokenVerify.verifyToken,notesController.emptyTrash)

// route.post('/searchNotes',tokenVerify.verifyToken,notesController.searchNotes)
// route.post('/elasticSearch',tokenVerify.verifyToken,notesController.elasticSearch)

module.exports = route;