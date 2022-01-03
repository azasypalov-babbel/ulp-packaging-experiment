import jQuery from 'jquery';

import bootstrapTooltip from '../../vendor/js/bootstrap.tooltip';
import bootstrapPopover from '../../vendor/js/bootstrap.popover';
import bootstrapModal from '../../vendor/js/bootstrap.modal';
import bootstrapTransition from '../../vendor/js/bootstrap.transition';
import noUiSlider from '../../vendor/js/jquery.nouislider';

// These source files need to be required in this specific order,
// the learning.gem buster conf needs to follow the same order
const ORDERED_SOURCES = [
  './core/b3.js',
  './core/nameSpaces.js',
  './core/proxy.js',
  './core/template.js',
  './core/settings.js',
  './core/cookie.js',
  './core/topic.js',
  './core/keyboardEvents.js',
  './core/t.js',
  './core/textBox/actions/actions.js',
  './core/textBox/actions/dispatcher.js',
  './core/textBox/stores/EventEmitter.js',
  './core/textBox/stores/userSettingsStore.js'
];
const ANALYZER_SOURCES = [
  './analyserlib-constants.js',
  './analyserlib.js',
  './LiveAudioBufferView.js',
  './analyserlib-wrapper.js',
  './mediaDevicesPolyfill.js'
];

// all source files inside ./app
const textBoxComponentAll = require.context(
  '../../../b3/app/assets/learning/core/textBox/components/base',
  true, /\.js$/
);
const coreAll = require.context(
  '../../../b3/app/assets/learning/core',
  true, /\.js$/
);
const learningAll = require.context(
  '../../../b3/app/assets/learning',
  true, /\.js$/
);
const pageAll = require.context(
  '../../../b3/app/assets/learning/page',
  true, /\.js$/
);
const analyzerRequire = require.context(
  '../../../b3/vendor/assets/javascripts/analyserLib.js',
  true, /\.js$/
);

require('./handlebars-templates');

export default () => {
  bootstrapTooltip(jQuery);
  bootstrapPopover(jQuery);
  bootstrapTransition(jQuery);
  bootstrapModal(jQuery);
  noUiSlider(jQuery);

  ORDERED_SOURCES.forEach(learningAll);

  textBoxComponentAll.keys().forEach(textBoxComponentAll);
  coreAll.keys().forEach(coreAll);
  learningAll.keys().forEach(learningAll);
  pageAll.keys().forEach(pageAll);
  ANALYZER_SOURCES.forEach(analyzerRequire);
};
