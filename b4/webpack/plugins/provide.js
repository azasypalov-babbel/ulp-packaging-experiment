const webpack = require('webpack');
const path = require('path');

const { BASE_PATH, B3_PATH } = require('../paths');

// use relative path to modules
// so webpack can resolve them from the top level node_modules
module.exports = new webpack.ProvidePlugin({
  $: path.resolve(BASE_PATH, 'node_modules/jquery'),
  jQuery: path.resolve(BASE_PATH, 'node_modules/jquery'),
  _: path.resolve(BASE_PATH, 'node_modules/underscore'),
  Handlebars: [path.resolve(BASE_PATH, 'node_modules/handlebars/dist/cjs/handlebars.js'), 'default'],
  Flux: path.resolve(BASE_PATH, 'node_modules/flux/dist/Flux.js'),
  Fsm: path.resolve(BASE_PATH, 'node_modules/fsm.js/fsm.js'),
  EventEmitter: path.resolve(B3_PATH, 'vendor/assets/javascripts/emitter/emitter.js'),
  buzz: path.resolve(B3_PATH, 'vendor/assets/javascripts/buzz/buzz.js')
});
