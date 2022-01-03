import cookies from './cookies';
const { setCookie, getCookies } = cookies;

let featureStore = {};

const defaultAllowedFeatures = [
  'is_demo',
  'is_redux_logger',
  'is_redux_devtools',
  'is_unlocked',
  'is_cat_preview',
  'is_analyzer_lib_recognizer',
  'is_b3_vocabulary_trainer',
  'is_web_speech_mock',
  'is_native_speech',
  'is_verbose_logging',
  'is_transliteration',
  'is_fake_caret',
  'is_selection_helper',
  'is_puzzle_helper',
  'is_debug',
  'is_refer_a_friend',
  'is_zendesk'
];

const defaultNonPersistentFeatures = [
  'is_demo',
  'is_analyzer_lib_recognizer',
  'is_b3_vocabulary_trainer',
  'is_fake_caret',
  'is_selection_helper',
  'is_puzzle_helper',
  'is_zendesk'
];

function filterFeatures(features, allowedFeatures) {
  const filteredFeatures = {};
  Object.keys(features).forEach(function(key) {
    if (allowedFeatures.includes(key) && (features[key] === 'on' || features[key] === 'off')) {
      filteredFeatures[key] = features[key];
    }
  });
  return filteredFeatures;
}

function filterPersistentFeatures(features, nonPersistentFeatures) {
  const filteredFeatures = {};
  Object.keys(features).forEach(function(key) {
    if (!nonPersistentFeatures.includes(key)) {
      filteredFeatures[key] = features[key];
    }
  });
  return filteredFeatures;
}

export function configure(
  features,
  allowedFeatures = defaultAllowedFeatures,
  nonPersistentFeatures = defaultNonPersistentFeatures
) {
  featureStore = filterFeatures(features, allowedFeatures);

  const persistantFeatures = filterPersistentFeatures(
    filterFeatures(getCookies(), allowedFeatures),
    nonPersistentFeatures
  );

  Object.entries(persistantFeatures)
    .forEach(function([key, value]) {
      if (!(key in featureStore)) {
        featureStore[key] = value;
      }
    });

  const expiryDate = new Date();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  expiryDate.setTime(expiryDate.getTime() + oneYearMs);

  Object.entries(filterPersistentFeatures(featureStore, nonPersistentFeatures))
    .forEach(function([key, value]) {
      setCookie(key, value, expiryDate);
    });
}

export function get(featureName) {
  if (featureStore[featureName] === 'on') {
    return true;
  } else if (featureStore[featureName] === 'off') {
    return false;
  } else {
    return null;
  }
}

export function getActiveFeatures() {
  return Object.keys(featureStore)
    .filter((key) => featureStore[key] === 'on');
}

export function isWebview() {
  return process.env.WEBVIEW === '1';
}

export function isAndroid() {
  return (
    isWebview()
    && typeof window.androidListener?.postMessage === 'function'
  );
}

export function isiOS() {
  return (
    isWebview() &&
    typeof window.webkit?.messageHandlers?.iosListener?.postMessage === 'function'
  );
}
