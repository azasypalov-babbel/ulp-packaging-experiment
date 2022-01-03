import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Puzzlehelper from './Puzzlehelper';
import { interactiveNodeType } from '../shared/scene/scenePropTypes';
import { stripDiacritics, replaceSpecialCharacters } from '../../../lib/matchingUtils/normalise';
import { isInteractionKey } from '../../../lib/keyboardEvents';
import ControlledGap from '../shared/Write/ControlledGap';
import { INTERACTION_STATES } from '../shared/scene/useScene';
import PuzzlehelperFeedback from './PuzzlehelperFeedback';

const normaliseText = (string) => {
  const stripedChar = stripDiacritics(string).toLowerCase();
  return replaceSpecialCharacters(stripedChar);
};

export const getTokens = (node, order) => {
  if (!node) return [];

  const targetTexts = (node.targetChoices || [])
    .filter((choice) => choice.correct)
    .map((choice) => choice.sentence);

  const tokens = targetTexts[0]
    .split('')
    .map((character, idx) => ({
      idx,
      token: character,
      used: order.includes(idx)
    }));

  return tokens;
};

const PuzzlehelperInteractionNode = ({
  node,
  interactionState,
  onAttempt,
  learnLanguageAlpha3,
  onRetry,
  onProceed
}) => {
  const [order, setOrder] = useState([]);

  const tokens = getTokens(node, order);
  const latestText = order.map((id) => tokens[id].token).join('');

  const inputCommands =  {
    insert: (id) => {
      setOrder((order) => order.concat(id));
    },
    delete: () => {
      setOrder((order) => order.slice(0, order.length - 1));
    },
    deleteAll: () => {
      setOrder([]);
    },
    return: () => {
      onAttempt(latestText);
    }
  };

  const handleKeyDown = (event) => {
    if (isInteractionKey(event, ['Shift+Escape'])) {
      event.preventDefault();
      setOrder(tokens.map(({ idx }) => idx));
      onAttempt(tokens.map(({ token }) => token).join(''));
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      inputCommands.delete();
      return;
    }
    const index = tokens.findIndex(({ used, token }) =>
      !used &&
      normaliseText(token) === normaliseText(event.key)
    );

    if (index >= 0) {
      event.preventDefault();
      inputCommands.insert(index);
    }
  };

  if (!node.active) {
    return <ControlledGap
      {...node}
      targetChoices={[node.targetChoices[0]]}
      latestText={latestText}
    />;
  }

  return <>
    <ControlledGap
      {...node}
      targetChoices={[node.targetChoices[0]]}
      onKeyDown={handleKeyDown}
      active={interactionState !== INTERACTION_STATES.INACTIVE}
      showFeedback={interactionState === INTERACTION_STATES.FEEDBACK}
      latestText={latestText}
    />
    {interactionState === INTERACTION_STATES.INPUT && <Puzzlehelper
      tokens={tokens}
      inputCommands={inputCommands}
    />}

    {interactionState === INTERACTION_STATES.FEEDBACK &&
        <PuzzlehelperFeedback
          attempt={node?.attempt}
          latestText={latestText}
          tokens={tokens}
          inputCommands={inputCommands}
          learnLanguageAlpha3={learnLanguageAlpha3}
          onRetry={() => {
            inputCommands.deleteAll();
            onRetry();
          }}
          onProceed={onProceed}
        />}
  </>;
};

PuzzlehelperInteractionNode.propTypes = {
  node: interactiveNodeType.isRequired,
  interactionState: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired
};


export default PuzzlehelperInteractionNode;
