const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  openAnalyzer: false,
  generateStatsFile: true
});
