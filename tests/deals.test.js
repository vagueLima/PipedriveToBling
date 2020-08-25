const assert = require('assert').strict;
const supertest = require('supertest');
require('dotenv').config({ path: '../.env' });
const app = require('../app');
const { mockDealUpdate } = require('./mockRequest');

describe('Tests for pipedriver and Bling integration', function () {
  it('gets only won deals', function (done) {
    supertest(app)
      .get('/deals/won')
      .expect(200)
      .expect((res) => {
        const nonWonDeals = res.body.deals.filter((deal) => deal.status !== 'won').length;
        assert.equal(nonWonDeals, 0);
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('Mocks a webhook call from Pipedrive', function (done) {
    supertest(app)
      .post('/deals')
      .send({ ...mockDealUpdate() })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('gets oportunidades aggegated by day and value', function (done) {
    supertest(app)
      .get('/oportunidades')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
