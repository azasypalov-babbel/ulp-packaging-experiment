import React, { useState, useEffect, useMemo, useCallback, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { normalizeScriptedString, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import * as sequenceActions from '../../../dux/sequence/actions';
import withInfoText from '../../shared/withInfoText';
import ContinueSheet from '../../ContinueSheet';
import VocabularyTrainer from '../../Trainer/VocabularyTrainer/VocabularyTrainer';
import { useSequence } from '../../shared/useSequence';
import { useSoundsPreload } from '../shared/useSoundsPreload';
import getComponentFromInteractionType from '../../../lib/getComponentFromInteractionType';
import { TRAINER_STATE } from './constants';
import { ServiceContext } from '../../shared/withServices';
import { TIMEOUT_AFTER_INFOTEXT_DISPLAY } from '../../shared/InfoText/constants';
import { wait } from '../../shared/wait';


const formatTrainerItem = (interaction) => (item) => ({
  id: item.id,
  sound: item.sound || {},
  image: item.image,
  // camel cased to be aligned with b3
  info_text: item.info_text, // eslint-disable-line camelcase
  learnLanguageText: normalizeScriptedString(interaction, item.learn_language_text),
  displayLanguageText: getFirstCorrectSolution(item.display_language_text || '')
});

const flattenItems = (trainer) => {
  return trainer.item_groups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

export const VocabularyTrainerContainer = ({
  attemptItem,
  clearInfoTextUI,
  completeItem,
  currentTrainerItemIndex: initialItemIndex,
  displayInfoText,
  learnLanguageAlpha3,
  onFinish,
  onStart,
  trainer
}) => {
  const items = useMemo(
    () => flattenItems(trainer).map(formatTrainerItem(trainer.interaction)),
    [trainer]
  );
  const {
    element: currentItem,
    next: nextItem,
    isLast: isLastItem,
    index: itemIndex
  } = useSequence(items, initialItemIndex);
  const { soundService } = useContext(ServiceContext);

  useSoundsPreload(items);

  const { stop: stopAllSounds } = soundService;

  const [state, setState] = useState(TRAINER_STATE.READY);
  const [mistakeCount, setMistakeCount] = useState(0);
  const showTranslation = trainer.translation_visibility === 'full';
  const [translationVisible, setTranslationVisible] = useState(showTranslation);

  useEffect(() => {
    onStart({ scorableItemsCount: items.length });
  }, [onStart, items.length]);

  const soundPlayCompletedRef = useRef(false);
  const requestNewItem = () => {
    completeItem(currentItem, mistakeCount);
    stopAllSounds();

    if (!isLastItem) {
      setState(TRAINER_STATE.READY);
      soundPlayCompletedRef.current = false;

      nextItem();
      clearInfoTextUI();
    } else {
      setState(TRAINER_STATE.DONE);

      onFinish();
    }
  };

  const handleItemComplete = useCallback((mistakeCount) => {
    setMistakeCount(mistakeCount);
    setState(TRAINER_STATE.AWAITING_SOUND_PLAY);
  }, []);

  const handleSoundPlayComplete = useCallback(async () => {
    if (state === TRAINER_STATE.AWAITING_SOUND_PLAY) {
      if (currentItem?.info_text) {
        displayInfoText(currentItem);
        await wait(TIMEOUT_AFTER_INFOTEXT_DISPLAY);
      }
      setState(TRAINER_STATE.AWAITING_CONTINUE);
    }
  }, [state, displayInfoText, currentItem]);

  const handleAttempt = useCallback(
    ({ attempt }) => {
      const trainerData = {
        /* eslint-disable camelcase */
        interaction_mode: trainer.interaction,
        item_position_in_trainer: itemIndex,
        number_of_items_in_trainer: items.length,
        translation_mode: trainer.translation_visibility
        /* eslint-enable camelcase */
      };

      const trackingAttempt = {
        ...attempt,
        text: attempt.inputText,
        targetText: attempt.text
      };
      delete trackingAttempt.inputText;

      const trackedItem = flattenItems(trainer)[itemIndex];

      attemptItem(trackedItem, trackingAttempt, trainerData);
    },
    [
      trainer,
      attemptItem,
      itemIndex,
      items.length
    ]
  );

  const handleToggleTranslationVisibility = () => {
    setTranslationVisible(!translationVisible);
  };

  if (!currentItem) return null;

  const getInteractionType = () => {
    if (trainer.interaction === 'write') {
      return trainer.puzzle_helper ? 'puzzlehelper' : 'fillin';
    }
    return trainer.interaction;
  };

  const Interaction = getComponentFromInteractionType(getInteractionType());
  const completed = state === TRAINER_STATE.AWAITING_CONTINUE;

  return (
    <div
      data-trainer-type="vocabulary"
      data-trainer-interaction={trainer.interaction}
      data-trainer-puzzlehelper={Boolean(trainer.puzzle_helper)}
      data-trainer-dictate={Boolean(trainer.dictate)}
    >
      <VocabularyTrainer
        item={currentItem}
        dictate={trainer.dictate}
        trainerState={state}
        title={trainer.title}
        onSoundPlayComplete={handleSoundPlayComplete}
        onToggleTranslationVisibility={handleToggleTranslationVisibility}
        translationVisibility={trainer.translation_visibility}
        translationVisible={translationVisible}
        interactionType={getInteractionType()}
        interaction={
          <Interaction
            key={currentItem.id}
            item={currentItem}
            active={state === TRAINER_STATE.READY}
            onFinish={handleItemComplete}
            onAttempt={handleAttempt}
            learnLanguageAlpha3={learnLanguageAlpha3}
          />
        }
      />
      {completed && <ContinueSheet onClick={requestNewItem} />}
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

VocabularyTrainerContainer.propTypes = {
  attemptItem: PropTypes.func.isRequired,
  clearInfoTextUI: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  currentTrainerItemIndex: PropTypes.number.isRequired,
  displayInfoText: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired
};

export default compose(
  withInfoText,
  connect(mapStateToProps, mapDispatchToProps)
)(VocabularyTrainerContainer);
