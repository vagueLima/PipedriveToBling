const { getDealsFromPipedrive, uploadDealToBling } = require('../deals/deals.js');
const Oportunidade = require('../models/oportunidade');
const PIPEDRIVER_API_URL = process.env.PIPEDRIVER_API_URL;

function getDealsByStatus(req, res) {
  const status = req.params.status;
  //if there is a status filter by it, if not return all deals
  const filterFunction = status ? (dealPipedrive) => dealPipedrive.status == status : null;
  getDealsFromPipedrive(filterFunction)
    .then((onlyWonDeals) => {
      res.status(200).json({ deals: onlyWonDeals });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Couldnt connect to pipedrive api' });
    });
}

function processPipedriveDealIntoBlingOportunidade(req, res) {
  let dealPipedrive = req.body.current;
  if (dealPipedrive.status !== 'won') {
    res.status(200).send("'Deal was updated but its not won yet'");
  } else {
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
          PIPEDRIVE_URL: PIPEDRIVER_API_URL,
        });
        newOportunidade
          .save()
          .then((savedOporunidade) => res.status(200).send('ok'))
          .catch((err) => {
            res.status(500).send('Problem saving oportunidade in the database');
          });
      })
      .catch((err) => {
        if (err.data && err.data.retorno.erro && err.data.retorno.erros[0].erro.cod === 30) {
          //this is needed because if the webhook awnsers with 5xx, Pipedriver will keep re-trying
          res.status(202).send('This deal is already in Bling');
        } else if (err.data && err.data.retorno.erro) {
          res.status(202).send('Unknown error in Bling');
        } else {
          res.status(202).send('Couldnt send data to Bling');
        }
      });
  }
}
function sortByDate(oportunidade1, oportunidade2) {
  if (oportunidade1.dia > oportunidade2.dia) return -1;
  if (oportunidade1.dia > oportunidade2.dia) return 1;

  return 0;
}
function AggregateOportunidadesByDayAndValue(req, res, next) {
  try {
    Oportunidade.aggregate([
      { $match: { PIPEDRIVE_URL: PIPEDRIVER_API_URL } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalAmount: { $sum: '$value' },
          pedidos: { $sum: 1 },
        },
      },
    ]).then((oportunidades) => {
      oportunidades = oportunidades
        .map((oportunidade) => {
          return {
            dia: new Date(
              `${oportunidade._id.month}/${oportunidade._id.day}/${oportunidade._id.year}`
            ),
            total: oportunidade.totalAmount,
            pedidos: oportunidade.pedidos,
          };
        })
        .sort(sortByDate);
      res.status(200).json({ oportunidades });
    });
  } catch (err) {
    res.status(500).json({ error: 'Problem getting data from Database' });
  }
}
module.exports = {
  getDealsByStatus,
  processPipedriveDealIntoBlingOportunidade,
  AggregateOportunidadesByDayAndValue,
};
