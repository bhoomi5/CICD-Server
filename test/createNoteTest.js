/*************************************************************************
 * Execution        : 1. default node       cmd> nodemon model.js
 * 
 * Purpose          : to Test the API of creating Note
 * @file            : createNoteTest.js
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
 * @description-Negative Test Cases For Creating A Note
 */

describe('Negative Test Cases For Creating Note: ', () => {
    /**
     * @description- We have not passed a token and title in the Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('An Empty request is being sent and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/Note')
            /**
             * @description-Every Time when you run this test, token and title object should be empty.
             */
            .send(jsonParsedObj.emptyTitle)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

     /**
     * @description- We have not passed a title Object and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without title Object and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/Note')
            /**
             * @description-Every Time when you run this test, Title Object should be empty.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.emptyTitle)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });
    /**
     * @description- We have not passed a token and expecting error of bad request 400--.... It should pass ! 
     */
    it('request is being sent without token and expecting a bad request 400--', (done) => {
        chai.request(server)
            .post('/Note')
            /**
             * @description-Every Time when you run this test, token should be empty.
             */
            .send(jsonParsedObj.titleObj)
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
     * @description- We have passed a token and title in the Object and expecting response 200 with status OK--.... It should pass ! 
     */
    it('Successfully creation of note and expecting a response 200 with status OK--', (done) => {
        chai.request(server)
            .post('/Note')
            /**
             * @description-Every Time when you run this test, token and title object should be present.
             */
            .set('token',jsonParsedObj.tokenObj.token)
            .send(jsonParsedObj.titleObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

});