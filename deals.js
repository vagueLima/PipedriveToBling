const axios = require('axios');
const PIPEDRIVER_API_URL = process.env.PIPEDRIVER_API_URL;
const PIPEDRIVER_TOKEN = process.env.PIPEDRIVE_TOKEN;

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

module.exports = { getDeals };
