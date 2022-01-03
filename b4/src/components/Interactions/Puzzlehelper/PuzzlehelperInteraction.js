import React, { useEffect, useState } from 'react';
import useScene, { INTERACTION_STATES } from '../shared/scene/useScene';
import Text from '../../shared/Text';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useHasLatestAttempt from '../shared/Write/hasLatestAttempt';
import { matchResult } from '../shared/Write/helpers';
import PuzzlehelperInteractionNode from './PuzzlehelperInteractionNode';
import { getActiveNode, getItem, getMistakeCount, isGap } from '../shared/scene/selectors';
import { play, requestPrompt } from '../shared/scene/actions';
import useFeedbackSounds from '../shared/useFeedbackSounds';

const quantiseStates = ({ active, activeNode, feedbackDismissed }) => {
  if (!active || !activeNode) return INTERACTION_STATES.INACTIVE;

  const { number, pending } = activeNode.attempt;
  if (number && !pending && !feedbackDismissed) return INTERACTION_STATES.FEEDBACK;

  return INTERACTION_STATES.INPUT;
};

export const PuzzlehelperInteraction = ({
  item,
  active,
  onFinish,
  learnLanguageAlpha3,
  onAttempt
}) => {
  const [
    scene,
    dispatch
  ] = useScene({
    learnLanguageAlpha3,
    item,
    matchResult
  });

  const [playFeedback, isFeedbackSoundDone] = useFeedbackSounds({
    resetDependencies: [getActiveNode(scene)]
  });
  const [feedbackDismissed, setFeedbackDismissed] = useState(true);

  const { nodes } = getItem(scene);
  const activeNode = getActiveNode(scene);

  const interactionState = quantiseStates({ active, activeNode, feedbackDismissed });

  const latestAttempt = useHasLatestAttempt(activeNode && activeNode.attempt);

  const mistakeCount = getMistakeCount(scene);

  const handleAttempt = (attemptText) => {
    if (feedbackDismissed === true) {
      setFeedbackDismissed(false);
      dispatch(requestPrompt(attemptText));
    }
  };

  const handleRetry = () => {
    setFeedbackDismissed(true);
  };

  const handleProceed = () => {
    setFeedbackDismissed(true);
    dispatch(play());
  };

  useEffect(() => {
    if (latestAttempt && active) {
      playFeedback(latestAttempt.solved);
      onAttempt({ attempt: latestAttempt });
    }
  }, [latestAttempt, onAttempt, active, playFeedback]);

  useEffect(() => {
    if (!activeNode) {
      dispatch(play());
    }
  }, [activeNode, dispatch]);

  useEffect(() => {
    if (scene.completed && active && isFeedbackSoundDone) {
      onFinish(mistakeCount);
    }
  }, [scene.completed, onFinish, mistakeCount, isFeedbackSoundDone, active]);

  return (
    <div>
      {nodes.map((node, idx) => isGap(node)
        ? <PuzzlehelperInteractionNode
          key={idx}
          node={node}
          learnLanguageAlpha3={learnLanguageAlpha3}
          interactionState={interactionState}
          onAttempt={handleAttempt}
          onRetry={handleRetry}
          onProceed={handleProceed}
        />
        : <Text key={idx} color="spaceGray" dangerouslySetInnerHTML={{ __html: node.text }} />
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3
});

PuzzlehelperInteraction.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

PuzzlehelperInteraction.trainerConfig = {

};

export default connect(mapStateToProps)(PuzzlehelperInteraction);
