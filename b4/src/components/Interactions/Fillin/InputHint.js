import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { track } from '../../../dux/tracker/actions';
import shuffle from '../../../lib/shuffle';
import Text from '../../shared/Text';
import { splitBefore, trimWordStart } from '../shared/Write/helpers';
import { useMapUsedTokens } from '../shared/Write/useMapUsedTokens';

import { HINT_LEVEL } from './useInputHint';

const enterKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const StyledCharacter = styled(posed.div({}))`
  opacity: ${(props) => props.used ? 0.5 : 1};
  transition: order 0.25s;
`;

const StyledInputHint = styled.div`
  position: absolute;
  user-select: none;

  display: flex;

  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);

  animation: ${enterKeyframes} 0.2s;
`;

const StyledHintWord = styled.div`
  position: relative;

  font-size: 1rem;
  white-space: nowrap;

  display: flex;

  padding: 0.5em;
  margin: 0.5em 0;

  background-color: ${((props) => props.theme.cascada.white)};
  border-radius: 0.25em;

  border: 1px solid ${(props) => props.theme.cascada.pastelStorm};
  box-shadow: 0 0 0.2rem ${(props) => props.theme.cascada.silver};

  & + & {
    margin-left: 0.5rem;
  }
`;

const trackHintClick = (track) => {
  /* eslint-disable camelcase */
  track({
    event: 'gui:interacted',
    version: 1,
    payload: {
      gui_container: 'input_hint',
      gui_element: 'hint_tooltip',
      interaction: 'clicked',
      origin: 'lesson_player'
    }
  });
  /* eslint-enable camelcase */
};

export const InputHint = ({
  latestText,
  targetText,
  hintLevel,
  track,
  learnLanguageAlpha3
}) => {
  const [seed] = useState(Math.random() * 10000);

  const mapUsedTokens = useMapUsedTokens(learnLanguageAlpha3);

  if (hintLevel === HINT_LEVEL.NONE) {
    return null;
  }

  const usedWordMap = splitBefore(
    mapUsedTokens({
      inputText: latestText,
      referenceTokens: targetText.split('')
    }),
    ({ token }) => token === ' '
  );

  const hintWords = hintLevel === HINT_LEVEL.HINT
    ? usedWordMap.map((word) => shuffle({ array: trimWordStart(word), seed, notOriginalOrder: true }))
    : usedWordMap;

  return (
    <StyledInputHint
      data-selector="input-hint"
      onClick={() => trackHintClick(track)}
    >
      {hintWords.map((hintCharacters, index) =>
        <StyledHintWord key={index}>
          <PoseGroup>
            {hintCharacters.map(({ used, token, id }) =>
              <StyledCharacter
                data-selector="input-hint-char"
                key={id}
                used={used}>
                <Text>{token}</Text>
              </StyledCharacter>
            )}
          </PoseGroup>
        </StyledHintWord>
      )}
    </StyledInputHint>
  );
};

const mapDispatchToProps = {
  track
};

InputHint.propTypes = {
  learnLanguageAlpha3: PropTypes.string.isRequired,
  latestText: PropTypes.string.isRequired,
  targetText: PropTypes.string.isRequired,
  hintLevel: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(InputHint);
