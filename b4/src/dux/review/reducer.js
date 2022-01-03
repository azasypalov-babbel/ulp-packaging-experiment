import * as types from './types';
import { applyReviewTrainersStrategy } from '../../lib/trainerItemsStrategy';

const initialState = {
  reviewItems: {
    nextParams: {
      offset: 0
    },
    reviewSession: {}
  },
  interactionTypes: [],
  selectedInteraction: null,
  hasNextReviewItems: false,
  reviewLoopsCounter: 0,
  loading: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_INTERACTION_TYPES}_PENDING`: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case `${types.FETCH_INTERACTION_TYPES}_FULFILLED`: {
      return {
        ...state,
        loading: false,
        error: null,
        interactionTypes: action.payload
      };
    }

    case `${types.FETCH_INTERACTION_TYPES}_REJECTED`: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case types.UPDATE_INTERACTION: {
      return {
        ...state,
        selectedInteraction: action.payload
      };
    }

    case `${types.FETCH_NEXT_REVIEW_ITEMS}_PENDING`: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case `${types.FETCH_NEXT_REVIEW_ITEMS}_FULFILLED`: {
      const reviewSession = action.payload.review_session;
      const meta = action.payload['_meta'];
      const params = action.payload['_params'];

      return {
        ...state,
        loading: false,
        error: null,
        reviewLoopsCounter: state.reviewLoopsCounter + 1,
        reviewItems: {
          ...state.reviewItems,
          nextParams: (params && params.next) ? params.next : {},
          remainingItemCount: meta && meta.remaining_item_count,
          reviewSession: {
            trainers: applyReviewTrainersStrategy(reviewSession.trainers)
          }
        }
      };
    }

    case `${types.FETCH_NEXT_REVIEW_ITEMS}_REJECTED`: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case `${types.SET_HAS_NEXT_REVIEW_ITEMS}_PENDING`: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case `${types.SET_HAS_NEXT_REVIEW_ITEMS}_FULFILLED`: {
      const hasNextReviewItems = action.payload;
      return {
        ...state,
        loading: false,
        hasNextReviewItems
      };
    }

    case `${types.SET_HAS_NEXT_REVIEW_ITEMS}_REJECTED`: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case `${types.COMPLETE_REVIEW}_PENDING`: {
      return { ...state, loading: true, error: null };
    }

    case `${types.COMPLETE_REVIEW}_FULFILLED`: {
      return { ...state, loading: false, error: null };
    }

    case `${types.COMPLETE_REVIEW}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    default: {
      return state;
    }
  }
}
