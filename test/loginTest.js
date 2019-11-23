let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);

describe('/POST Login', () => {
    it('Login Details are Empty', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginObjEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Login Successfully', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Email Does Not Exist', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginObjEmailNotExist)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Email shoul be required', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginEmailEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Password shoul be required', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginPasswordEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Password length should be maximum of 12 and minimum of 6 character', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginPasswordLength)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Email Field should not be in a given format', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginEmailFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST Login', () => {
    it('Credential Does not Match', (done) => {
        chai.request(server)
            .post('/login')
            .send(jsonParsedObj.loginEmailPasswordDoesNotMatch)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done();
            });
    });

});