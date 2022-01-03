import initRoutes from './initializers/routes';
import initGTag from './services/gtag';

import '@emartech/deep-link-web-tracker';
import 'web-animations-js';
import 'css.escape';

import 'assets/stylesheets/css-reset.css';
import '../../b3/app/assets/stylesheets/learning/b3.less';

import 'assets/stylesheets/loy-reset.css';
import 'assets/stylesheets/cascada/main.scss';

if (process.env.WEBVIEW) {
  require('assets/stylesheets/webview.css');
}

initGTag();

initRoutes();
