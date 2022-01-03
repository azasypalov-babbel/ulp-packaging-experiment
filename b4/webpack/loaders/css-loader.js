const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const inlineCSSLoader = [
  {
    loader: 'style-loader',
    // reuse <style> tag for all inline CSS
    options: { injectType: 'singletonStyleTag' }
  },
  { loader: 'css-loader' }
];

const extractCSSLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader'
];

module.exports = (DEV) => DEV ? inlineCSSLoader : extractCSSLoader;
