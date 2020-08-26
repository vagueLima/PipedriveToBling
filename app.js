require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = require('./api/router');
const morgan = require('morgan');
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

const MONGO_URL = process.env.MONGO_URL.replace('<password>', MONGO_PASSWORD).replace(
  '<dbname>',
  MONGO_DATABASE
);
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(router);
app.set('port', process.env.PORT || 3000);

module.exports = app;
