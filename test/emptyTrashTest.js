/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of deleting all notes which are present in trash
 * @file            : displayTrashNotesTest.js
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
 * @description-Negative Test Cases For deleting all notes which are present in trash
 */

describe('Negative Test Cases For deleting all notes which are present in trash: ', () => {
    /**
     * @description- We have not passed a token and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/emptyTrash')
            /**
             * @description-Every Time when you run this test, token should be empty.
             */
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
});
/**
 * @description-Positive Test Cases For deleting all notes which are present in trash
 */
describe('Positive Test Cases For deleting all notes which are present in trash ', () => {
    /**
    * @description- We have passed a token and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully deleting all notes which are present in trash and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .post('/emptyTrash')
           /**
            * @description-Every Time when you run this test, token should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });

});