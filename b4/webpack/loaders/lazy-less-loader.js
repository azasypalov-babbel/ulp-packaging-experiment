const path = require('path');
const { BASE_PATH, B3_PATH } = require('../paths');

/**
 * Lazy loaded legacy styles should be added to the top of the head element
 * This function is not transpiled with babel, so must be es5 to work in IE11
 */

function insertAtTop(element) {
  var parent = document.querySelector('head');
  parent.insertBefore(element, parent.firstChild);
}

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

const inlineLESSLoader = [
  { loader: 'style-loader', options: { injectType: 'lazyStyleTag', insert: insertAtTop } },
  ...commonLessLoaderOptions
];

module.exports = () => inlineLESSLoader;
