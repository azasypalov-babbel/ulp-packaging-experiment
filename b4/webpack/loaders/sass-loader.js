const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonSassLoaderOptions = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2
    }
  },
  { loader: 'postcss-loader' },
  { loader: 'sass-loader' }
];

const extractSASSLoader = [
  MiniCssExtractPlugin.loader,
  ...commonSassLoaderOptions
];

const inlineSASSLoader = [{ loader: 'style-loader' }, ...commonSassLoaderOptions];

module.exports = (DEV) => DEV ? inlineSASSLoader : extractSASSLoader;
