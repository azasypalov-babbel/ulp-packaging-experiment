// mappings to keys used in preview service in cat
import { log } from '../lib/logging';

const CAT_PREVIEW_LESSON_DATA = 'get_trainer_data';
const CAT_PREVIEW_REVIEW_DATA = 'get_review_items_data';

const getDataFromCat = (previewDataKey, receivedMessage) => {
  const PREVIEW_DOMAIN = process.env.CAT_BASE_URL;

  return new Promise((resolve) => {
    window.addEventListener('message', function handleMessage(event) {
      if (
        event.origin !== PREVIEW_DOMAIN ||
        typeof event.data === 'string' ||
        event.data.id !== previewDataKey
      ) return;

      const previewData = JSON.parse(event.data.payload);
      const substitutions = JSON.parse(event.data.substitutions);
      log(receivedMessage, previewData);

      window.removeEventListener('message', handleMessage);
      resolve({ previewData, substitutions });
    }, false);

    window.opener.postMessage(previewDataKey, PREVIEW_DOMAIN);
  });
};

export {
  CAT_PREVIEW_LESSON_DATA,
  CAT_PREVIEW_REVIEW_DATA,
  getDataFromCat
};
