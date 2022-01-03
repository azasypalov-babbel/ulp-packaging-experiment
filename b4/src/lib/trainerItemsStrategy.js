import { trainersTypeInteractionMap } from './trainersTypeInteractionMap';
import * as trainersTypeWhitelist from './trainersTypeWhitelist';
import rollbarService from '../services/rollbarService';
import { parse, getParserOptions } from '@lessonnine/babbel-markup-helper.js';
import { log } from './logging';
import { omit } from 'underscore';


/* eslint-disable camelcase */
const splitTrainerItemsStrategy = {
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [3, 3, 3],
  10: [3, 3, 4]
};

const reduceTrainerIntoSeveralTrainers = (trainer) => {
  const itemGroup = trainer.item_groups[0];
  const items = itemGroup.items;
  const strategy = splitTrainerItemsStrategy[items.length];

  if (!strategy) {
    return trainer;
  }

  let i = 0;
  let j = 0;

  return strategy.map((itemsLength) => {
    j += itemsLength;

    const reducedTrainer = {
      ...trainer,

      item_groups: [
        {
          ...itemGroup,
          items: items.slice(i, j)
        }
      ]
    };

    i += itemsLength;

    return reducedTrainer;
  });
};

export const applyReviewTrainersStrategy = (trainers) => {
  return trainers.reduce((acc, trainer) => {
    if (trainer.type === 'vocabulary') {
      return acc.concat(reduceTrainerIntoSeveralTrainers(trainer));
    }

    return acc.concat(trainer);
  }, []);
};

const logSkippedTrainerToRollbar = (trainer) => {
  const message = `skipping trainer: ${trainer.type} ${trainer.interaction}`;
  rollbarService.log(message, trainer);
};

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => { return acc.concat(group.items); }, []);
};

// in case a parse error occurs, send a detailed report to rollbar
const handleParserErrors = (rollbarData) => {
  const isReview = Boolean(rollbarData.data.state_data.content_uuid.match(/REVIEW/));
  const message = `${rollbarData.message} (${isReview ? 'review' : 'lesson'})`;
  log(message, rollbarData.data);
  rollbarService.warn(message, rollbarData.data);
};

const itemSpecificParserOptions = (item, interaction) => {
  const isPhrase = item.type === 'phrase';
  const scriptingOptions = { ...getParserOptions(interaction), strict: false };
  const markupOptions = { markupOnly: true, strict: false };

  return {
    display_language_text: !isPhrase ? scriptingOptions : markupOptions,
    learn_language_text: isPhrase ? scriptingOptions : markupOptions,
    info_text: markupOptions
  };
};

const parseFields = ({ listName, listItem, fields, additionalData }) => {
  const rollbarData = {
    message: `Invalid markup found in ${listName}`,
    data: {
      error_type: `${listName} level errors`,
      errors: [],
      trainer: additionalData.trainer,
      state_data: additionalData.state_data,
      item: additionalData.item
    }
  };

  Object.entries(fields).forEach(([fieldName, parserOptions]) => {
    const text = listItem[fieldName];
    try {
      if (text) { // sometimes, fields can be null
        parse(text, parserOptions);
      }
    } catch (err) {
      rollbarData.data.errors.push({
        incorrect_field: fieldName,
        incorrect_text: text,
        parser_error_message: err.message
      });
    }
  });

  if (rollbarData.data.errors.length > 0) {
    handleParserErrors(rollbarData);
  }
};

// logIncorrectItemsToRollbar works for both Reviews and Lessons.
// In case a field is NOT parsable using the babbel-markup-helper.js parse function,
// it will log the error (+ additional data) in both the console and rollbar
export const logIncorrectItemsToRollbar = (trainers, stateData) => {
  const isReview = Boolean(stateData.content_uuid.match(/REVIEW/));
  // in review, we do not need any item/trainer indices in the final result
  // however, in a lesson, we need indices for the trainer within the lesson (always)
  // and for the item within the trainer (only when it's an item level error)
  const keysToBeOmitted = [];
  if (isReview) {
    keysToBeOmitted.push('trainer_position_in_lesson', 'item_position_in_trainer');
  }

  trainers.forEach((trainer, trainerIndex) => {
    let additionalData = {
      state_data: {
        ...stateData,
        trainer_position_in_lesson: trainerIndex + 1
      }
    };

    /* parse trainer level fields */
    parseFields({
      listName: 'trainer',
      listItem: trainer,
      fields: {
        description: { markupOnly: true, strict: false },
        title: { markupOnly: true, strict: false }
      },
      additionalData: {
        state_data: omit(additionalData.state_data, keysToBeOmitted),
        trainer: omit(trainer,  ['item_groups', 'image'])
      }
    });

    /* parse item level fields */
    flattenItems(trainer).forEach((item, index) => {
      additionalData.state_data.item_position_in_trainer = index + 1;

      parseFields({
        listName: 'item',
        listItem: item,
        fields: itemSpecificParserOptions(item, trainer.interaction),
        additionalData: {
          state_data: omit(additionalData.state_data, keysToBeOmitted),
          trainer: omit(trainer, ['item_groups', 'image']),
          item: omit(item, ['info_text', 'sound', 'speaker_role', 'image'])
        }
      });
    });
  });
};

export const filterWhitelistedTrainers = trainersTypeWhitelist.filterWhitelistedTrainers(logSkippedTrainerToRollbar);

export const mapTrainerTypeInteraction = (trainers) => {
  return trainers.map((trainer) => {
    let trainerMapRule = [...trainersTypeInteractionMap].find(([key]) =>
      (key.type == trainer.type && key.interaction == trainer.interaction));

    if (trainerMapRule) {
      return {
        ...trainer,
        type: trainerMapRule[1].type,
        interaction: trainerMapRule[1].interaction,
        puzzle_helper: trainerMapRule[1].puzzle_helper || trainer.puzzle_helper
      };
    }

    return trainer;
  });
};
/* eslint-enable camelcase */
