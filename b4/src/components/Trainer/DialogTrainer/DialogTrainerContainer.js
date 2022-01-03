import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as sequenceActions from '../../../dux/sequence/actions';
import withInfoText from '../../shared/withInfoText';
import { withServices } from '../../shared/withServices';
import ContinueSheet from '../../ContinueSheet';
import DialogTrainer from './DialogTrainer';
import { useSequence } from '../../shared/useSequence';
import withNormalisedTrainerData from '../withNormalisedTrainerData';
import flattenItems from '../shared/flattenItems';
import useTrainerItemSounds from '../shared/useTrainerItemSounds';
import { isInteractive } from '../../shared/itemSelectors';
import { TIMEOUT_AFTER_INFOTEXT_DISPLAY } from '../../shared/InfoText/constants';
import { TIMEOUT_AFTER_CONTEXTUAL_INFO } from './constants';
import { wait } from '../../shared/wait';

const stripHtml = (s) => s ? s.replace(/(<([^>]+)>)/ig, '') : '';

const TRAINER_STATE = {
  READY: 'READY',
  AWAITING_CONTINUE: 'AWAITING_CONTINUE',
  DONE: 'DONE'
};

const getInteractionType = (trainer) => {
  if (trainer.interaction === 'write') {
    return trainer.puzzleHelper ? 'puzzlehelper' : 'fillin';
  }
  return trainer.interaction;
};

const createDescriptionAsTask = (description) => ({
  id: '0',
  type: 'task',
  displayLanguageText: description
});

export const DialogTrainerContainer = ({
  attemptItem,
  completeItem,
  currentTrainerItemIndex: initialItemIndex,
  displayInfoText,
  learnLanguageAlpha3,
  onFinish,
  onStart,
  trainer,
  soundService
}) => {
  const initItems = useMemo(() => {
    const items = flattenItems(trainer);
    if (trainer.description) {
      items.unshift(createDescriptionAsTask(trainer.description));
    }
    return items;
  }, [trainer]);

  const {
    element: currentItem,
    elements: items,
    index: itemIndex,
    next: nextItem,
    isLast
  } = useSequence(initItems, initialItemIndex);
  const waitForDictatePlayback = useRef(Promise.resolve());

  const [playItemSound, isItemSoundPlaying] = useTrainerItemSounds(items);
  const { stop: stopAllSounds } = soundService;

  const [state, setState] = useState(TRAINER_STATE.READY);
  const showTranslation = trainer.translationVisibility === 'full';
  const [translationVisible, setTranslationVisible] = useState(showTranslation);

  useEffect(() => {
    onStart({ scorableItemsCount: items.filter(isInteractive).length });
  }, [onStart, items]);

  const handleNextItem = useCallback(() => {
    if (isLast) {
      setState(TRAINER_STATE.AWAITING_CONTINUE);
    } else {
      nextItem();
      setState(TRAINER_STATE.READY);
    }
  }, [isLast, nextItem]);

  useEffect(() => {
    if (state === TRAINER_STATE.READY) {
      // if item is non-interactive, it can be either a task or a phrase-without-gap
      // and it can have an info text
      if (!isInteractive(currentItem)) {
        setState(TRAINER_STATE.DONE);
        playItemSound(currentItem)
          .catch(() => {})
          .then(() => {
            if (currentItem?.type === 'task') {
              // Give the user some time to read the contextual info
              return wait(TIMEOUT_AFTER_CONTEXTUAL_INFO);
            }
          })
          .then(() => {
            if (currentItem?.infoText) {
              // Then show them the infotext
              displayInfoText(currentItem);
              // And give them some time to read the info text
              return wait(TIMEOUT_AFTER_INFOTEXT_DISPLAY);
            }
          })
          .finally(handleNextItem);
      } else if (trainer.dictate) {
        waitForDictatePlayback.current = playItemSound(currentItem).catch(() => {});
      }
    }
  }, [trainer, currentItem, state, displayInfoText, playItemSound, handleNextItem]);

  const handleFinish = () => {
    setState(TRAINER_STATE.DONE);
    stopAllSounds();
    onFinish();
  };

  const userInitiatedItemSound = (item) => {
    if (trainer.dictate && item === currentItem) {
      // User initiated item sound playback should block progression to the next item
      waitForDictatePlayback.current = playItemSound(item).catch(() => {});
    } else {
      playItemSound(item).catch(() => {});
    }
  };

  const handleItemComplete = useCallback(async (mistakeCount) => {
    if (currentItem.nonInteractive) return;

    if (typeof mistakeCount !== 'undefined') completeItem(currentItem, mistakeCount);

    setState(TRAINER_STATE.DONE);

    const waitForSound = trainer.dictate
      ? waitForDictatePlayback.current
      : playItemSound(currentItem).catch(() => {});

    await waitForSound
      .then(() => {
        if (currentItem.infoText) {
          displayInfoText(currentItem);
          return wait(TIMEOUT_AFTER_INFOTEXT_DISPLAY);
        }
      })
      .finally(handleNextItem);
  }, [trainer, currentItem, completeItem, handleNextItem, playItemSound, displayInfoText]);

  const handleAttempt = useCallback(({ attempt }) => {
    const trainerData = {
      /* eslint-disable camelcase */
      interaction_mode: trainer.interaction,
      item_position_in_trainer: itemIndex,
      number_of_items_in_trainer: items.length,
      translation_mode: trainer.translationVisibility
      /* eslint-enable camelcase */
    };

    const trackingAttempt = {
      ...attempt,
      text: stripHtml(attempt.inputText),
      targetText: stripHtml(attempt.text)
    };
    delete trackingAttempt.inputText;

    attemptItem(currentItem, trackingAttempt, trainerData);
  },
  [
    attemptItem,
    currentItem,
    itemIndex,
    items.length,
    trainer.interaction,
    trainer.translationVisibility
  ]
  );

  const handleToggleTranslationVisibility = () => {
    setTranslationVisible(!translationVisible);
  };

  const interactionType = getInteractionType(trainer);

  return (
    <div
      data-trainer-type="dialog"
      data-trainer-interaction={trainer.interaction}
      data-trainer-puzzlehelper={Boolean(trainer.puzzleHelper)}
      data-trainer-dictate={Boolean(trainer.dictate)}
    >
      <DialogTrainer
        active={state === TRAINER_STATE.READY}
        currentItem={currentItem}
        currentItemIndex={isLast ? null : itemIndex}
        visibleItems={items.slice(0, itemIndex + 1)}
        image={trainer.image}
        title={trainer.title}
        learnLanguageAlpha3={learnLanguageAlpha3}
        onAttempt={handleAttempt}
        onItemComplete={handleItemComplete}
        onToggleTranslationVisibility={handleToggleTranslationVisibility}
        isItemSoundPlaying={isItemSoundPlaying}
        playItemSound={userInitiatedItemSound}
        translationVisibility={trainer.translationVisibility}
        translationVisible={translationVisible}
        interaction={interactionType}
      />
      {state === TRAINER_STATE.AWAITING_CONTINUE && <ContinueSheet onClick={handleFinish} />}
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

const mapDispatchToProps = {
  skipItem: sequenceActions.skipItem,
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem
};

DialogTrainerContainer.propTypes = {
  attemptItem: PropTypes.func.isRequired,
  currentTrainerItemIndex: PropTypes.number.isRequired,
  displayInfoText: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired,
  soundService: PropTypes.any.isRequired
};

export default compose(
  withInfoText,
  withServices(['soundService']),
  connect(mapStateToProps, mapDispatchToProps),
  withNormalisedTrainerData
)(DialogTrainerContainer);
