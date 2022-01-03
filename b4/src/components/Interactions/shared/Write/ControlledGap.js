import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import StyledGap from './StyledGap';
import TextGap from './TextGap';

import { targetChoice, attemptType } from '../scene/scenePropTypes';

import { getAlternativeSolution } from './helpers';
import { RESULTS } from '../../../../lib/matchingUtils/evaluate';
import { useSelector } from 'react-redux';

const stripHtml = (s) => s ? s.replace(/(<([^>]+)>)/ig, '') : '';
const stopPropagation = (event) => event.stopPropagation();

const refocus = (event) => {
  // event.persist() should be called when using React synthetic events inside an asynchronous callback function
  event.persist()
  // Firefox Fix: a timer to make sure that your code runs in an event loop separate from the one triggering the "blur" event. https://bugzilla.mozilla.org/show_bug.cgi?id=120995
  setTimeout(() => {
    if (event.relatedTarget === null) {
      event.target.focus({ preventScroll: true })
    }
  }, 1);
};

const ControlledGap = ({
  active,
  latestText,
  showFeedback,
  targetChoices,
  attempt,
  onKeyDown
}) => {
  const ref = useRef();
  const isZendeskWidgetOpen = useSelector(state => state.zendeskWidget.isOpen);
  useEffect(() => {
    if (active && !showFeedback && !isZendeskWidgetOpen) {
      ref.current?.focus({ preventScroll: true });
    }
  }, [ref, active, showFeedback, isZendeskWidgetOpen]);

  const targetTexts = targetChoices
    .filter((choice) => choice.correct)
    .map((choice) => choice.sentence);

  // PH should disregard multiple solutions
  const targetText = stripHtml(targetTexts[0]);
  const inputTextGap = stripHtml(attempt.inputText);
  const textGap = stripHtml(attempt.text);

  // alternative solution
  const alternativeText = getAlternativeSolution(targetTexts, targetText);

  if (!active) {
    return (
      <StyledGap active={false}>
        <TextGap
          text={attempt.number ? textGap : ' '}
          targetText={attempt.number ? textGap : targetText}
          alternativeText={alternativeText}
        />
      </StyledGap>
    );
  }

  if (showFeedback && attempt.solved) {
    const hasTypoFeedback = attempt.feedbackType === RESULTS.TYPO;
    return (
      <StyledGap
        active={true}
        solved={true}
        typo={hasTypoFeedback}
      >
        <TextGap
          text={hasTypoFeedback ? inputTextGap : textGap}
          targetText={hasTypoFeedback ? inputTextGap : textGap}
          alternativeText={alternativeText}
        />
      </StyledGap>
    );
  }

  return (
    <StyledGap
      active={true}
      onClick={stopPropagation}
      mistaken={!attempt.solved && showFeedback}
    >
      <TextGap
        ref={ref}
        tabIndex={0}
        onBlur={!isZendeskWidgetOpen ? refocus : undefined}
        data-selector="active-gap"
        data-focus-on-key="Shift+Escape"
        onKeyDown={onKeyDown}
        text={latestText}
        targetText={targetText}
        alternativeText={alternativeText}
      />
    </StyledGap>
  );
};

ControlledGap.displayName = 'ControlledGap';

ControlledGap.propTypes = {
  onKeyDown: PropTypes.func,
  showFeedback: PropTypes.bool,
  active: PropTypes.bool.isRequired,
  latestText: PropTypes.string,
  targetChoices: PropTypes.arrayOf(targetChoice).isRequired,
  attempt: attemptType
};

export default ControlledGap;
