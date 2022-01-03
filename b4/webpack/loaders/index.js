const DEV = (process.env.NODE_ENV === 'development');

module.exports = {
  lessLoader: require('./less-loader')(DEV),
  lazyLessLoader: require('./lazy-less-loader')(DEV),
  cssLoader: require('./css-loader')(DEV),
  sassLoader: require('./sass-loader')(DEV)
};
