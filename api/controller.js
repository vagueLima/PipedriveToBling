const { getDealsFromPipedrive, uploadDealToBling } = require('../deals/deals.js');
const Oportunidade = require('../models/oportunidade');

function getDealsByStatus(req, res) {
  const status = req.params.status;
  //if there is a status filter by it, if not return all deals
  const filterFunction = status ? (dealPipedrive) => dealPipedrive.status == status : null;
  getDealsFromPipedrive(filterFunction)
    .then((onlyWonDeals) => {
      res.status(200).json({ deals: onlyWonDeals });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Couldnt connect to pipedriver api' });
    });
}

function processPipedriveDealIntoBlingOportunidade(req, res) {
  let dealPipedrive = req.body.current;
  if (dealPipedrive.status !== 'won') {
    console.log('Deal was updated but its not won yet');
    res.status(200);
  } else {
    console.log('The deal is won!');
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
}

function AggregateOportunidadesByDayAndValue(req, res, next) {
  Oportunidade.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        totalAmount: { $sum: '$value' },
        count: { $sum: 1 },
      },
    },
  ]).then((oportunidades) => {
    res.status(200).json({ oportunidades });
  });
}
module.exports = {
  getDealsByStatus,
  processPipedriveDealIntoBlingOportunidade,
  AggregateOportunidadesByDayAndValue,
};
