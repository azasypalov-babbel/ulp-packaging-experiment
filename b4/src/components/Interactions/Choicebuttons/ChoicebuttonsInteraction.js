import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useScene, { INTERACTION_STATES } from '../shared/scene/useScene';
import { matchResult } from './matchResult';
import useHasLatestAttempt from '../shared/Write/hasLatestAttempt';
import Text from '../../shared/Text';
import ChoicebuttonsInteractionNode from './ChoicebuttonsInteractionNode';
import useFeedbackSounds from '../shared/useFeedbackSounds';
import { getActiveNode, getItem, getMistakeCount, isGap } from '../shared/scene/selectors';
import { play, requestPrompt } from '../shared/scene/actions';

const quantiseStates = ({ active, activeNode, feedbackDismissed }) => {
  if (!active || !activeNode) return INTERACTION_STATES.INACTIVE;

  const { number, pending } = activeNode.attempt;
  if (number && !pending && !feedbackDismissed) return INTERACTION_STATES.FEEDBACK;

  return INTERACTION_STATES.INPUT;
};

export const ChoicebuttonsInteraction = ({
  item,
  active,
  learnLanguageAlpha3,
  onAttempt,
  onFinish
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

  const handleRetry = useCallback(() => {
    setFeedbackDismissed(true);
  }, [setFeedbackDismissed]);

  const handleProceed = useCallback(() => {
    setFeedbackDismissed(true);
    dispatch(play());
  }, [setFeedbackDismissed, dispatch]);

  useEffect(() => {
    if (latestAttempt && active) {
      playFeedback(latestAttempt.solved);
      onAttempt({ attempt: latestAttempt });

      const isSolved = latestAttempt.solved;
      setTimeout(() => {
        if (isSolved) {
          handleProceed();
        } else {
          handleRetry();
        }
      }, 1000);
    }
  }, [latestAttempt, onAttempt, active, handleProceed, playFeedback, handleRetry]);

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
        ? <ChoicebuttonsInteractionNode
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

ChoicebuttonsInteraction.propTypes = {
  active: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

ChoicebuttonsInteraction.trainerConfig = {

};

export default connect(mapStateToProps)(ChoicebuttonsInteraction);
