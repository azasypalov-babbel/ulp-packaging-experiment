import reducer from '../../../src/dux/review/reducer';
import * as types from '../../../src/dux/review/types';
import * as trainerItemsStrategy from '../../../src/lib/trainerItemsStrategy';

const initialState = {
  reviewItems: {
    nextParams: {
      offset: 0
    },
    reviewSession: {}
  },
  interactionTypes: [],
  selectedInteraction: null,
  reviewLoopsCounter: 0,
  hasNextReviewItems: false,
  loading: null,
  error: null
};

describe('review reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  test('should handle UPDATE_INTERACTION', () => {
    const selectedInteraction = 'write';
    const state = { selectedInteraction: null };

    const action = {
      type: types.UPDATE_INTERACTION,
      payload: 'write'
    };

    expect(reducer(state, action).selectedInteraction)
      .toEqual(selectedInteraction);
  });

  describe('FETCH_NEXT_REVIEW_ITEMS', () => {
    describe('when PENDING', () => {
      const action = {
        type: `${types.FETCH_NEXT_REVIEW_ITEMS}_PENDING`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('when FULFILLED', () => {
      test('updates the state with transformed trainers', () => {
        const trainers = [{ type: 'foo' }];
        const transformedTrainers = [{ type: 'bar' }];

        const reviewSession = {
          trainers: trainers
        };
        const meta = {
          remaining_item_count: 5
        };
        const nextParams = {
          next: {
            filter: 'search',
            interaction_type: 'write',
            knowledge_level: 2,
            limit: 50,
            offset: 50,
            package_id: 'd897fa8e9f1279ad5dce8c3f9286f429',
            q: 'test'
          }
        };

        const action = {
          type: `${types.FETCH_NEXT_REVIEW_ITEMS}_FULFILLED`,
          payload: {
            review_session: reviewSession,
            _params: nextParams,
            _meta: meta
          }
        };

        const spy = jest.spyOn(trainerItemsStrategy, 'applyReviewTrainersStrategy');
        spy.mockImplementation(() => transformedTrainers);

        expect(reducer(initialState, action)).toMatchObject({
          reviewItems: {
            nextParams: nextParams.next,
            remainingItemCount: meta.remaining_item_count,
            reviewSession: {
              trainers: transformedTrainers
            }
          }
        });

        expect(spy).toHaveBeenCalledWith(action.payload.review_session.trainers);
      });
    });

    describe('when REJECTED', () => {
      const action = {
        type: `${types.FETCH_NEXT_REVIEW_ITEMS}_REJECTED`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should udpate error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: true
        });
      });
    });
  });

  describe('FETCH_INTERACTION_TYPES', () => {
    describe('FETCH_INTERACTION_TYPES_PENDING', () => {
      const action = {
        type: `${types.FETCH_INTERACTION_TYPES}_PENDING`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('FETCH_INTERACTION_TYPES_FULFILLED', () => {
      const action = {
        type: `${types.FETCH_INTERACTION_TYPES}_FULFILLED`,
        payload: [
          { id: 'flashcard', count: 36 },
          { id: 'speak', count: 36 },
          { id: 'write', count: 36 }
        ]
      };

      test('should handle FETCH_INTERACTION_TYPES_FULFILLED', () => {
        expect(reducer(initialState, action).interactionTypes).toEqual([
          { id: 'flashcard', count: 36 },
          { id: 'speak', count: 36 },
          { id: 'write', count: 36 }
        ]);
      });

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('FETCH_INTERACTION_TYPES_REJECTED', () => {
      const action = {
        type: `${types.FETCH_INTERACTION_TYPES}_REJECTED`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should update error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: true
        });
      });
    });
  });

  describe('SET_HAS_NEXT_REVIEW_ITEMS', () => {
    describe('SET_HAS_NEXT_REVIEW_ITEMS_PENDING', () => {
      const action = {
        type: `${types.SET_HAS_NEXT_REVIEW_ITEMS}_PENDING`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('SET_HAS_NEXT_REVIEW_ITEMS_FULFILLED', () => {
      const action = {
        type: `${types.SET_HAS_NEXT_REVIEW_ITEMS}_FULFILLED`,
        payload: true
      };

      test('should set hasNextReviewItems from payload', () => {
        expect(reducer(initialState, action)).toMatchObject({
          hasNextReviewItems: true
        });
      });

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('SET_HAS_NEXT_REVIEW_ITEMS_REJECTED', () => {
      const action = {
        type: `${types.SET_HAS_NEXT_REVIEW_ITEMS}_REJECTED`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should update error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: true
        });
      });
    });
  });

  describe('COMPLETE_REVIEW', () => {
    describe('COMPLETE_REVIEW_PENDING', () => {
      const action = {
        type: `${types.COMPLETE_REVIEW}_PENDING`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('COMPLETE_REVIEW_FULFILLED', () => {
      const action = {
        type: `${types.COMPLETE_REVIEW}_FULFILLED`,
        payload: {}
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: null
        });
      });
    });

    describe('COMPLETE_REVIEW_REJECTED', () => {
      const action = {
        type: `${types.COMPLETE_REVIEW}_REJECTED`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should update error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: true
        });
      });
    });
  });
});
