import setupGlobalLightningScript from '../lib/globalLightningScript';

const localeToUsabillaScriptId = {
  de: '0032174f2430',
  // eslint-disable-next-line camelcase
  en_GB: 'f287a454afa8',
  fr: 'dabd95657311',
  it: '1bbe51011fc9',
  pt: '7349a6c5b3d9',
  en: 'be2ba674e22a'
};

const loadSurvey = (options) => {
  const scriptId = localeToUsabillaScriptId[options.locale];

  if (scriptId) {
    setupGlobalLightningScript();
    // eslint-disable-next-line camelcase
    window.usabilla_live = window.lightningjs.require('usabilla_live', `//w.usabilla.com/${scriptId}.js`);
    window.usabilla_live('data', { custom: options });
  }
};

export default { loadSurvey };
