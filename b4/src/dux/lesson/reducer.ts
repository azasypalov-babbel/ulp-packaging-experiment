import { AnyAction } from 'redux';
import * as types from './types';
import { ApiContentSharedModelsV2RemoteLessonYml as LessonV2 } from "../../../@types/babbel.apigateway";

interface ILessonState {
  lessonUuid: string;
  learningActivityId: string;
  loading: boolean;
  error: boolean;
  data: LessonV2 | undefined;
}

const initialState: ILessonState = {
  lessonUuid: '',
  learningActivityId: '',
  loading: false,
  error: false,
  data: undefined
};

export default function reducer(state = initialState, action: AnyAction): ILessonState {
  switch (action.type) {
    case types.INIT_LESSON: {
      const { lessonUuid, learningActivityId } = action.payload;

      return {
        ...state,
        lessonUuid,
        learningActivityId
      };
    }

    case `${types.COMPLETE_LESSON}_PENDING`: {
      return { ...state, loading: true, error: false };
    }

    case `${types.COMPLETE_LESSON}_FULFILLED`: {
      return { ...state, loading: false, error: false };
    }

    case `${types.COMPLETE_LESSON}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    case `${types.FETCH_LESSON_DATA}_PENDING`: {
      return { ...state, loading: true, error: false };
    }

    case `${types.FETCH_LESSON_DATA}_FULFILLED`: {
      return { ...state, data: action.payload, loading: false, error: false };
    }

    case `${types.FETCH_LESSON_DATA}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    default: {
      return state;
    }
  }
}
