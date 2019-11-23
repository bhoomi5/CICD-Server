/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of reading all the Notes
 * @file            : readAllNoteTest.js
 * @author          : Bhoomi Rabara
 * @version         : 1.0
 * @since           : 1-10-2019
 * 
 **************************************************************************/
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);
console.log("fhdjdj",jsonParsedObj.createNoteObj2)
/**
 * @description-Negative Test Cases For Reading All Note
 */
describe('Negative Test Cases For Reading All Note: ', () => {
    /**
     * @description- We have not passed a token and expecting an error of bad request.... It should pass ! 
     */
    it('token and title is not present', (done) => {
        chai.request(server)
            .get('/Note')
            /**
             * @description-Every Time when you run this test, token object should be empty.
             */
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
/**
 * @description-Positive Test Cases For Creating A Note
 */
describe('Positive Test Cases For Creating Note: ', () => {
    /**
    * @description- We have passed a token and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully reading all the notes and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .get('/Note')
           /**
            * @description-Every Time when you run this test, token  should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });

});