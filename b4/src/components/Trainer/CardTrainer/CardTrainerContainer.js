import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as sequenceActions from '../../../dux/sequence/actions';
import withInfoText from '../../shared/withInfoText';
import { withServices } from '../../shared/withServices';
import ContinueSheet from '../../ContinueSheet';
import CardTrainer from '../../Trainer/CardTrainer/CardTrainer';
import { useSequence } from '../../shared/useSequence';
import withNormalisedTrainerData from '../withNormalisedTrainerData';
import { useItemTypeGrouping } from '../shared/useItemTypeGrouping';
import flattenItems from '../shared/flattenItems';
import useTrainerItemSounds from '../shared/useTrainerItemSounds';
import { isInteractive } from '../../shared/itemSelectors';
import { TIMEOUT_AFTER_INFOTEXT_DISPLAY } from '../../shared/InfoText/constants';
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

export const CardTrainerContainer = ({
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
  const initItems = useMemo(() => flattenItems(trainer), [trainer]);

  const {
    element: currentItem,
    elements: items,
    index: itemIndex,
    next: nextItem,
    isLast
  } = useSequence(initItems, initialItemIndex);

  const [playItemSound] = useTrainerItemSounds(items);
  const { stop: stopAllSounds } = soundService;

  const [state, setState] = useState(TRAINER_STATE.READY);
  const showTranslation = trainer.translationVisibility === 'full';
  const [translationVisible, setTranslationVisible] = useState(showTranslation);

  useEffect(() => {
    onStart({ scorableItemsCount: items.filter(isInteractive).length });
  }, [onStart, items]);

  const [lastIndexInGroup, getIndexInGroup] = useItemTypeGrouping(currentItem, items);

  const handleNextItem = useCallback(() => {
    if (isLast) {
      setState(TRAINER_STATE.AWAITING_CONTINUE);
    } else {
      nextItem();
      setState(TRAINER_STATE.READY);
    }
  }, [isLast, nextItem]);

  useEffect(() => {
    if (state === TRAINER_STATE.READY && !isInteractive(currentItem)) {
      playItemSound(currentItem)
        .catch(() => {})
        .then(() => {
          if (currentItem?.infoText) {
            displayInfoText(currentItem);
            return wait(TIMEOUT_AFTER_INFOTEXT_DISPLAY);
          }
        })
        .finally(handleNextItem);
    }
  }, [currentItem, state, displayInfoText, playItemSound, handleNextItem]);

  const handleFinish = () => {
    setState(TRAINER_STATE.DONE);
    stopAllSounds();
    onFinish();
  };

  const handleItemComplete = useCallback((mistakeCount) => {
    if (currentItem.nonInteractive) return;

    completeItem(currentItem, mistakeCount);
    setState(TRAINER_STATE.DONE);
    playItemSound(currentItem)
      .catch(() => {})
      .then(() => {
        if (currentItem.infoText) {
          displayInfoText(currentItem);
          return wait(TIMEOUT_AFTER_INFOTEXT_DISPLAY);
        }
      })
      .finally(handleNextItem);
  }, [currentItem, completeItem, handleNextItem, playItemSound, displayInfoText]);

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
      data-trainer-type="card"
      data-trainer-interaction={trainer.interaction}
      data-trainer-puzzlehelper={Boolean(trainer.puzzleHelper)}
    >
      <CardTrainer
        getIndexInGroup={getIndexInGroup}
        active={state === TRAINER_STATE.READY}
        currentItem={currentItem}
        currentItemIndex={isLast ? null : itemIndex}
        visibleItems={items.slice(0, lastIndexInGroup + 1)}
        image={trainer.image}
        title={trainer.title}
        learnLanguageAlpha3={learnLanguageAlpha3}
        onAttempt={handleAttempt}
        onItemComplete={handleItemComplete}
        onToggleTranslationVisibility={handleToggleTranslationVisibility}
        playItemSound={playItemSound}
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

CardTrainerContainer.propTypes = {
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
)(CardTrainerContainer);
