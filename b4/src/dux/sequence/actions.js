import * as types from './types';
import * as sequenceSelectors from '../sequence/selectors';

export const init = (trainers) => (dispatch) => {
  dispatch({
    type: types.INIT,
    payload: { trainers }
  });
};

export const startSequence = () => (dispatch) => {
  dispatch({
    type: types.START_SEQUENCE
  });
};

export const abortSequence = () => (dispatch) => {
  dispatch({
    type: types.ABORT_SEQUENCE
  });
};

export const navigate = (trainerIndex) => (dispatch) => {
  dispatch({
    type: types.NAVIGATE,
    payload: { trainerIndex }
  });
};

export const startTrainer = () => (dispatch) => {
  dispatch({
    type: types.START_TRAINER
  });
};

export const allocateItems = (itemsCount) => (dispatch) => {
  dispatch({
    type: types.ALLOCATE_ITEMS,
    payload: { itemsCount }
  });
};

export const attemptItem = (trainerItem, attempt, trainerData) => (dispatch, getState) => {
  const item = sequenceSelectors.itemsInCurrentTrainer(getState().sequence)
    .filter((itemInTrainer) => itemInTrainer.id === trainerItem.id)[0];

  dispatch({
    type: types.ATTEMPT_ITEM,
    payload: { item, attempt, trainerData }
  });
};

export const completeItem = (item, mistakes) => (dispatch) => {
  dispatch({
    type: types.COMPLETE_ITEM,
    payload: { item, mistakes }
  });
};

export const completeTrainer = () => (dispatch) => {
  dispatch({
    type: types.COMPLETE_TRAINER
  });
};

export const completeSequence = () => (dispatch) => {
  dispatch({
    type: types.COMPLETE_SEQUENCE
  });
};

export const skipItem = (itemtoSkip, attempt, trainerData) => (dispatch, getState) => {
  const item = sequenceSelectors.itemsInCurrentTrainer(getState().sequence)
    .filter((itemInTrainer) => itemInTrainer.id === itemtoSkip.id)[0];

  dispatch({
    type: types.SKIP_ITEM,
    payload: { item, attempt, trainerData }
  });
};


export const preparePurge = () => (dispatch) => {
  dispatch({
    type: types.PREPARE_PURGE
  });
};

export const incrementPurgeLoopsCounter = () => (dispatch) => {
  dispatch({
    type: types.INCREMENT_PURGE_LOOPS_COUNTER
  });
};

export const startPurge = () => (dispatch) => {
  dispatch(incrementPurgeLoopsCounter());
  dispatch(preparePurge());
  dispatch(startSequence());
};
