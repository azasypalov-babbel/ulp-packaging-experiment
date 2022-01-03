const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { BASE_PATH, B3_PATH } = require('../paths');

const commonLessLoaderOptions = [
  { loader: 'css-loader' },
  { loader: 'less-loader',
    options: {
      lessOptions: {
        paths: [
          path.resolve(BASE_PATH, 'node_modules'),
          path.resolve(B3_PATH, 'app/assets/stylesheets')
        ]
      }
    }
  }
];

const extractLESSLoader = [
  MiniCssExtractPlugin.loader,
  ...commonLessLoaderOptions
];

const inlineLESSLoader = [{ loader: 'style-loader' }, ...commonLessLoaderOptions];

module.exports = (DEV) => DEV ? inlineLESSLoader : extractLESSLoader;
