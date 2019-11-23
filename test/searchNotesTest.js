/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of Searching a perticular Note
 * @file            : restoreTrashNotesTest.js
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
 * @description-Negative Test Cases ForSearching a perticular Note
 */

describe('Negative Test Cases For Searching a perticular Note: ', () => {
    /**
     * @description- We have not passed a token and Note_Id in the Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/searchNotes')
            /**
             * @description-Every Time when you run this test, token and Note_Id object should be empty.
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
            .post('/searchNotes')
            /**
             * @description-Every Time when you run this test, token should be empty.
             */
            .send(jsonParsedObj.searchObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a NoteId Obj and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without NoteId Obj and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/searchNotes')
            /**
             * @description-Every Time when you run this test, NoteId should be empty.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
});
/**
 * @description-Positive Test Cases For Searching a perticular Note
 */
describe('Positive Test Cases For Searching a perticular Note: ', () => {
    /**
    * @description- We have passed a token and NoteId in the Object and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully searching of note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .post('/searchNotes')
           /**
            * @description-Every Time when you run this test, token and NoteId object should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.searchObj)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });

});