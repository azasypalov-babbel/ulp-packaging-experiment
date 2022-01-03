'use strict';

require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');
const { PUBLIC_PATH } = require('./paths');

const baseConfig = require('./base.config');
const { merge } = require('webpack-merge');
const setupAwsSessionProxy = require('@lessonnine/my.js/setupAwsSessionProxy');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const LOCALE = process.env.BABBEL_LOCALE || 'en';
const UUID = process.env.BABBEL_UUID || 'YOUR_UUID';

const DEFAULT_DATA = require('../src/demo/data/lesson/default.json');
const DATA_PATH = process.env.DATA_PATH ? path.join(__dirname, '..', process.env.DATA_PATH) : null;
// Extend default data:
const DATA = DATA_PATH ? { ...DEFAULT_DATA, ...require(DATA_PATH) } : DEFAULT_DATA;

const setupRedirectToDemoPage = (app) => {
  app.get('/', function(req, res) {
    res.redirect('/en/lesson-player/DEU/demo');
  });
};

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    path: PUBLIC_PATH,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  plugins: [
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html.ejs',
      publicPath: '/',
      locale: LOCALE,
      uuid: UUID,
      data: DATA
    })
  ],
  devServer: {
    hot: true,
    port: PORT,
    host: HOST,
    devMiddleware: {
      publicPath: '/',
      stats: { colors: true }
    },
    historyApiFallback: true,
    onBeforeSetupMiddleware: (devServer) => {
      const { BABBEL_EMAIL, BABBEL_PASSWORD } = process.env;

      if (BABBEL_EMAIL && BABBEL_PASSWORD) {
        setupAwsSessionProxy({
          username: BABBEL_EMAIL,
          password: BABBEL_PASSWORD
        })(devServer.app, devServer.server);
      }

      setupRedirectToDemoPage(devServer.app);
    }
  }
});
