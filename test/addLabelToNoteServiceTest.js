/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of adding a label to a Note
 * @file            : addLabelToNoteTest.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
// assertion Library.....
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);

/**
 * @description-Negative Test Cases For adding a label to Note
 */

describe('Negative Test Cases For adding a label to Note: ', () => {
    /**
     * @description- We have not passed a token and Note_Id, LabelId (if label exists) or Label (if new label will create) in the Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/addLabelToNote')
            /**
             * @description-Every Time when you run this test, token and Note_Id, LabelId (if label exists) or Label (if new label will create) object should be empty.
             */
            .send(jsonParsedObj.emptyNoteId)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a token and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without Token Object and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/addLabelToNote')
            /**
             * @description-Every Time when you run this test, token should be empty. Pass Only NoteId,LabelId (if label exists) or Label (if new label will create)
             */
            .send(jsonParsedObj.addExistingLabelToNoteObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a NoteId Obj,LabelId (if label exists) or Label (if new label will create) and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without NoteId Obj,LabelId (if label exists) or Label (if new label will create) and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/addLabelToNote')
            /**
             * @description-Every Time when you run this test, NoteId,LabelId (if label exists) or Label (if new label will create) should be empty. Pass only token.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.emptyNoteId)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have passed a token and NoteId Obj but not passing LabelId (if label exists) or Label (if new label will create) and expecting error of bad request 422--.... It should pass ! 
     */
    it('request is being sent without LabelId (if label exists) or Label (if new label will create) and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/addLabelToNote')
            /**
             * @description-Every Time when you run this test, LabelId (if label exists) or Label (if new label will create) should be empty. Pass only token and NoteId.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.addLabelToNoteWithOnlyNoteId)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done();
            });
    });
});
/**
 * @description-Positive Test Cases For adding a label to A Note
 */
describe('Positive Test Cases For adding a label to Note: ', () => {
    /**
    * @description- We have passed a token and NoteId,LabelId (if label exists) in the Object and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully addition of label to note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .post('/addLabelToNote')
           /**
            * @description-Every Time when you run this test, token and NoteId , LabelId (if label exists) and any one field of Note should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.addExistingLabelToNoteObj)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });
   
   it('Successfully addition of label to note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .post('/addLabelToNote')
           /**
            * @description-Every Time when you run this test, token and NoteId ,  Label (if new label will create) and any one field of Note should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.addNewLabelToNote)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });
});
