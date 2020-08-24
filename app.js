require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/PipedriveToBling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.get('/pipedriver', function (req, res, next) {
  const PIPEDRIVER_API_URL = process.env.PIPEDRIVER_API_URL;
  const PIPEDRIVER_TOKEN = process.env.PIPEDRIVE_TOKEN;

  axios
    .get(`${PIPEDRIVER_API_URL}/deals`, { params: { api_token: PIPEDRIVER_TOKEN } })
    .then((payload) => {
      const onlyWonDeals = payload.data.data.filter((deal) => deal.status == 'won');
      res.status(200).json({ deals: onlyWonDeals });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Couldnt connect to pipedriver api' });
    });
});
app.set('port', process.env.PORT || 3000);

module.exports = app;
