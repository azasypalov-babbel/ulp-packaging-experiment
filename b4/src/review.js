import { getMyEnv } from '@lessonnine/my.js';

import components from './components';
import session from './dux/session';
import review from './dux/review';

import services from './services';

export const startReview = ({ locale, learnLanguageAlpha3, isSearch, returnUrl, selectedInteraction }) => {
  const { client, myBaseUrl } = getMyEnv();
  const reviewType = isSearch === 'true' ? 'REVIEW_SEARCH' : 'REVIEW_DUE';

  const { translationService } = services;
  translationService.init({ locale });

  session().actions.initSession({
    type: reviewType,
    locale,
    learnLanguageAlpha3,
    returnUrl,
    myBaseUrl,
    client: { ...(client || {}), userAgent: window.navigator.userAgent }
  });

  if (selectedInteraction) {
    review().actions.updateInteraction(selectedInteraction);
  }

  document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
    const node = document.querySelector('[data-main]');

    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

    components.mount('ReviewApp', {}, node);
  });
};
