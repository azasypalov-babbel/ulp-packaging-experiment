import { FETCH_NEXT_REVIEW_ITEMS, FETCH_INTERACTION_TYPES } from '../../../src/dux/review/types';
import * as sequenceActions from '../../../src/dux/sequence/actions';
import * as sequenceTypes from '../../../src/dux/sequence/types';
import * as reviewActions from '../../../src/dux/review/actions';
import * as reviewTypes from '../../../src/dux/review/types';
import reviewMiddleware from '../../../src/dux/review/middleware';
import { filterInteractionTypes } from '../../../src/dux/review/helpers';
import { isReview } from '../../../src/dux/session/selectors';
import { navigationService } from '../../../src/services';
import * as trainerItemsStrategy from '../../../src/lib/trainerItemsStrategy';

jest.spyOn(trainerItemsStrategy, 'mapTrainerTypeInteraction');
jest.spyOn(
  trainerItemsStrategy,
  'logIncorrectItemsToRollbar'
).mockImplementation(() => {});

jest.mock('../../../src/services/rollbarService', () => ({
  log: jest.fn()
}));

jest.mock('../../../src/services', () => ({
  navigationService: {
    assign: jest.fn()
  }
}));

jest.mock('../../../src/dux/sequence/actions', () => ({
  init: jest.fn(() => ({ type: 'mock-sequence-init-action-type' })),
  startSequence: jest.fn(() => ({ type: 'mock-sequence-start-action-type' }))
}));

jest.mock('../../../src/dux/review/actions', () => ({
  attemptItem: jest.fn(() => ({ type: 'mock-attempt-item-action-type' })),
  completeItem: jest.fn(() => ({ type: 'mock-complete-item-action-type' })),
  completeReview: jest.fn(() => ({ type: 'mock-complete-review-action-type' })),
  preparePurge: jest.fn(() => ({ type: 'mock-prepare-purge-action-type' })),
  fetchNextReviewItems: jest.fn(() => ({ type: 'mock-fetch-next-review-items' }))
}));

jest.mock('../../../src/dux/session/selectors', () => ({
  isReview: jest.fn(() => true)
}));

jest.mock('../../../src/dux/review/helpers', () => ({
  filterInteractionTypes: jest.fn((items) => items)
}));

