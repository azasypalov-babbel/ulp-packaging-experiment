import { compose } from '../../lib/compose';
import * as types from './types';
import prepareTrainersForPurge from '../../lib/purgeFormatters/prepareTrainersForPurge';

const initialState = {
  trainers: [],
  currentTrainerIndex: null,
  purgeLoopsCounter: 0,
  started: false,
  completed: false
};

const removeAttempt = (item) => ({
  ...item,
  attempt: null
});

const removeSubsequentAttempts = (trainers, trainerIndex) => {
  return [
    ...trainers.slice(0, trainerIndex),
    ...trainers.slice(trainerIndex).map((trainer) => ({
      ...trainer,
      completed: false,

      item_groups: trainer.item_groups.map((itemGroup) => ({
        ...itemGroup,
        items: itemGroup.items.map(removeAttempt)
      }))
    }))
  ];
};

const removeAttempts = (trainers) => {
  return trainers.map((trainer) => ({
    ...trainer,

    item_groups: trainer.item_groups.map((itemGroup) => ({
      ...itemGroup,
      items: itemGroup.items.map(removeAttempt)
    }))
  }));
};

const removeExpectedAttemptsCount = (trainers) => {
  return trainers.map((trainer) => ({
    ...trainer,
    expectedAttemptsCount: null
  }));
};

const addExpectedAttemptsCount = (trainers, trainerIndex, itemsCount) => {
  const trainer = trainers[trainerIndex];

  const trainersCopy = [...trainers];

  trainersCopy[trainerIndex] = {
    ...trainer,
    expectedAttemptsCount: itemsCount
  };

  return trainersCopy;
};

const addStartedFlag = (trainers, trainerIndex) => {
  const trainer = trainers[trainerIndex];

  const trainersCopy = [...trainers];

  trainersCopy[trainerIndex] = {
    ...trainer,
    started: true
  };

  return trainersCopy;
};

const addCompletedFlag = (trainers, trainerIndex) => {
  const trainer = trainers[trainerIndex];

  const trainersCopy = [...trainers];

  trainersCopy[trainerIndex] = {
    ...trainer,
    completed: true
  };

  return trainersCopy;
};

const resetStartedAndCompletedFlags = (trainers) => {
  return trainers.map((trainer) => ({
    ...trainer,
    started: false,
    completed: false
  }));
};

const addAttempt = (trainers, trainerIndex, itemUuid, attempt) => {
  const updateItem = (item) => {
    if (item.id === itemUuid) {
      return {
        ...item,
        attempt
      };
    } else {
      return item;
    }
  };

  const updateTrainer = (trainer) => {
    const itemGroups = trainer.item_groups.map((itemGroup) => {
      return {
        ...itemGroup,
        items: itemGroup.items.map(updateItem)
      };
    });

    return {
      ...trainer,
      item_groups: itemGroups
    };
  };

  return trainers.map((trainer, index) => {
    if (index === trainerIndex) {
      return updateTrainer(trainer);
    } else {
      return trainer;
    }
  });
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.INIT: {
      const { trainers } = action.payload;

      return {
        ...state,
        trainers: trainers,
        currentTrainerIndex: null,
        purgeLoopsCounter: 1
      };
    }

    case types.START_SEQUENCE: {
      return {
        ...state,
        started: true,
        completed: false
      };
    }

    case types.NAVIGATE: {
      const { trainerIndex } = action.payload;
      let { trainers } = state;

      if (trainerIndex < 0 || trainerIndex > trainers.length - 1) {
        throw Error(`trainerIndex should be in [0, ${state.trainers.length - 1}], but it is ${trainerIndex}`);
      }

      return {
        ...state,
        currentTrainerIndex: trainerIndex
      };
    }

    case types.ALLOCATE_ITEMS: {
      const { trainers, currentTrainerIndex } = state;
      const { itemsCount } = action.payload;

      return {
        ...state,
        trainers: addExpectedAttemptsCount(trainers, currentTrainerIndex, itemsCount)
      };
    }

    case types.START_TRAINER: {
      const trainers = compose(
        (trainers) => removeSubsequentAttempts(trainers, state.currentTrainerIndex),
        (trainers) => addStartedFlag(trainers, state.currentTrainerIndex)
      )(state.trainers);

      return {
        ...state,
        trainers
      };
    }

    case types.COMPLETE_ITEM: {
      const { trainers, currentTrainerIndex } = state;
      const { item, mistakes } = action.payload;
      const attempt = { mistakes };

      return {
        ...state,
        trainers: addAttempt(trainers, currentTrainerIndex, item.id, attempt)
      };
    }

    case types.COMPLETE_TRAINER: {
      const { trainers, currentTrainerIndex } = state;

      return {
        ...state,
        trainers: addCompletedFlag(trainers, currentTrainerIndex)
      };
    }

    case types.COMPLETE_SEQUENCE: {
      return {
        ...state,
        completed: true
      };
    }

    case types.SKIP_ITEM: {
      const { trainers, currentTrainerIndex } = state;
      const { item } = action.payload;
      const attempt = { skipped: true };

      return {
        ...state,
        trainers: addAttempt(trainers, currentTrainerIndex, item.id, attempt)
      };
    }

    case types.PREPARE_PURGE: {
      const { trainers } = state;

      return {
        ...state,

        trainers: compose(
          resetStartedAndCompletedFlags,
          removeAttempts,
          removeExpectedAttemptsCount,
          prepareTrainersForPurge
        )(trainers),

        currentTrainerIndex: null
      };
    }

    case types.INCREMENT_PURGE_LOOPS_COUNTER: {
      return { ...state, purgeLoopsCounter: state.purgeLoopsCounter + 1 };
    }

    default: {
      return state;
    }
  }
}
