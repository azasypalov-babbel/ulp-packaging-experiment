import React, { useEffect, useMemo, useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import * as features from '../../../lib/features';
import useActiveGapStale from '../shared/Write/useActiveGapStale';

import InputHint from './InputHint';

import StyledGap from '../shared/Write/StyledGap';
import FormInput from './FormInput';
import TextGap from '../shared/Write/TextGap';
import { getClosestMatch, getAlternativeSolution } from '../shared/Write/helpers';
import ToolTip from '../../shared/ToolTip';
import { INTERACTION_STATES } from '../shared/scene/useScene';
import { RESULTS } from '../../../lib/matchingUtils/evaluate';

const Gap = React.forwardRef(({
  submitHint,
  interactionState,
  targetChoices,
  attempt,
  onReturn,
  hintLevel,
  handleKeyPress,
  learnLanguageAlpha3,
  toggleTransliterationVisibility,
  shouldShowTransliteration,
  onRetry
}, ref) => {
  const inputRef = useRef();
  const [latestText, setLatestText] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus({ preventScroll: true });
    },
    deleteAll: () => {
      inputRef.current?.deleteAll();
      inputRef.current?.retry();
    }
  }));

  const [
    onKeyUp,
    onBlur,
    shouldShowSubmitTip
  ] = useActiveGapStale(!features.isWebview());

  useEffect(() => {
    if (shouldShowTransliteration && shouldShowSubmitTip) {
      toggleTransliterationVisibility();
    }
  }, [
    shouldShowSubmitTip,
    shouldShowTransliteration,
    toggleTransliterationVisibility
  ]);

  const handleReturn = (text) => {
    onReturn(text); 
    onBlur();
  }

  const handleLatestTextChange = (text) => {
    if (interactionState === INTERACTION_STATES.FEEDBACK) {
      onRetry();
    }
    setLatestText(text);
  };

  const targetTexts = useMemo(() => targetChoices
    .filter((choice) => choice.correct)
    .map((choice) => choice.sentence), [targetChoices]);

  const { targetText } = useMemo(() => getClosestMatch({ text: latestText, targetTexts }), [latestText, targetTexts]);
  const alternativeText = getAlternativeSolution(targetTexts, targetText);

  if (interactionState === INTERACTION_STATES.INACTIVE) {
    return (
      <StyledGap active={false}>
        <TextGap
          text={attempt.number ? targetText : ' '}
          targetText={targetText}
          alternativeText={alternativeText}
        />
      </StyledGap>
    );
  }

  const showFeedback = interactionState === INTERACTION_STATES.FEEDBACK;

  if (showFeedback && attempt.solved) {
    const { inputText, text } = attempt;
    const hasTypoFeedback = attempt.feedbackType === RESULTS.TYPO;
    return (
      <StyledGap
        active={true}
        solved={true}
        typo={hasTypoFeedback}>
        <TextGap
          text={hasTypoFeedback ? inputText : text}
          targetText={hasTypoFeedback ? inputText : targetText}
          alternativeText={alternativeText}
        />
      </StyledGap>
    );
  }

  return (
    <StyledGap
      active={true}
      mistaken={!attempt.solved && showFeedback}
    >
      <ToolTip text={submitHint} visible={shouldShowSubmitTip}>
        <InputHint
          latestText={latestText}
          targetText={targetText}
          alternativeText={alternativeText}
          hintLevel={hintLevel}
          learnLanguageAlpha3={learnLanguageAlpha3}
        />
        <FormInput
          ref={inputRef}
          attempt={attempt}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          controlled={false}
          onLatestTextChange={handleLatestTextChange}
          onKeyPress={handleKeyPress}
          onReturn={handleReturn}
          targetText={targetText}
          alternativeText={alternativeText}
          onClick={onRetry}
        />
      </ToolTip>
    </StyledGap>
  );
});

Gap.displayName = 'Gap';

Gap.propTypes = {
  onRetry: PropTypes.func.isRequired,
  targetChoices: PropTypes.arrayOf(
    PropTypes.shape({
      sentence: PropTypes.string.isRequired,
      correct: PropTypes.bool.isRequired,
      oddSolution: PropTypes.bool.isRequired
    })
  ).isRequired,
  hintLevel: PropTypes.string.isRequired,
  interactionState: PropTypes.string.isRequired,
  attempt: PropTypes.object,
  handleKeyPress: PropTypes.func,
  onReturn: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  toggleTransliterationVisibility: PropTypes.func.isRequired,
  shouldShowTransliteration: PropTypes.bool,
  submitHint: PropTypes.string.isRequired
};

export default Gap;
