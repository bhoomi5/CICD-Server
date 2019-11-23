/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of Reading All Labels
 * @file            : readLabelTest.js
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
 * @description-Negative Test Cases For Reading All Labels
 */

describe('Negative Test Cases For Reading All Labels: ', () => {
    /**
     * @description- We have not passed a token And expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .get('/Label')
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
 * @description-Positive Test Cases For Reading All Labels
 */
describe('Positive Test Cases For Reading All Labels: ', () => {
    /**
    * @description- We have passed a token and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully deletion of note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .get('/Label')
           /**
            * @description-Every Time when you run this test, token should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.labelObj)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });

});