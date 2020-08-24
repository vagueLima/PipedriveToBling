const qs = require('qs');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { getDeals } = require('./deals.js');
const builder = require('xmlbuilder');
const axios = require('axios');
const { default: Axios } = require('axios');
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

app.post('/pipedriver', function (req, res, next) {
  let deal = req.body.current;
  const BLING_API_URL = process.env.BLING_API_URL;
  const BLING_TOKEN = process.env.BLING_TOKEN;

  if (deal.status !== 'won') {
    console.log('Deal was updated but its not won yet');
  } else {
    console.log('The deal is won!');
    const payloadToBlingJson = {
      pedido: { cliente: { nome: deal.person_name } },
    };
    let payloadToBlingXML = builder.create('root');
    payloadToBlingXML.ele('pedido').ele('cliente').txt(payloadToBlingJson.pedido.cliente.nome);
    //const config = { headers: { 'Content-Type': 'text/xml' } };

    const data = { xml: payloadToBlingXML.toString(), apikey: BLING_TOKEN };
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url: BLING_API_URL,
    };
    axios(options)
      .then((resBling) => {
        res.status(200).send('ok');
      })
      .catch((err) => res.status(500));
  }
});
app.set('port', process.env.PORT || 3000);

module.exports = app;
