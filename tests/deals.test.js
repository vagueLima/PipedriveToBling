const assert = require('assert').strict;
const supertest = require('supertest');
const app = require('../app');
require('dotenv').config({ path: '../.env' });

describe('Tests for pipedriver and Bling integration', function () {
  it('gets only won deals', function (done) {
    supertest(app)
      .get('/pipedriver')
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
});
