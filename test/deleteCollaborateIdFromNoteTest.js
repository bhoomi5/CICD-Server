/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon test.js
 * 
 * Purpose          : to Test the API of deleting a label to a Note
 * @file            : deleteCollaborateIdFromNoteTest.js
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
 * @description-Negative Test Cases For deleting a collaborateId from Note
 */

describe('Negative Test Cases For deleting a collaborateId from Note: ', () => {
    /**
     * @description- We have not passed a token and Note_Id, collaborateId in the Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/deleteCollaborateIdFromNote')
            /**
             * @description-Every Time when you run this test, token and Note_Id, collaborateId object should be empty.
             */
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
            .delete('/deleteCollaborateIdFromNote')
            /**
             * @description-Every Time when you run this test, token should be empty. Pass Only NoteId,collaborateId 
             */
            .send(jsonParsedObj.deleteCollaborateIdObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
   
    /**
     * @description- We have not passed a collaborateId and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without collaborateId and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/deleteCollaborateIdFromNote')
            /**
             * @description-Every Time when you run this test, collaborateId in the Object should be empty. Pass only token and NoteId.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.deleteCollaborateIdWithOutCollaborateIdObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
     /**
     * @description- We have not passed a noteId and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without noteId and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/deleteCollaborateIdFromNote')
            /**
             * @description-Every Time when you run this test, noteId in the Object should be empty. Pass only token and collaborateId.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.deleteCollaborateIdWithOutNoteIdObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a NoteId Obj,collaborateId and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without NoteId Obj and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/deleteCollaborateIdFromNote')
            /**
             * @description-Every Time when you run this test, NoteId in the Object should be empty. Pass only token.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.emptyObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
});
/**
 * @description-Positive Test Cases For deleting a collaborateId from Note
 */
describe('Positive Test Cases For deleting a label to Note: ', () => {
    /**
    * @description- We have passed a token and NoteId,collaborateId in the Object and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully addition of label to note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .delete('/deleteCollaborateIdFromNote')
           /**
            * @description-Every Time when you run this test, token and NoteId , collaborateId should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.deleteCollaborateIdObj)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });
});