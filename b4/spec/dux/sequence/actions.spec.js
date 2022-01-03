import mockStore from '../mockStore';
import * as sequenceActions from '../../../src/dux/sequence/actions';
import * as sequenceSelectors from '../../../src/dux/sequence/selectors';
import * as trackingActions from '../../../src/dux/tracker/actions';

jest.mock('../../../src/dux/session/selectors');

jest.mock('../../../src/dux/lesson/actions', () => ({
  completeItem: jest.fn(() => 'lesson.actions.completeItem'),
  reset: jest.fn(() => 'lesson.actions.reset'),
  preparePurge: jest.fn(() => ({ type: 'lesson.actions.preparePurge' }))
}));

jest.mock('../../../src/dux/review/actions', () => ({
  preparePurge: jest.fn(() => ({ type: 'review.actions.preparePurge' }))
}));

jest.spyOn(trackingActions, 'track');

jest.mock('../../../src/dux/tracker/events/lesson', () => ({
  lessonTrainerItemAttemptedEvent: jest.fn().mockReturnValue({
    event: 'lesson:trainer_item:attempted',
    payload: { lesson: 'trainer-item-attemped-payload' }
  })
}));

jest.mock('../../../src/dux/tracker/events/lessonSession', () => ({
  lessonSessionTrainerStartedEvent: jest.fn().mockReturnValue({ event: 'lesson_session:trainer:started' }),
  lessonSessionTrainerFinishedEvent: jest.fn().mockReturnValue({ event: 'lesson_session:trainer:finished' })
}));

jest.mock('../../../src/dux/sequence/selectors', () => ({
  itemsInCurrentTrainer: jest.fn().mockReturnValue([{
    id: '1',
    type: 'task',
    learn_language_text: 'example',
    display_language_text: 'esempio'
  }]),
  currentTrainer: jest.fn().mockReturnValue({
    type: 'mock-trainer-type'
  })
}));

describe('sequence actions', () => {
  const dispatchMock = jest.fn();
  const getStateMock = jest.fn(() => ({ session: {} }));

  afterEach(() => {
    dispatchMock.mockClear();
    jest.clearAllMocks();
  });

  describe('attemptItem', () => {
    const item = {
      id: '1'
    };
    const attempt = {
      number: 1,
      solved: true,
      text: 'attempt_text',
      targetText: 'attempt_text'
    };
    const trainerData = {
      trainer: 'data'
    };

    beforeEach(() => {
      sequenceSelectors.itemsInCurrentTrainer.mockReturnValueOnce([item]);
    });

    test('dispatches ATTEMPT_ITEM', () => {
      sequenceActions.attemptItem(item, attempt, trainerData)(dispatchMock, getStateMock);

      expect(dispatchMock.mock.calls).toEqual([
        [{
          type: 'SEQUENCE/ATTEMPT_ITEM',
          payload: { item, attempt, trainerData }
        }]
      ]);
    });
  });

  describe('completeItem', () => {
    test('dispatches COMPLETE_ITEM action', () => {
      const item = { id: 'abc' };
      const mistakes = 2;
      sequenceActions.completeItem(item, mistakes)(dispatchMock, getStateMock);

      expect(dispatchMock.mock.calls).toEqual([[{
        type: 'SEQUENCE/COMPLETE_ITEM',
        payload: {
          item,
          mistakes
        }
      }]]);
    });
  });

  describe('completeTrainer', () => {
    test('dispatches complete trainer', () => {
      sequenceActions.completeTrainer()(dispatchMock);

      expect(dispatchMock.mock.calls).toEqual([
        [{
          type: 'SEQUENCE/COMPLETE_TRAINER'
        }]
      ]);
    });
  });

  describe('preparePurge', () => {
    const store = mockStore();

    test('dispatches preparePurge action', () => {
      store.dispatch(sequenceActions.preparePurge());

      expect(store.getActions()).toEqual([
        { type: 'SEQUENCE/PREPARE_PURGE' }
      ]);
    });
  });

  describe('startPurge', () => {
    const store = mockStore();

    test('dispatches incrementPurgeLoopsCounter, startSequence and preparePurge from lesson', () => {
      store.dispatch(sequenceActions.startPurge());

      expect(store.getActions()).toEqual([
        { type: 'SEQUENCE/INCREMENT_PURGE_LOOPS_COUNTER' },
        { type: 'SEQUENCE/PREPARE_PURGE' },
        { type: 'SEQUENCE/START_SEQUENCE' }
      ]);
    });
  });
});
