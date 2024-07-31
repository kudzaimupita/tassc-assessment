const serverless = require('serverless-http');
const mongoose = require('mongoose');
const { app } = require('./src/app');
const logger = require('./src/config/logger');
const config = require('./src/config/config');

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error(err);
  });
const proxy = serverless(app);

exports.handler = proxy;
