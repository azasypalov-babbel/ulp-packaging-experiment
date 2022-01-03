const path = require('path');

const BASE_PATH = path.resolve(__dirname, '..');
const WORKSPACE_PATH = path.resolve(__dirname, '../..');

const B3_PATH = path.join(WORKSPACE_PATH, 'b3');
const PUBLIC_PATH = path.join(WORKSPACE_PATH, 'public');

module.exports = {
  BASE_PATH,
  B3_PATH,
  PUBLIC_PATH,
  WORKSPACE_PATH
}
