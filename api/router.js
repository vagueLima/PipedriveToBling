const express = require('express');
const router = express.Router();
const {
  getDealsByStatus,
  processPipedriveDealIntoBlingOportunidade,
  AggregateOportunidadesByDayAndValue,
} = require('./controller');

router.get('/deals/:status', getDealsByStatus);
router.post('/deals', processPipedriveDealIntoBlingOportunidade);
router.get('/oportunidades', AggregateOportunidadesByDayAndValue);

module.exports = router;
