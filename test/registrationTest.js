
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let jsonParsedObj = require('./test.json')
chai.use(chaiHttp);

describe('/POST registration', () => {

    
    it('Registration Details are Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationObjEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Already User Exist', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationObjEmailRepeat)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Registration Successfully Done', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationObj)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            });
    });

});
describe('/POST registration', () => {
    it('First Name should not be Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationFNEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Last Name should not be Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationLNEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Email should not be Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationEmailEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Password should not be Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationPasswordEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Confirm Password Field should not be Empty', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationCnfPasswordEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Password length should be maximum of 12 and minimum of 6 character', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationPasswordLength)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Email Field should not be in a given format', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationPasswordMatch)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('First Name should be in Alphabet', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationFNFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Last Name should be in Alphabet', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationLNFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
describe('/POST registration', () => {
    it('Email should be in a proper format', (done) => {
        chai.request(server)
            .post('/registration')
            .send(jsonParsedObj.registrationEmailFormat)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

});
