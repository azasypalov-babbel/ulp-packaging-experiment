import reducer from '../../../src/dux/sequence/reducer';
import * as types from '../../../src/dux/sequence/types';
import prepareTrainersForPurge from '../../../src/lib/purgeFormatters/prepareTrainersForPurge';

jest.mock('../../../src/lib/purgeFormatters/prepareTrainersForPurge');

prepareTrainersForPurge.mockImplementation((trainers) => trainers);

const initialState = {
  trainers: [],
  currentTrainerIndex: null,
  purgeLoopsCounter: 0,
  started: false,
  completed: false
};

const trainer = { item_groups: [{ items: [{}] }] };
const trainerWithAttempts = { item_groups: [{ items: [{ attempt: {} }] }] };
const otherTrainer = { item_groups: [{ items: [{}] }] };
const otherTrainerWithAttempts = { item_groups: [{ items: [{ attempt: {} }] }] };

describe('sequence reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('INIT', () => {
    test('resets trainers, currentTrainerIndex and purgeLoopsCounter', () => {
      const state = {
        currentTrainerIndex: 1,
        trainers: [{}],
        purgeLoopsCounter: 2
      };

      const action = {
        type: types.INIT,
        payload: { trainers: [trainer, otherTrainer] }
      };

      expect(reducer(state, action)).toMatchObject({
        trainers: [trainer, otherTrainer],
        currentTrainerIndex: null,
        purgeLoopsCounter: 1
      });
    });
  });

  describe('START_SEQUENCE', () => {
    test('resets started and completed flags', () => {
      const state = {
        started: false,
        completed: true
      };

      const action = {
        type: types.START_SEQUENCE
      };

      expect(reducer(state, action)).toMatchObject({
        started: true,
        completed: false
      });
    });
  });

  describe('NAVIGATE', () => {
    test('updates currentTrainerIndex', () => {
      const state = {
        currentTrainerIndex: null,
        trainers: [trainer, otherTrainer]
      };

      const action = {
        type: types.NAVIGATE,
        payload: { trainerIndex: 1 }
      };

      expect(reducer(state, action)).toMatchObject({
        currentTrainerIndex: 1,
        trainers: [trainer, otherTrainer]
      });
    });
  });

  describe('START_TRAINER', () => {
    test('marks the trainer as started and removes subsequent attempts', () => {
      const state = {
        currentTrainerIndex: 0,
        completed: true,
        trainers: [trainerWithAttempts, otherTrainerWithAttempts]
      };

      const action = {
        type: types.START_TRAINER
      };

      expect(reducer(state, action)).toMatchObject({
        currentTrainerIndex: 0,
        trainers: [{ ...trainer, started: true, completed: false }, otherTrainer]
      });
    });
  });

  describe('COMPLETE_TRAINER', () => {
    test('marks trainer as completed and does not update currentTrainerIndex', () => {
      const state = {
        currentTrainerIndex: 1,
        trainers: [trainer, otherTrainer]
      };

      const action = {
        type: types.COMPLETE_TRAINER
      };

      expect(reducer(state, action)).toMatchObject({
        currentTrainerIndex: 1,
        trainers: [otherTrainer, { completed: true }]
      });
    });
  });

  describe('PREPARE_PURGE', () => {
    const action = {
      type: types.PREPARE_PURGE
    };

    test('should apply purge rules', () => {
      const state = {
        currentTrainerIndex: 1,
        trainers: [trainer, otherTrainer]
      };

      reducer(state, action);
      expect(prepareTrainersForPurge).toHaveBeenCalledWith(state.trainers);
    });

    test('resets current trainer index', () => {
      const state = {
        currentTrainerIndex: 1,
        trainers: [trainer, otherTrainer]
      };

      const { currentTrainerIndex } = reducer(state, action);
      expect(currentTrainerIndex).toEqual(null);
    });
  });
});
