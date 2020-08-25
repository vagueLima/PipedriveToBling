require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const { getDeals, uploadDealToBling } = require('./deals.js');
const Oportunidade = require('./models/oportunidade');

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/PipedriveToBling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.get('/pipedriver', function (req, res, next) {
  getDeals((dealPipedrive) => dealPipedrive.status == 'won')
    .then((onlyWonDeals) => {
      res.status(200).json({ deals: onlyWonDeals });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Couldnt connect to pipedriver api' });
    });
});

app.post('/pipedriver', function (req, res, next) {
  let dealPipedrive = req.body.current;

  if (dealPipedrive.status !== 'won') {
    console.log('Deal was updated but its not won yet');
    res.status(200);
  } else {
    console.log('The dealPipedrive is won!');
    const payloadToBlingJson = {
      pedido: {
        itens: [
          {
            descricao: dealPipedrive.title,
            vlr_unit: dealPipedrive.value,
            codigo: dealPipedrive.id,
          },
        ],
        cliente: { nome: dealPipedrive.person_name },
      },
    };
    uploadDealToBling(payloadToBlingJson)
      .then((pedidoBling) => {
        const newOportunidade = new Oportunidade({
          id_pipedrive: dealPipedrive.id,
          id_bling: pedidoBling.numero,
          value: dealPipedrive.value,
          currency: dealPipedrive.currency,
        });
        newOportunidade.save().then((savedOporunidade) => res.status(200).send('ok'));
      })
      .catch((responseFromBlingError) => {
        console.log(responseFromBlingError);
        res.status(500).send('Error sendind data to Bling');
      });
  }
});
app.set('port', process.env.PORT || 3000);

module.exports = app;
