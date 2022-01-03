import { NativeBridge } from '../lib/nativeBridge';
import { log } from '../lib/logging';

const BRIDGE_NAME = 'review';
const BRIDGE_METHODS = {
  ITEM_COMPLETE: 'ITEM_COMPLETE',
  COMPLETE: 'COMPLETE',
  ABORT: 'ABORT'
};
export const BRIDGE_EVENTS = {};

class NativeReviewService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  // Should have same interface as getReviewTypes src/services/reviewService.js
  // eslint-disable-next-line no-unused-vars
  getReviewTypes({ learnLanguageAlpha3, locale, params }) {
    const data = this.getStatic();
    log('nativeReviewService#getReviewTypes');
    return Promise.resolve(data.interaction_types);
  }

  // Should have same interface as getReviewItems src/services/reviewService.js
  // eslint-disable-next-line no-unused-vars
  getReviewItems({ learnLanguageAlpha3, locale, params }) {
    const data = this.getStatic();
    const response = { review_session: data.review_session };
    log('nativeReviewService#getReviewItems');
    return Promise.resolve(response);
  }

  // Should have same interface as updateVocabularyItems src/services/reviewService.js
  updateVocabularyItems({ locale, learnLanguageAlpha3, vocabularyItems }) {
    log('nativeReviewService#updateVocabularyItems');
    this.postMessage(BRIDGE_METHODS.ITEM_COMPLETE, {
      locale,
      learnLanguageAlpha3,
      items: vocabularyItems
    });
    return Promise.resolve();
  }

  // Additional interface methods for webview implementation

  postReviewCompleted() {
    log('nativeReviewService#postReviewCompleted');
    this.postMessage(BRIDGE_METHODS.COMPLETE);
    return Promise.resolve();
  }

  postReviewAborted() {
    log('nativeReviewService#postReviewAborted');
    this.postMessage(BRIDGE_METHODS.ABORT);
    return Promise.resolve();
  }
}

export default new NativeReviewService();
