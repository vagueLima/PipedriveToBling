const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let oportunidadeSchema = Schema({
  id_pipedrive: { type: Number, required: true },
  id_bling: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  currency: { type: String },
  PIPEDRIVE_URL: { type: String },
});

var Oportunidade = mongoose.model('Oportunidades', oportunidadeSchema);

module.exports = Oportunidade;
