import React from 'react';
import PropTypes from 'prop-types';
import { interactiveNodeType } from '../shared/scene/scenePropTypes';
import { isInteractionKey } from '../../../lib/keyboardEvents';
import ControlledGap from '../shared/Write/ControlledGap';
import Choicebuttons from './Choicebuttons';
import { INTERACTION_STATES } from '../shared/scene/useScene';

const ChoicebuttonsInteractionNode = ({
  node,
  interactionState,
  onAttempt
}) => {
  const handleKeyDown = (event) => {
    if (isInteractionKey(event, ['Shift+Escape'])) {
      event.preventDefault();
      const correctSolution = node.targetChoices.find(({ correct }) => correct);
      onAttempt(correctSolution.sentence);
      return;
    }
  };

  if (!node.active) {
    return <ControlledGap {...node} />;
  }
  return <>
    <ControlledGap
      {...node}
      onKeyDown={handleKeyDown}
      active={interactionState !== INTERACTION_STATES.INACTIVE}
      showFeedback={interactionState === INTERACTION_STATES.FEEDBACK}
    />
    {(interactionState === INTERACTION_STATES.INPUT ||
     interactionState === INTERACTION_STATES.FEEDBACK) &&
      <Choicebuttons
        showFeedback={interactionState === INTERACTION_STATES.FEEDBACK}
        attempt={node?.attempt}
        targetChoices={node.targetChoices || []}
        onAttempt={onAttempt}
      />
    }
  </>;
};

ChoicebuttonsInteractionNode.propTypes = {
  node: interactiveNodeType.isRequired,
  interactionState: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired
};


export default ChoicebuttonsInteractionNode;
