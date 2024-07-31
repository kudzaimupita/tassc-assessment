const serverless = require('serverless-http');
const { app } = require('./src/app');

const proxy = serverless(app);

exports.handler = proxy;
