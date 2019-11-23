let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);

describe('/POST resetPassword', () => {
    it('Login Details are Empty', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordObjEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST resetPassword', () => {
    it('Reset Password done Successfully', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .set('token',jsonParsedObj.resetToken.resetToken)
            .send(jsonParsedObj.resetPasswordObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST resetPassword', () => {
    it('Email Field should not be in a given format', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordEmailFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST resetPassword', () => {
    it('Email shoul be required', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordEmailEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST resetPassword', () => {
    it('Password shoul be required', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST resetPassword', () => {
    it('Password length should be maximum of 12 and minimum of 6 character', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordLength)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});

describe('/POST resetPassword', () => {
    it('Email Does Not Exist', (done) => {
        chai.request(server)
            .post('/resetPassword')
            .send(jsonParsedObj.resetPasswordbjEmailNotExist)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});