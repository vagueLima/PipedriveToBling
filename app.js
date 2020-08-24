require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { getDeals } = require('./deals.js');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/PipedriveToBling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.get('/pipedriver', function (req, res, next) {
  getDeals((deal) => deal.status == 'won')
    .then((onlyWonDeals) => {
      res.status(200).json({ deals: onlyWonDeals });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Couldnt connect to pipedriver api' });
    });
});

app.set('port', process.env.PORT || 3000);

module.exports = app;
