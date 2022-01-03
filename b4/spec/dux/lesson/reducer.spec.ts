import reducer from '../../../src/dux/lesson/reducer';
import * as types from '../../../src/dux/lesson/types';
import { initLesson } from '../../../src/dux/lesson/actions';


const initialState = {
  lessonUuid: '',
  learningActivityId: '',
  data: undefined,
  loading: false,
  error: false
};

describe('lesson reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { type: 'dummy' })).toEqual(initialState);
  });

  test('should handle INIT_LESSON', () => {
    const action = initLesson({
      lessonUuid: '123',
      learningActivityId: '456'
    });

    expect(reducer(initialState, action)).toMatchObject({
      lessonUuid: '123',
      learningActivityId: '456'
    });
  });

  describe('COMPLETE_LESSON', () => {
    describe('COMPLETE_LESSON_PENDING', () => {
      const action = {
        type: 'LESSON/COMPLETE_LESSON_PENDING'
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: false
        });
      });
    });

    describe('COMPLETE_LESSON_FULFILLED', () => {
      const action = {
        type: 'LESSON/COMPLETE_LESSON_FULFILLED',
        payload: {}
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: false
        });
      });
    });

    describe('COMPLETE_LESSON_REJECTED', () => {
      const action = {
        type: 'LESSON/COMPLETE_LESSON_REJECTED'
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

  describe('FETCH_LESSON_DATA', () => {
    describe('when PENDING', () => {
      const action = {
        type: `${types.FETCH_LESSON_DATA}_PENDING`
      };

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: true
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: false
        });
      });
    });

    describe('when FULFILLED', () => {
      const action = {
        type: `${types.FETCH_LESSON_DATA}_FULFILLED`,
        payload: {
          lesson: {
            id: 'test',
            trainers: [{ type: 'foo' }]
          }
        }
      };

      test('updates the lesson data', () => {
        expect(reducer(initialState, action)).toMatchObject({
          data: {
            lesson: {
              id: 'test',
              trainers: [{ type: 'foo' }]
            }
          }
        });
      });

      test('should update loading state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          loading: false
        });
      });

      test('should reset error state', () => {
        expect(reducer(initialState, action)).toMatchObject({
          error: false
        });
      });
    });

    describe('when REJECTED', () => {
      const action = {
        type: `${types.FETCH_LESSON_DATA}_REJECTED`
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
