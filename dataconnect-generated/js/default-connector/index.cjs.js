const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'sb1-da6pxh',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

