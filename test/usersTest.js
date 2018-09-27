import usersDB from '../servers/db/users-db'; // Imports Users dataBase module
import sessionsDB from '../servers/db/sessions-db'; // Imports sessions dataBase module
import encodeStr from '../servers/appControllers/encodeStr';

process.env.NODE_ENV = 'test'; // Imports `encodeStr` function

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../servers/app');

const should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);

/* Users Main test Suit... START */
describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    // Book.remove({}, (err) => {
    done();
    // });
  });


  // Test the /GET route ...<minor test suit>
  describe('/GET "/api/v1/users" request', () => {
    it('should GET all the existing users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('Users retrieved successfully');
          res.body.should.have.property('users');
          res.body.users.should.be.a('array');
          expect(res.body.users).to.have.lengthOf(1);
          res.body.users[0].id.should.equal(usersDB[0].id);
          res.body.users[0].name.should.equal(usersDB[0].name);
          res.body.users[0].email.should.equal(usersDB[0].email);
          res.body.users[0].password.should.equal(usersDB[0].password);
          done();
        });
    });
  }); // </minor test suit>


  // Test /POST routes ...<minor test suit>
  describe('/POST "/api/v1/users" request', () => {
    // When nothing is not supplied
    it('should not SIGN UP a new user without a Name, email & password', (done) => {
      const user = {};

      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Name, Email and Password are required');
          done();
        });
    });

    // When only password is supplied
    it('should not SIGN UP a new user without a Name & email', (done) => {
      const user = {
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Name and Email are required');
          done();
        });
    });

    // When only email and password are supplied
    it('should not SIGN UP a new user without a Name', (done) => {
      const user = {
        email: 'chibbyarena@gmail.com',
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Name is required');
          done();
        });
    });

    // When only name is supplied
    it('should not SIGN UP a new user without an Email & Password', (done) => {
      const user = {
        name: 'Ugochukwu Nnemmu',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Email and Password are required');
          done();
        });
    });

    // When only name and email are supplied
    it('should not SIGN UP a new user without a password', (done) => {
      const user = {
        name: 'Ugochukwu Nnemmu',
        email: 'chibbyarena@gmail.com',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Password is required');
          done();
        });
    });

    // When only name and password are supplied
    it('should not SIGN UP a new user without an email', (done) => {
      const user = {
        name: 'Ugochukwu Nnemmu',
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Email is required');
          done();
        });
    });

    // When only email is supplied
    it('should not SIGN UP a new user without a name & password', (done) => {
      const user = {
        email: 'chibbyarena@gmail.com',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Name and Password are required');
          done();
        });
    });

    // When name, email and password are supplied
    it('should SIGN UP and login a new user with a name, email & password', (done) => {
      const user = {
        name: 'Ugochukwu Nnemmu',
        email: 'chibbyarena@gmail.com',
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('New user signup is successful');

          res.body.should.have.property('newUser');
          res.body.newUser.should.be.a('object');
          res.body.newUser.id.should.equal(`${encodeStr(user.email.toUpperCase())}${encodeStr(user.password)}`);
          res.body.newUser.name.should.equal(user.name);
          res.body.newUser.email.should.equal(user.email);
          res.body.newUser.password.should.equal(user.password);

          res.body.should.have.property('newSession');
          res.body.newSession.should.be.a('object');
          res.body.newSession.token.should.equal(`${encodeStr(user.email.toUpperCase())}${encodeStr(user.password)}`);
          res.body.newSession.email.should.equal(user.email);
          done();
        });
    });
  }); // </minor test suit>


  // Test POST route to sessions ...<minor test suit>
  describe('/POST "/api/v1/auth/login" request', () => {
    // When nothing is supplied
    it('should not SIGN IN a user without an email & password', (done) => {
      const user = { };

      chai.request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Email and Password are required');
          done();
        });
    });

    // When only password is supplied
    it('should not SIGN IN a user without an email', (done) => {
      const user = {
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Email is required');
          done();
        });
    });


    // When only email is supplied
    it('should not SIGN IN a user without a password', (done) => {
      const user = {
        email: 'chibbyarena@gmail.com',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Password is required');
          done();
        });
    });

    // When email and password are supplied butu user doesn't exist in usersDB
    it('should not SIGN IN a user that does not exist in usersDB', (done) => {
      const userNot = {
        email: 'ken@gmail.com',
        password: 'getAnewPassKey',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(userNot)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Incorrect email or password');
          done();
        });
    });

    // When email and password are supplied and user exist in usersDB
    it('should SIGN IN a user that exists with an email & password', (done) => {
      const user = {
        email: 'kelejackson_new@yahoo.com',
        password: 'kelechi',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('New user sign-in is successful');

          res.body.should.have.property('newSession');
          res.body.newSession.should.be.a('object');
          res.body.newSession.token.should.equal(`${encodeStr(user.email.toUpperCase())}${encodeStr(user.password)}`);
          res.body.newSession.email.should.equal(user.email);
          done();
        });
    });
  }); // </minor test suit>
}); /* Users Main test Suit... END */