const create = () => {
  const store = {
    getState: jest.fn(() => ({
      session: {
        myBaseUrl: 'mock-my-base-url'
      },
      sequence: {
        purgeLoopsCounter: 2
      },
      contentRelease: {
        data: {}
      }
    })),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => reviewMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Review Middleware', () => {
  describe('when not in review', () => {
    beforeEach(() => {
      isReview.mockImplementationOnce(() => false);
    });

    afterEach(() => {
      isReview.mockClear();
    });

    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: sequenceTypes.COMPLETE_SEQUENCE };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: sequenceTypes.COMPLETE_SEQUENCE };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('for UPDATE_INTERACTION action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: reviewTypes.UPDATE_INTERACTION,
        payload: 'speak'
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('fetches next review items', () => {
      const { store, invoke } = create();
      const action = {
        type: reviewTypes.UPDATE_INTERACTION,
        payload: 'speak'
      };

      invoke(action);

      expect(reviewActions.fetchNextReviewItems).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-fetch-next-review-items'
      });
    });

    describe('when interaction type is reset', () => {
      it('should not fetch next review items', () => {
        const { store, invoke } = create();
        const action = {
          type: reviewTypes.UPDATE_INTERACTION,
          payload: null
        };

        invoke(action);

        expect(reviewActions.fetchNextReviewItems).not.toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('for SEQUENCE/ATTEMPT_ITEM action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: sequenceTypes.ATTEMPT_ITEM,
        payload: {}
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('attempts item', () => {
      const { store, invoke } = create();
      const item = { id: 'mock-uuid-1' };
      const attempt = { mistakes: 2 };

      const action = {
        type: sequenceTypes.ATTEMPT_ITEM,
        payload: { item, attempt }
      };

      invoke(action);

      expect(reviewActions.attemptItem).toHaveBeenCalledWith(item, attempt);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-attempt-item-action-type'
      });
    });
  });

  describe('for SEQUENCE/COMPLETE_ITEM action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: sequenceTypes.COMPLETE_ITEM
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('completes item', () => {
      const { store, invoke } = create();
      const action = {
        type: sequenceTypes.COMPLETE_ITEM,
        payload: { item: { id: 'mock-uuid-1' }, mistakes: 2 }
      };

      invoke(action);

      expect(reviewActions.completeItem).toHaveBeenCalledWith({
        item: { id: 'mock-uuid-1' }, mistakes: 2
      });
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-complete-item-action-type'
      });
    });
  });

  describe('for a FETCH_INTERACTION_TYPES_FULFILLED action', () => {
    describe('when there are no items for review', () => {
      const action = {
        type: `${FETCH_INTERACTION_TYPES}_FULFILLED`,
        payload: []
      };

      it('redirects to review-manager', () => {
        const { invoke } = create();
        invoke(action);

        expect(navigationService.assign).toHaveBeenCalledWith('mock-my-base-url/review-manager');
      });
    });

    describe('when there are items for review', () => {
      it('passes through the action', () => {
        const { next, invoke } = create();
        const action = {
          type: `${FETCH_INTERACTION_TYPES}_FULFILLED`,
          payload: [{ id: 'write', count: 36 }]
        };

        invoke(action);

        expect(next).toHaveBeenCalledWith(action);
      });

      it('modifies action payload with filtered interactions', () => {
        filterInteractionTypes.mockImplementationOnce(() => ([{ id: 'mock-write' }]));

        const { next, invoke } = create();
        const action = {
          type: `${FETCH_INTERACTION_TYPES}_FULFILLED`,
          payload: [{ id: 'write', count: 36 }]
        };

        invoke(action);

        expect(filterInteractionTypes).toHaveBeenCalledWith([{ id: 'write', count: 36 }]);
        expect(next).toHaveBeenCalledWith({
          type: action.type,
          payload: [{ id: 'mock-write' }]
        });
      });
    });
  });

  describe('for a FETCH_NEXT_REVIEW_ITEMS_FULFILLED action', () => {
    const itemGroups = [{
      items: [{
        a: 1,
        b: 2
      }]
    }];

    describe('when the payload contains trainers', () => {
      const action = {
        type: `${FETCH_NEXT_REVIEW_ITEMS}_FULFILLED`,
        payload: {
          review_session: {
            trainers: [{ type: 'cube', item_groups: itemGroups }]
          }
        }
      };

      it('does not redirect to review-manager', () => {
        const { invoke } = create();
        invoke(action);

        expect(navigationService.assign).not.toHaveBeenCalled();
      });

      it('map wordorder trainers to vocabulary', () => {
        const { invoke } = create();
        invoke(action);

        expect(trainerItemsStrategy.mapTrainerTypeInteraction).toHaveBeenCalled();
      });

      it('inits sequence', () => {
        const { store, invoke } = create();

        invoke(action);

        expect(sequenceActions.init).toHaveBeenCalledWith([{ type: 'cube', item_groups: itemGroups }]);
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-sequence-init-action-type'
        });
      });

      it('starts sequence', () => {
        const { store, invoke } = create();

        invoke(action);

        expect(sequenceActions.startSequence).toHaveBeenCalledWith();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-sequence-start-action-type'
        });
      });
    });

    describe('when the payload contains no trainers', () => {
      const action = {
        type: `${FETCH_NEXT_REVIEW_ITEMS}_FULFILLED`,
        payload: {
          review_session: {
            trainers: []
          }
        }
      };

      it('redirects to review-manager', () => {
        const { invoke } = create();
        invoke(action);

        expect(navigationService.assign).toHaveBeenCalledWith('mock-my-base-url/review-manager');
      });
    });
  });

  describe('for SEQUENCE/COMPLETE_SEQUENCE action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: sequenceTypes.COMPLETE_SEQUENCE
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('completes review', () => {
      const { store, invoke } = create();
      const action = {
        type: sequenceTypes.COMPLETE_SEQUENCE
      };

      invoke(action);

      expect(reviewActions.completeReview).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-complete-review-action-type'
      });
    });
  });

  describe('for SEQUENCE/PREPARE_PURGE action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: sequenceTypes.PREPARE_PURGE
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('completes review', () => {
      const { store, invoke } = create();
      const action = {
        type: sequenceTypes.PREPARE_PURGE
      };

      invoke(action);

      expect(reviewActions.preparePurge).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-prepare-purge-action-type'
      });
    });
  });

  describe('for another action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
