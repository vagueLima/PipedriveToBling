const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let oportunidadeSchema = Schema({
  id_pipedrive: { type: Number, required: true },
  id_bling: { type: Number, required: true },
  added: { type: Date, default: new Date('<YYYY-mm-dd>') },
  createdAt: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  description: { type: String },
});

var Oportunidade = mongoose.model('Oportunidades', oportunidadeSchema);

module.exports = Oportunidade;
