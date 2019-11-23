/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon test.js
 * 
 * Purpose          : to Test the API for deleting A Label
 * @file            : deleteLabelTest.js
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
 * @description-Negative Test Cases For deleting A Label
 */

describe('Negative Test Cases For deleting A Label: ', () => {
    /**
     * @description- We have not passed a token and labelId in the Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/Label')
            /**
             * @description-Every Time when you run this test, token and labelId object should be empty.
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
            .delete('/Label')
            /**
             * @description-Every Time when you run this test, token should be empty.
             */
            .send(jsonParsedObj.labelIdObj)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a label name and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without labelOId Obj and expecting a bad request 400--', (done) => {
        chai.request(server)
            .delete('/Label')
            /**
             * @description-Every Time when you run this test, labelId should be empty.
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
 * @description-Positive Test Cases For deleting A Label
 */
describe('Positive Test Cases For deleting A Label: ', () => {
    /**
    * @description- We have passed a token and labelId in the Object and expecting response 200 with status OK--.... It should pass ! 
    */
   it('Successfully deletion of note and expecting a response 200 with status OK--', (done) => {
       chai.request(server)
           .delete('/Label')
           /**
            * @description-Every Time when you run this test, token and labelId object should be present.
            */
           .set('token',jsonParsedObj.tokenObj.token)
           .send(jsonParsedObj.labelIdObj)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               done();
           });
   });

});