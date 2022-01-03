const webpack = require('webpack');

module.exports = new webpack.EnvironmentPlugin({
  CAT_BASE_URL: 'https://cat.babbel.com',
  BUILD_COMMIT_HASH: '',
  ROLLBAR_CLIENT_ACCESS_TOKEN: '',
  WEBVIEW: ''
});
