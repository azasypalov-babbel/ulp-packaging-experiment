import * as sequenceAction from './actions';
import * as types from './types';

const sequence = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === types.START_SEQUENCE) {
    store.dispatch(sequenceAction.navigate(0));
  }

  if (action.type === types.NAVIGATE) {
    store.dispatch(sequenceAction.startTrainer());
  }

  if (action.type === types.COMPLETE_TRAINER) {
    const { sequence } = store.getState();
    const { currentTrainerIndex, trainers } = sequence;

    if (currentTrainerIndex < trainers.length - 1) {
      store.dispatch(sequenceAction.navigate(currentTrainerIndex + 1));
    } else {
      store.dispatch(sequenceAction.completeSequence());
    }
  }

  return result;
};

export default sequence;
