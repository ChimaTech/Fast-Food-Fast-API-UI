import ordersDB from '../servers/db/orders-db'; // Imports orders dataBase module
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

/* orders Main test Suit... START */
describe('Orders', () => {
  beforeEach((done) => { // Before each test we empty the database
    // Book.remove({}, (err) => {
    done();
    // });
  });


  // Test the /GET route ...<minor test suit>
  describe('/GET "/api/v1/orders" request', () => {
    it('should GET all the existing orders', (done) => {
      chai.request(server)
        .get('/api/v1/orders')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('All orders retrieved successfully');

          res.body.should.have.property('orders');
          res.body.orders.should.be.a('array');
          expect(res.body.orders).to.have.lengthOf(1);
          res.body.orders[0].id.should.equal(ordersDB[0].id);

          res.body.orders[0].foods.should.be.a('array');
          res.body.orders[0].foods[0].should.be.a('string');

          res.body.orders[0].total.should.be.a('number');
          res.body.orders[0].total.should.equal(70);

          res.body.orders[0].should.have.property('status');
          res.body.orders[0].status.should.be.a('string');
          done();
        });
    });
  }); // </minor test suit>


  // Test the /GET route ...<minor test suit>
  describe('/GET "/api/v1/orders/:ID" request', () => {
    // When the orderID exists in the ordersDB
    it('should GET the order that is specified by an ID', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';

      chai.request(server)
        .get(`/api/v1/orders/${orderID}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('Order retrieved successfully');

          res.body.should.have.property('order');
          res.body.order.should.be.a('object');
          res.body.order.should.have.property('id');
          res.body.order.id.should.equal(orderID);

          res.body.order.should.have.property('foods');
          res.body.order.foods.should.be.a('array');

          res.body.order.should.have.property('total');

          res.body.order.should.have.property('status');
          done();
        });
    });


    // When the orderID does not exist in the ordersDB
    it('cannot GET an order that does not exist in the ordersDB', (done) => {
      const orderID = '2a211v1x181t231t252d1j1cDD';


      chai.request(server)
        .get(`/api/v1/orders/${orderID}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql(`An order with the ID ${orderID} does not exist`);
          done();
        });
    });
  }); // </minor test suit>


  // Test /POST routes ...<minor test suit>
  describe('/POST "/api/v1/orders" request', () => {
    // When nothing is supplied
    it('cannot PLACE an order without a foods List and total cost', (done) => {
      const order = {};

      chai.request(server)
        .post('/api/v1/orders/')
        .send(order)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('List of foods; and Total cost are required');
          done();
        });
    });

    // When only total cost is supplied
    it('cannot PLACE an order without a foods List', (done) => {
      const order = {
        total: 100,
      };

      chai.request(server)
        .post('/api/v1/orders/')
        .send(order)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('List of foods are required');
          done();
        });
    });


    // When only foods List is supplied
    it('cannot PLACE an order without a total cost', (done) => {
      const order = {
        foodsList: 'Akamu,Rice',
      };

      chai.request(server)
        .post('/api/v1/orders/')
        .send(order)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Total cost of foods is required');
          done();
        });
    });


    // When foods List & total cost are supplied
    it('should PLACE an order with a foods List & total cost', (done) => {
      const order = {
        foodsList: 'Akamu,Rice',
        total: 100,
      };

      const orderID = `${encodeStr(order.foodsList.toUpperCase())}${encodeStr(order.total.toString())}`;

      chai.request(server)
        .post('/api/v1/orders/')
        .send(order)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('New order placement is successful');
          res.body.should.have.property('newOrder');
          res.body.newOrder.should.have.property('id').eql(orderID);
          res.body.newOrder.should.have.property('total').eql(order.total);
          res.body.newOrder.should.have.property('status').eql('incoming');
          done();
        });
    });
  }); // </minor test suit>


  // Test POST route to sessions ...<minor test suit>
  describe('/PUT "/api/v1/orders/:ID" request', () => {
    // When there's no match for a queried ID in the ordersDB
    it('cannot UPDATE an order that does not exist in the ordersDB', (done) => {
      const orderID = '2a211v1x181t231t252d1j1cDD';

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Order not found');
          done();
        });
    });


    // When there's a match for the ID but status is not supplied
    it('cannot UPDATE an order without a status', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';
      const status = '';

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .send(status)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Status is required');
          done();
        });
    });


    // When there's a match for the ID status is Invalid
    it('cannot UPDATE an order with an Invalid status', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';
      const status = { status: 'Acceplined' };

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .send(status)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('false');
          res.body.should.have.property('message').eql('Invalid status entered, check the spelling');
          done();
        });
    });


    // When there's a match for the ID & the status is "accepted"
    it('should UPDATE an order with an "accepted" status', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';
      const status = { status: 'accepted' };

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .send(status)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('Order has been accepted successfully');
          res.body.should.have.property('orderFound');
          res.body.orderFound.should.have.property('id').eql(orderID);
          res.body.orderFound.should.have.property('status').eql(status.status);
          done();
        });
    });


    // When there's a match for the ID & the status is "completed"
    it('should UPDATE an order with a "completed" status', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';
      const status = { status: 'completed' };

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .send(status)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('Order has been completed successfully');
          res.body.should.have.property('orderFound');
          res.body.orderFound.should.have.property('id').eql(orderID);
          res.body.orderFound.should.have.property('status').eql(status.status);
          done();
        });
    });


    // When there's a match for the ID & the status is "declined"
    it('should UPDATE an order with a "declined" status', (done) => {
      const orderID = '2a211v1x181t231t252d1j1c';
      const status = { status: 'declined' };

      chai.request(server)
        .put(`/api/v1/orders/${orderID}`)
        .send(status)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql('true');
          res.body.should.have.property('message').eql('Order has been declined successfully');
          res.body.should.have.property('orderFound');
          res.body.orderFound.should.have.property('id').eql(orderID);
          res.body.orderFound.should.have.property('status').eql(status.status);
          done();
        });
    });
  }); // </minor test suit>
}); /* Orders Main test Suit... END */
