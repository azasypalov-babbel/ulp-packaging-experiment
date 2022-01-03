import React, { useState, useEffect, useMemo, useCallback, useReducer, useRef, useContext } from 'react';
import { last } from 'underscore';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firstCorrectSolution, parse } from '@lessonnine/babbel-markup-helper.js';

import * as sequenceActions from '@src/dux/sequence/actions';
import ContinueSheet from '@src/components/ContinueSheet';
import MatchingTrainer from '@src/components/Trainer/MatchingTrainer/MatchingTrainer';
import { useSequence } from '@src/components/shared/useSequence';
import withNormalisedTrainerData from '@src/components/Trainer/withNormalisedTrainerData';
import withInfoText from '@src/components/shared/withInfoText';
import flattenItems from '@src/components/Trainer/shared/flattenItems';
import { useMatchingGridState } from './useMatchingGridState';
import { MATCHING_TRAINER_STATE } from './constants';
import { useMatchLogic } from './useMatchLogic';
import { flipMoveDuration } from './MatchingItem/MatchingItem';
import useFeedbackSounds from '@src/components/Interactions/shared/useFeedbackSounds';
import { useSoundPlayer } from '@src/components/Trainer/shared/useSoundPlayer';
import { ServiceContext } from '@src/components/shared/withServices';
import { checks, PlayStates } from '@src/services/soundService';
import { useSoundsPreload } from '@src/components/Trainer/shared/useSoundsPreload';
import Delayed from '@src/components/shared/Delayed';

const FEEDBACK_TIME = 150;
const CONTINUE_BTN_DELAY = 500;

export const matchingParserOptions = {
  allowMultipleSolutions: true,
  allowOddSolutions: false,
  allowFormattingInSolutions: true,
  strict: false
};

export const toItemPairs = (item) => {
  if (item.learnLanguageText.includes('_')) {
    const [baseMarkup, optionMarkup] = item.learnLanguageText.split('_');
    return ({
      id: item.id,
      baseMarkup: parse(baseMarkup, matchingParserOptions).filterMap(firstCorrectSolution),
      optionMarkup: parse(optionMarkup, matchingParserOptions).filterMap(firstCorrectSolution),
      translation: item.displayLanguageText ? parse(item.displayLanguageText, { markupOnly: true }) : null,
      soundId: item.sound?.id
    });
  }
  return {
    id: item.id,
    baseMarkup: parse(item.learnLanguageText, matchingParserOptions).filterMap(firstCorrectSolution),
    optionMarkup: parse(item.displayLanguageText, matchingParserOptions).filterMap(firstCorrectSolution),
    soundId: item.sound?.id,
  };
};

const MatchingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MatchingTrainerContainer = ({
  attemptItem,
  completeItem,
  currentTrainerItemIndex: initialItemIndex,
  displayInfoText,
  onFinish,
  onStart,
  trainer
}) => {
  const initItems = useMemo(() => flattenItems(trainer), [trainer]);

  const {
    element: currentItem,
    elements: items,
    next: nextItem,
    isLast
  } = useSequence(initItems, initialItemIndex);

  const blockAttempts = useRef(false);

  // Block attempts while the flip animation is presenting the new item
  useEffect(() => {
    blockAttempts.current = true;

    const timeout = setTimeout(() => {
      blockAttempts.current = false;
    }, flipMoveDuration * 3);

    return () => { clearTimeout(timeout); };
  }, [currentItem]);

  const itemPairs = useMemo(() => items.map(toItemPairs), [items]);

  const [state, setState] = useState(MATCHING_TRAINER_STATE.READY);

  const [attempts, addAttempt] = useReducer((s, { attempt, item }) => {
    const newState = new Map(s);
    const current = newState.get(item.id) || [];
    newState.set(item.id, [...current, attempt]);
    return newState;
  }, new Map());

  const [bases, matchedOptions, unmatchedOptions] = useMatchLogic(itemPairs, attempts);

  const latestAttempt = useMemo(
    () => last(attempts.get(currentItem.id) || []),
    [attempts, currentItem.id]
  );

  const [playFeedback, isFeedbackSoundDone] = useFeedbackSounds({
    skipOnActiveSound: false,
    resetDependencies: [latestAttempt]
  });

  const grid = useMatchingGridState(
    bases,
    matchedOptions,
    unmatchedOptions,
    currentItem,
    latestAttempt,
  );

  useSoundsPreload(items)
  const { mediaUrlService, soundService } = useContext(ServiceContext);
  const audioUrl = currentItem.sound?.id && mediaUrlService.soundURL(currentItem.sound.id);
  const soundPlayer = useSoundPlayer(audioUrl);
  const playState = soundPlayer.getState();
  const isGivingFeedback = state === MATCHING_TRAINER_STATE.FEEDBACK

  // Stop sounds on mount so that they don't continue on the next trainer
  useEffect(() => {
    return () => {
      soundService.stop();
    }
  }, [soundService]);

  useEffect(() => {
    onStart({ scorableItemsCount: items.length });
  }, [onStart, items]);

  const handleNextItem = useCallback(() => {
    if (isLast) {
      setState(MATCHING_TRAINER_STATE.DONE);
      setTimeout(() => {
        setState(MATCHING_TRAINER_STATE.AWAITING_CONTINUE);
      }, FEEDBACK_TIME);
    } else {
      setState(MATCHING_TRAINER_STATE.READY);
      nextItem();
    }
  }, [isLast, nextItem]);

  const handleFinish = () => {
    onFinish();
  };

  const trackItemAttempt = useCallback((attempt, number, item) => {
    const {
      isSolved,
      text,
      targetText
    } = attempt;

    const trainerData = {
      /* eslint-disable camelcase */
      interaction_mode: trainer.interaction,
      item_position_in_trainer: items.indexOf(item) + 1,
      number_of_items_in_trainer: items.length,
      translation_mode: trainer.translationVisibility
      /* eslint-enable camelcase */
    };

    const trackingAttempt = {
      solved: isSolved,
      number: number,
      text,
      targetText
    };

    attemptItem(item, trackingAttempt, trainerData);
  }, [attemptItem, items, trainer.interaction, trainer.translationVisibility]);

  const handleOptionClick = useCallback((optionId) => {
    if (state !== MATCHING_TRAINER_STATE.READY) {
      return;
    }

    // reset the player in order to prevent issues when soundIds are the same
    if (playState !== PlayStates.INITIAL) {
      soundPlayer.stop();
      soundPlayer.reset();
    }

    // Ignore attempt on the current item if it is already solved
    if (last(attempts.get(currentItem.id))?.isSolved) return;
    if (blockAttempts.current) return;

    const expectedPair = itemPairs.find((itemPair) => currentItem.id === itemPair.id);
    const selectedOption = unmatchedOptions.find((option) => optionId === option.id);

    // Ignore attempt if the selection has already been used
    if (!selectedOption) return;

    // Compare items based on the value of the option text
    const isSolved = expectedPair.optionMarkup.toString() === selectedOption.markup.toString();

    addAttempt({
      attempt: {
        isSolved,
        selectedOption: optionId,
        text: selectedOption.markup.toString(),
        targetText: expectedPair.optionMarkup.toString()
      },
      item: currentItem
    });
  }, [state, playState, attempts, currentItem, itemPairs, unmatchedOptions, soundPlayer]);

  // display info text whilst item audio is playing
  useEffect(() => {
    if (
      latestAttempt?.isSolved
      && checks.hasPlayed(playState)
      && state === MATCHING_TRAINER_STATE.PLAYING_AUDIO
    ) {
      if (currentItem.infoText) {
        displayInfoText(currentItem);
      }

      handleNextItem();
    }
  }, [currentItem, displayInfoText, handleNextItem, latestAttempt, playState, state]);

  // Handle side-effects (track & feedback) of an attempt
  useEffect(() => {
    if (latestAttempt) {
      setState(MATCHING_TRAINER_STATE.FEEDBACK);

      trackItemAttempt(latestAttempt, attempts.get(currentItem.id)?.length, currentItem);

      playFeedback(latestAttempt.isSolved);
    }
  }, [currentItem, attempts, trackItemAttempt, latestAttempt, playFeedback]);

  // handle change after feedback sound completed
  useEffect(() => {
    if (latestAttempt && isGivingFeedback && isFeedbackSoundDone) {
      if (latestAttempt.isSolved) {
        const mistakes = attempts.get(currentItem.id)?.length - 1;
        completeItem(currentItem, mistakes);

        setState(MATCHING_TRAINER_STATE.PLAYING_AUDIO);

        soundPlayer.play();
      } else {
        setState(MATCHING_TRAINER_STATE.READY);
      }
    }
  }, [isGivingFeedback, isFeedbackSoundDone, latestAttempt])  // eslint-disable-line react-hooks/exhaustive-deps

  const showTranslation = trainer.translationVisibility !== 'none';

  return (
    <MatchingWrapper
      data-trainer-type="matching"
      data-trainer-interaction={trainer.interaction}
    >
      <MatchingTrainer
        trainerState={state}
        grid={grid}
        title={trainer.title}
        onOptionClick={handleOptionClick}
        showTranslation={showTranslation}
      />
      {state === MATCHING_TRAINER_STATE.AWAITING_CONTINUE && (
        <Delayed delay={CONTINUE_BTN_DELAY}>
          <ContinueSheet onClick={handleFinish} />
        </Delayed>
      )}
    </MatchingWrapper>
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

const mapDispatchToProps = {
  attemptItem: sequenceActions.attemptItem,
  completeItem: sequenceActions.completeItem
};

MatchingTrainerContainer.propTypes = {
  attemptItem: PropTypes.func.isRequired,
  currentTrainerItemIndex: PropTypes.number.isRequired,
  displayInfoText: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  completeItem: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired
};

export default compose(
  withInfoText,
  connect(mapStateToProps, mapDispatchToProps),
  withNormalisedTrainerData
)(MatchingTrainerContainer);
