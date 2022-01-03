const isEnabled = (process.env.BUNDLE_STATS === '1');

const plugins = [];

plugins.push(require('./provide'));

plugins.push(require('./environment'));

if (isEnabled) {
  plugins.push(require('./bundleAnalyzer'));
}

module.exports = plugins;
