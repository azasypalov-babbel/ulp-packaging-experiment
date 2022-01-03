import camelize from 'camelize';
import { createSelector } from 'reselect';
import prepareTrainersForPurge from '../../lib/purgeFormatters/prepareTrainersForPurge';
import { createSentenceParts, hasGap, removeGapFormatting } from '@lessonnine/babbel-markup-helper.js';
import { trainersWithAutoplayList } from './trainersWithAutoplayList';

const itemsInTrainer = ({ item_groups: itemGroups }) => itemGroups.reduce((items, itemGroup) => {
  return items.concat(itemGroup.items);
}, []);

const itemsInTrainers = (trainers) => {
  return trainers.reduce((items, trainer) => {
    return items.concat(itemsInTrainer(trainer));
  }, []);
};

const isAttempted = (item) => item.attempt;
const isCorrect = (item) => item.attempt && item.attempt.mistakes === 0;
const isMistaken = (item) => item.attempt && item.attempt.mistakes > 0;

export const trainersInSequence = (state) => state.trainers;

export const currentTrainer = createSelector(
  trainersInSequence,
  (state) => state.currentTrainerIndex,
  (trainers, currentTrainerIndex) => {
    return trainers[currentTrainerIndex];
  }
);

export const containsSpeakInteraction = createSelector(
  trainersInSequence,
  (trainers) => trainers.some(({ interaction }) => interaction.toLowerCase() === 'speak')
);

export const items = createSelector(
  trainersInSequence,
  (trainers) => itemsInTrainers(trainers).map(camelize)
);

export const correctItems = createSelector(
  trainersInSequence,
  (trainers) => itemsInTrainers(trainers).filter(isCorrect).map(camelize)
);

export const incorrectItems = createSelector(
  trainersInSequence,
  (trainers) => itemsInTrainers(trainers).filter(isMistaken).map(camelize)
);

export const purgeableItems = createSelector(
  trainersInSequence,
  (trainers) => itemsInTrainers(prepareTrainersForPurge(trainers)).filter(isMistaken).map(camelize)
);

export const itemsInCurrentTrainer = createSelector(
  trainersInSequence,
  (state) => state.currentTrainerIndex,
  (trainers, currentTrainerIndex) => itemsInTrainer(trainers[currentTrainerIndex])
);

export const itemProgressCounter = createSelector(
  trainersInSequence,
  (trainers) => {
    const items = itemsInTrainers(trainers);

    return {
      current: items.filter(isAttempted).length,
      total: items.length
    };
  }
);

export const currentTrainerItemIndex = createSelector(
  trainersInSequence,
  (state) => state.currentTrainerIndex,
  (trainers, currentTrainerIndex) => {
    const currentTrainer = trainers[currentTrainerIndex];
    if (!currentTrainer) return 0;

    const itemIndex = itemsInTrainers([currentTrainer]).findIndex((item) => !isAttempted(item));
    return itemIndex;
  }
);


export const sequenceProgressCounter = createSelector(
  trainersInSequence,
  (state) => state.currentTrainerIndex,
  (trainers, currentTrainerIndex) => {
    return {
      current: currentTrainerIndex + 1,
      total: trainers.length
    };
  }
);

export const calculateTrainerProgress = (trainer) => {
  if (!trainer) return 0;

  const { expectedAttemptsCount, completed } = trainer;
  if (completed) return 1;
  if (!expectedAttemptsCount) return 0; // no attempts expected for this trainer

  const attemptCount = itemsInTrainer(trainer).filter(isAttempted).length;
  return (attemptCount / expectedAttemptsCount);
};

export const sequenceHeadIndex = createSelector(
  trainersInSequence,
  (trainers) => {
    const headIndex = trainers.findIndex((trainer) => !trainer.completed);
    if (headIndex >= 0) return headIndex;
    return trainers.length - 1;
  }
);

export const sequenceHeadProgress = createSelector(
  trainersInSequence,
  sequenceHeadIndex,
  (trainers, sequenceHeadIndex) => calculateTrainerProgress(trainers[sequenceHeadIndex])
);

export const charactersFromItemGaps = createSelector(
  items,
  (items) => {
    const allItemGaps = items
      .map((item) => item.learnLanguageText)
      .filter(hasGap)
      .reduce((acc, item) => [...acc, ...createSentenceParts(item).filter(hasGap)], []);

    const allItemGapCharacters = allItemGaps.reduce((acc, gap) => {
      return [...acc, ...removeGapFormatting(gap).toLowerCase().split('')];
    }, []);

    return [...new Set(allItemGapCharacters)];
  }
);

export const isFirstTrainerWithAutoplay = createSelector(
  trainersInSequence,
  (trainers) => trainersWithAutoplayList
    .some((listItem) => {
      const [trainer] = trainers;
      return Object.entries(listItem)
        .every(([key, value]) => trainer[key] === value);
    })
);
