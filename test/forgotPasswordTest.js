require('dotenv').config()
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);
describe('/POST forgetPassword', () => {
    it(' Emal has Submitted Successfully', (done) => {
        chai.request(server)
            .post('/forgetPassword')
            .send(jsonParsedObj.forgotPasswordObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

});

describe('/POST forgetPassword', () => {
    it('Email field is Empty', (done) => {
        chai.request(server)
            .post('/forgetPassword')
            .send(jsonParsedObj.forgotPasswordObjEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST forgetPassword', () => {
    it('Email Does Not Exist', (done) => {
        chai.request(server)
            .post('/forgetPassword')
            .send(jsonParsedObj.forgotPasswordObjEmailNotExist)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done();
            });
    });

});

describe('/POST forgetPassword', () => {
    it('Email should be in a proper format', (done) => {
        chai.request(server)
            .post('/forgetPassword')
            .send(jsonParsedObj.forgotPasswordEmailFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
