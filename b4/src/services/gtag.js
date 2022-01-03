import { getMyEnv } from '@lessonnine/my.js';

const STAGING_TRACKING_ID = 'UA-2220720-10';
const PROD_TRACKING_ID = 'UA-2220720-11';

function loadScript(scriptId, trackingId) {
  const { head } = document;
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  head.insertBefore(script, head.firstChild);
}

function initDataLayer(trackingId) {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', trackingId);
}

export default function initGTag() {
  const scriptId = 'ga-gtag';
  if (document.getElementById(scriptId)) return;

  const { environment } = getMyEnv();
  const trackingId = environment === 'staging' ? STAGING_TRACKING_ID : PROD_TRACKING_ID;

  loadScript(scriptId, trackingId);
  initDataLayer(trackingId);
}
