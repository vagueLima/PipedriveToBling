const axios = require('axios');
const PIPEDRIVER_API_URL = process.env.PIPEDRIVER_API_URL;
const PIPEDRIVER_TOKEN = process.env.PIPEDRIVE_TOKEN;
const BLING_API_URL = process.env.BLING_API_URL;
const BLING_TOKEN = process.env.BLING_TOKEN;
const builder = require('xmlbuilder');
const qs = require('qs');

async function getDeals(filterFunction = null) {
  let responseFromPipeDriver = await axios.get(`${PIPEDRIVER_API_URL}/deals`, {
    params: { api_token: PIPEDRIVER_TOKEN },
  });
  let allDeals = responseFromPipeDriver.data.data;
  if (filterFunction) {
    return allDeals.filter(filterFunction);
  } else {
    return allDeals;
  }
}
function jsonToXML(jsonPayload) {
  let payloadToBlingXML = builder.create('root');
  payloadToBlingXML
    .ele('pedido')
    .ele('cliente')
    .txt(jsonPayload.pedido.cliente.nome)
    .up()
    .ele('itens')
    .ele('item')
    .ele('descricao')
    .txt(jsonPayload.pedido.itens[0].descricao)
    .up()
    .ele('vlr_unit')
    .txt(jsonPayload.pedido.itens[0].vlr_unit)
    .up()
    .ele('codigo')
    .txt(jsonPayload.pedido.itens[0].codigo);
  return payloadToBlingXML.toString();
}
async function uploadDealToBling(jsonPayload) {
  const data = { xml: jsonToXML(jsonPayload), apikey: BLING_TOKEN };
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url: BLING_API_URL,
  };
  responseFromBling = await axios(options);
  if (responseFromBling.data.retorno.erros) {
    throw responseFromBling;
  }
  return responseFromBling.data.retorno.pedidos[0].pedido;
}
module.exports = { getDeals, uploadDealToBling };
