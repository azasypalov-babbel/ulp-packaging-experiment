import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { attemptType } from '../shared/scene/scenePropTypes';
import { Shake } from '../Wordorder/animations';


import Sheet from '../../shared/Sheet';
import { renderInBottomLayout } from '../../shared/BottomLayout';
import ChoiceItem from '../../shared/ChoiceItem/ChoiceItem';

const StyledSheet = styled(Sheet)`
  & > div {
    display: flex;
    flex-direction: column;
    & > div {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    & > * + * {
      margin-top: 0.75rem;
    }
  }
`;

export const Choicebutton = ({ attempt, showFeedback, sentence, ...props }) => {
  const used = attempt?.inputText === sentence;
  const isMistaken = showFeedback && used && !attempt?.solved;
  const isCorrect = showFeedback && used && attempt?.solved;
  const ref = useRef();
  useEffect(() => {
    if (isMistaken) {
      ref?.current?.animate();
    }
  }, [ref, isMistaken]);
  return (
    <Shake ref={ref}>
      {() =>
        <ChoiceItem
          mistakeFeedback={isMistaken}
          correctFeedback={isCorrect}
          disabled={showFeedback && !used}
          {...props}
        >
          {sentence}
        </ChoiceItem>
      }
    </Shake>
  );
};

Choicebutton.propTypes = {
  sentence: PropTypes.string.isRequired,
  attempt: attemptType,
  showFeedback: PropTypes.bool
};

export const FullWidthChoicebutton = styled(Choicebutton)`
  max-width: revert;
`;

export const Choicebuttons = ({
  attempt,
  showFeedback,
  targetChoices,
  onAttempt
}) => {
  return (
    <StyledSheet onClick={(event) => event.stopPropagation()}>
      {targetChoices.map(({ sentence, correct }, index) => {
        return (
          <Choicebutton
            key={index}
            showFeedback={showFeedback}
            attempt={attempt}
            sentence={sentence}
            data-position={index}
            data-choice={sentence}
            data-correct={showFeedback ? undefined : correct}
            listenToKey={String(index + 1)}
            onClick={() => onAttempt(sentence)}
            shortcutsVisible
          >
            {sentence}
          </Choicebutton>
        );
      })}
    </StyledSheet>
  );
};

Choicebuttons.propTypes = {
  attempt: attemptType,
  showFeedback: PropTypes.bool,
  targetChoices: PropTypes.arrayOf(PropTypes.shape({
    sentence: PropTypes.string.isRequired,
    correct: PropTypes.bool.isRequired
  })).isRequired,
  onAttempt: PropTypes.func.isRequired
};

export default compose(
  renderInBottomLayout,
)(Choicebuttons);
